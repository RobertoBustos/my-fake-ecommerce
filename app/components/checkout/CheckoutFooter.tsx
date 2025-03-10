import { Alert } from "react-native";
import { useStripeContext } from "../../contexts/StripeContext";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  preparePaymentSheet,
  updateCustomerData,
  updateOrderComplete,
} from "../../redux/order/reducer";
import {
  selectIsCustomerDataValid,
  selectIsOrderComplete,
  selectIsOrderLoading,
  selectIsShippingDataValid,
  selectOrderData,
} from "../../redux/order/selectors";
import { formatCurrency } from "../../utils/formatCurrency";
import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

const CheckoutFooter = () => {
  const dispatch = useAppDispatch();
  const { confirmPayment } = useStripeContext();
  const isCustomerDataValid = useAppSelector(selectIsCustomerDataValid());
  const isShippingDataValid = useAppSelector(selectIsShippingDataValid());
  const orderData = useAppSelector(selectOrderData);
  const isLoading = useAppSelector(selectIsOrderLoading);
  const isOrderComplete = useAppSelector(selectIsOrderComplete);
  const navigation = useAppNavigation();

  if (isOrderComplete) {
    const handleRedirect = () => {
      navigation.navigate("Confirmation");
    };

    return (
      <CustomFooter>
        <FooterButton
          text={`See your Order Confirmation`}
          disabled={isLoading}
          onPress={handleRedirect}
          isLoading={isLoading}
        />
      </CustomFooter>
    );
  }

  if (orderData !== null && orderData.status === "payment_pending") {
    const handleConfirmPayment = () => {
      dispatch(preparePaymentSheet())
        .unwrap()
        .then((response) => {
          if (response) {
            confirmPayment()
              .then(() => {
                dispatch(updateOrderComplete())
                  .unwrap()
                  .then(() => {
                    navigation.navigate("Confirmation");
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
          disabled={isLoading}
          onPress={handleConfirmPayment}
          isLoading={isLoading}
        />
      </CustomFooter>
    );
  }

  const handleRegisterCustomerData = () => {
    dispatch(updateCustomerData());
  };

  return (
    <CustomFooter>
      <FooterButton
        text={"Register Customer Information"}
        disabled={!isCustomerDataValid || !isShippingDataValid}
        onPress={handleRegisterCustomerData}
        isLoading={isLoading}
      />
    </CustomFooter>
  );
};

export default CheckoutFooter;
