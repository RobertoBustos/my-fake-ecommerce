import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { PAYMENT_POLL_INTERVAL_MS, PAYMENT_POLL_TIMEOUT_MS } from "../../../constants/config";
import { OrderType, Status } from "../../../constants/types";
import Confirmation from "../Confirmation";

const mockReloadOrder = jest.fn();
let mockOrderData: Partial<OrderType> | undefined;

jest.mock("../../../contexts/OrderContext", () => ({
  useOrderContext: () => ({ orderData: mockOrderData, reloadOrder: mockReloadOrder }),
}));
// The paid order's summaries aren't under test
jest.mock("../../PaymentSummary", () => () => null);
jest.mock("../../OrderSummary", () => () => null);
jest.mock("../../CustomerSummary", () => () => null);
jest.mock("../../AddressSummary", () => () => null);

const pendingOrder = { id: "order-1", payment: null, details: [] } as unknown as OrderType;
const paidOrder = {
  ...pendingOrder,
  payment: { paymentDetails: {} },
} as unknown as OrderType;

const advance = (ms: number) => act(() => jest.advanceTimersByTimeAsync(ms));

describe("Confirmation", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockReloadOrder.mockResolvedValue(undefined);
    mockOrderData = pendingOrder;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("checks the order again once per interval while the payment is missing", async () => {
    await render(<Confirmation />);
    expect(mockReloadOrder).not.toHaveBeenCalled();

    await advance(PAYMENT_POLL_INTERVAL_MS);
    expect(mockReloadOrder).toHaveBeenCalledTimes(1);
    await advance(PAYMENT_POLL_INTERVAL_MS);
    expect(mockReloadOrder).toHaveBeenCalledTimes(2);
  });

  it("stops checking when the payment arrives", async () => {
    const { rerender } = await render(<Confirmation />);
    await advance(PAYMENT_POLL_INTERVAL_MS);

    mockOrderData = paidOrder;
    await act(() => rerender(<Confirmation />));
    await advance(PAYMENT_POLL_INTERVAL_MS * 3);
    expect(mockReloadOrder).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("Confirmation.Container")).toBeTruthy();
  });

  it("gives up after the time limit and lets the user retry", async () => {
    await render(<Confirmation />);
    await advance(PAYMENT_POLL_TIMEOUT_MS + PAYMENT_POLL_INTERVAL_MS);
    const checks = mockReloadOrder.mock.calls.length;
    expect(checks).toBeLessThanOrEqual(PAYMENT_POLL_TIMEOUT_MS / PAYMENT_POLL_INTERVAL_MS);
    expect(screen.getByText(/still confirming your payment/)).toBeTruthy();

    await advance(PAYMENT_POLL_TIMEOUT_MS);
    expect(mockReloadOrder).toHaveBeenCalledTimes(checks);

    await act(() => fireEvent.press(screen.getByTestId("EmptyOrder.RetryButton")));
    await advance(PAYMENT_POLL_INTERVAL_MS);
    expect(mockReloadOrder).toHaveBeenCalledTimes(checks + 1);
  });

  it("waits the same interval after a failed check", async () => {
    mockReloadOrder.mockRejectedValue(new Error("Network request failed"));
    await render(<Confirmation />);
    await advance(PAYMENT_POLL_INTERVAL_MS * 3);
    expect(mockReloadOrder).toHaveBeenCalledTimes(3);
  });

  it("shows a cancelled order without waiting for a payment", async () => {
    mockOrderData = { ...pendingOrder, status: Status.CANCELLED };
    await render(<Confirmation />);
    await advance(PAYMENT_POLL_INTERVAL_MS * 3);

    expect(mockReloadOrder).not.toHaveBeenCalled();
    expect(screen.getByTestId("Confirmation.Container")).toBeTruthy();
  });

  it("doesn't check by itself when the order failed to load", async () => {
    mockOrderData = undefined;
    await render(<Confirmation />);
    await advance(PAYMENT_POLL_TIMEOUT_MS);
    expect(mockReloadOrder).not.toHaveBeenCalled();

    await act(() => fireEvent.press(screen.getByTestId("EmptyOrder.RetryButton")));
    expect(mockReloadOrder).toHaveBeenCalledTimes(1);
  });
});
