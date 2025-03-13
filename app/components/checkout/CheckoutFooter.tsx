import { Alert } from "react-native";
import { useOrderContext } from "../../contexts/OrderContext";
import { useStripeContext } from "../../contexts/StripeContext";
import useAppNavigation from "../../hooks/useAppNavigation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  preparePaymentSheet,
  updateOrderComplete,
} from "../../redux/order/reducer";
import {
  selectIsCustomerDataValid,
  selectIsShippingDataValid,
} from "../../redux/order/selectors";
import { formatCurrency } from "../../utils/formatCurrency";
import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

const CheckoutFooter = () => {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();
  const { confirmPayment } = useStripeContext();
  const isCustomerDataValid = useAppSelector(selectIsCustomerDataValid());
  const isShippingDataValid = useAppSelector(selectIsShippingDataValid());
  const { orderId, isUpdating, orderData, updateOrderCustomer, leaveCheckout } =
    useOrderContext();

  if (
    orderData &&
    (orderData.status === "complete" || orderData.status === "cancelled")
  ) {
    const handleGoBack = () => {
      leaveCheckout();
    };

    return (
      <CustomFooter>
        <FooterButton
          text={`Go Back`}
          onPress={handleGoBack}
          isLoading={isUpdating}
          disabled={isUpdating}
        />
      </CustomFooter>
    );
  }

  if (orderData && orderData.status === "payment_pending") {
    const handleConfirmPayment = () => {
      if (!orderId) return;
      dispatch(preparePaymentSheet(orderId))
        .unwrap()
        .then((response) => {
          if (response) {
            confirmPayment()
              .then(() => {
                dispatch(updateOrderComplete(orderId))
                  .unwrap()
                  .then(() => {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "Confirmation" }],
                    });
                  })
                  .catch((error) => {
                    Alert.alert(error.message);
                  });
              })
              .catch((error) => {
                Alert.alert(error.message);
              });
          }
        });
    };

    return (
      <CustomFooter>
        <FooterButton
          text={`Complete Your Payment for ${formatCurrency({
            amount: orderData.summary?.total || 0,
            currency: "MXN",
          })}`}
          onPress={handleConfirmPayment}
          isLoading={isUpdating}
          disabled={isUpdating}
        />
      </CustomFooter>
    );
  }

  const handleRegisterCustomerData = () => {
    updateOrderCustomer();
  };

  return (
    <CustomFooter>
      <FooterButton
        text={"Register Customer Information"}
        onPress={handleRegisterCustomerData}
        isLoading={isUpdating}
        disabled={!isCustomerDataValid || !isShippingDataValid || isUpdating}
      />
    </CustomFooter>
  );
};

export default CheckoutFooter;
