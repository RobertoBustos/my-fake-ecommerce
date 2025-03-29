import { useOrderContext } from "../../contexts/OrderContext";
import { useAppSelector } from "../../redux/hooks";
import {
  selectIsCustomerDataValid,
  selectIsShippingDataValid,
} from "../../redux/order/selectors";
import { formatCurrency } from "../../utils/formatCurrency";
import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

const CheckoutFooter = () => {
  const isCustomerDataValid = useAppSelector(selectIsCustomerDataValid());
  const isShippingDataValid = useAppSelector(selectIsShippingDataValid());
  const {
    orderData,
    updateOrder,
    isLoading,
    isUpdating,
    completeOrder,
    isCreatingPayment,
  } = useOrderContext();

  if (orderData && orderData.status === "PAYMENT_PENDING") {
    const handleConfirmPayment = () => {
      completeOrder();
    };

    return (
      <CustomFooter>
        <FooterButton
          text={`Complete Your Payment for ${formatCurrency(
            orderData.totals.total
          )}`}
          onPress={handleConfirmPayment}
          isLoading={isCreatingPayment}
          disabled={isCreatingPayment}
        />
      </CustomFooter>
    );
  }

  const handleRegisterCustomerData = () => {
    updateOrder();
  };

  return (
    <CustomFooter>
      <FooterButton
        text={"Confirm Your Order Information"}
        onPress={handleRegisterCustomerData}
        isLoading={isUpdating || isLoading}
        disabled={
          !isCustomerDataValid ||
          !isShippingDataValid ||
          isUpdating ||
          isLoading
        }
      />
    </CustomFooter>
  );
};

export default CheckoutFooter;
