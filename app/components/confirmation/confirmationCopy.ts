import { Status } from "../../constants/types";

export type ConfirmationCopy = {
  title: string;
  message: string;
  icon: "shopping-bag" | "file-invoice-dollar" | "ban";
};

// The confirmation screen also opens orders that aren't paid, from a "Payment failed" or
// "Order cancelled" notification or a link, so its wording follows the order's status.
// Right after paying in the app, the order awaits the payment that is being confirmed
export const getConfirmationCopy = (
  status: Status | undefined,
  isPaymentExpected = false
): ConfirmationCopy => {
  if (status === Status.PAYMENT_PENDING && isPaymentExpected) {
    return {
      title: "Confirming Payment",
      message: "We are confirming your payment, it will show here in a moment.",
      icon: "file-invoice-dollar",
    };
  }
  switch (status) {
    case Status.COMPLETE:
      return {
        title: "Order Complete",
        message: "Thanks for your purchase, here's your order confirmation details",
        icon: "shopping-bag",
      };
    case Status.PAYMENT_PENDING:
      return {
        title: "Awaiting Payment",
        message: "Your order is waiting for payment. Complete it below.",
        icon: "file-invoice-dollar",
      };
    case Status.CANCELLED:
      return {
        title: "Order Cancelled",
        message: "This order was cancelled before it was paid.",
        icon: "ban",
      };
    // While the order loads, and for any other status
    default:
      return {
        title: "Order",
        message: "Here are your order details",
        icon: "shopping-bag",
      };
  }
};
