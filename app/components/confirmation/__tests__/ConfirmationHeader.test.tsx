import { render, screen } from "@testing-library/react-native";
import { OrderType, Status } from "../../../constants/types";
import ConfirmationHeader from "../ConfirmationHeader";

const mockSetOptions = jest.fn();
let mockOrderData: Partial<OrderType> | undefined;

jest.mock("../../../contexts/OrderContext", () => ({
  useOrderContext: () => ({ orderData: mockOrderData }),
}));
jest.mock("../../../hooks/useAppNavigation", () => () => ({ setOptions: mockSetOptions }));

const messageText = () => screen.getByTestId("ConfirmationHeader.Text").props.children;

describe("ConfirmationHeader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("thanks the user for a paid order", async () => {
    mockOrderData = { status: Status.COMPLETE };
    await render(<ConfirmationHeader orderId="order-1" />);

    expect(screen.getByText("Order Number order-1")).toBeTruthy();
    expect(messageText()).toBe("Thanks for your purchase, here's your order confirmation details");
    expect(mockSetOptions).toHaveBeenLastCalledWith({ title: "Order Complete" });
  });

  it("says an unpaid order is waiting for payment", async () => {
    mockOrderData = { status: Status.PAYMENT_PENDING };
    await render(<ConfirmationHeader orderId="order-1" />);

    expect(messageText()).toBe("Your order is waiting for payment. Complete it below.");
    expect(mockSetOptions).toHaveBeenLastCalledWith({ title: "Awaiting Payment" });
  });

  it("says a cancelled order was never paid", async () => {
    mockOrderData = { status: Status.CANCELLED };
    await render(<ConfirmationHeader orderId="order-1" />);

    expect(messageText()).toBe("This order was cancelled before it was paid.");
    expect(mockSetOptions).toHaveBeenLastCalledWith({ title: "Order Cancelled" });
  });

  it("stays neutral without the order", async () => {
    mockOrderData = undefined;
    await render(<ConfirmationHeader orderId="order-1" />);

    expect(messageText()).toBe("Here are your order details");
    expect(mockSetOptions).toHaveBeenLastCalledWith({ title: "Order" });
  });

  it("updates the title when the payment arrives", async () => {
    mockOrderData = { status: Status.PAYMENT_PENDING };
    const { rerender } = await render(<ConfirmationHeader orderId="order-1" />);

    mockOrderData = { status: Status.COMPLETE };
    await rerender(<ConfirmationHeader orderId="order-1" />);

    expect(messageText()).toBe("Thanks for your purchase, here's your order confirmation details");
    expect(mockSetOptions).toHaveBeenLastCalledWith({ title: "Order Complete" });
  });
});
