import { act, render } from "@testing-library/react-native";
import { OrderType, Status } from "../../constants/types";
import { OrderContextType, useOrderContext } from "../OrderContext";

const mockReset = jest.fn();
const mockDispatch = jest.fn();
let mockOrder: Partial<OrderType>;
let mockCartId: string;
let mockSelectedOrderId: string | undefined;

jest.mock("../../hooks/useAppNavigation", () => () => ({
  reset: mockReset,
  navigate: jest.fn(),
}));
jest.mock("../../hooks/useOrder", () => () => ({
  fetchOrder: jest.fn(),
  orders: [mockOrder],
  isLoading: false,
}));
jest.mock("../../hooks/useCart", () => () => ({}));
jest.mock("../StripeContext", () => ({ useStripeContext: () => ({}) }));
jest.mock("../../notifications", () => ({ askForNotificationPermission: jest.fn() }));
jest.mock("../../redux/hooks", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector({
      cart: { cartId: mockCartId, items: [], selectedProductId: "" },
      order: { selectedOrderId: mockSelectedOrderId, customerData: null, addressData: null, mapCenter: null },
    }),
}));
// The reducers load uuid, whose ESM build Jest doesn't transform
jest.mock("../../redux/cart/reducer", () => ({
  renewCartId: () => ({ type: "renewCartId" }),
  setCartFromOrder: jest.fn(),
}));
jest.mock("../../redux/order/reducer", () => ({
  setAddressData: jest.fn(),
  setCustomerData: jest.fn(),
  setSelectedOrderId: (id: string | undefined) => ({ type: "setSelectedOrderId", payload: id }),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const OrderStore = require("../OrderContext").default;

const renderOrderStore = async (props: { isPaymentExpected?: boolean } = {}) => {
  const context: { current?: OrderContextType } = {};
  const Probe = () => {
    context.current = useOrderContext();
    return null;
  };
  await render(
    <OrderStore orderId="order-1" showCancelled {...props}>
      <Probe />
    </OrderStore>
  );
  return context;
};

const homeRoute = { index: 0, routes: [{ name: "Products" }] };

describe("OrderStore confirmation footer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCartId = "cart-1";
    mockSelectedOrderId = "order-1";
    mockOrder = {
      id: "order-1",
      cart: "cart-1",
      status: Status.PAYMENT_PENDING,
      customer: null,
      address: null,
      payment: null,
      totals: { total: 100, currency: "MXN" } as OrderType["totals"],
    };
  });

  it("opens Checkout for an order awaiting payment, leaving the cart as it is", async () => {
    const context = await renderOrderStore();
    expect(context.current?.footerText).toMatch(/^Complete Your Payment for /);

    await act(() => context.current?.returnFromConfirmation());
    expect(mockReset).toHaveBeenCalledWith({
      index: 1,
      routes: [{ name: "Products" }, { name: "Checkout", params: { orderId: "order-1" } }],
    });
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("goes home while the payment just made is being confirmed", async () => {
    const context = await renderOrderStore({ isPaymentExpected: true });
    expect(context.current?.footerText).toBe("Return to Home");

    await act(() => context.current?.returnFromConfirmation());
    expect(mockReset).toHaveBeenCalledWith(homeRoute);
  });

  it("starts a new cart after a completed order of the current cart", async () => {
    mockOrder.status = Status.COMPLETE;
    const context = await renderOrderStore();
    expect(context.current?.footerText).toBe("Return to Home");

    await act(() => context.current?.returnFromConfirmation());
    expect(mockDispatch).toHaveBeenCalledWith({ type: "renewCartId" });
    expect(mockDispatch).toHaveBeenCalledWith({ type: "setSelectedOrderId", payload: undefined });
    expect(mockReset).toHaveBeenCalledWith(homeRoute);
  });

  it("keeps the current cart when the order belongs to an older one", async () => {
    mockOrder.status = Status.CANCELLED;
    mockCartId = "cart-2";
    mockSelectedOrderId = "order-2";
    const context = await renderOrderStore();

    await act(() => context.current?.returnFromConfirmation());
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockReset).toHaveBeenCalledWith(homeRoute);
  });
});
