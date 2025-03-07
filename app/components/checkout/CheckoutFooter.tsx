import { Alert } from "react-native";
import { useStripeContext } from "../../contexts/StripeContext";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  createPayment,
  updateCustomerData,
  updateOrderComplete,
  updateShippingData,
} from "../../redux/order/reducer";
import {
  selectIsCustomerDataValid,
  selectIsLoadingCustomer,
  selectIsLoadingShipping,
  selectIsShippingDataValid,
  selectOrderData,
  selectOrderSummaryData,
} from "../../redux/order/selectors";
import { formatCurrency } from "../../utils/formatCurrency";
import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

const CheckoutFooter = () => {
  const dispatch = useAppDispatch();
  const {
    isLoading,
    isPaymentSheetReady,
    initializePaymentSheet,
    confirmPayment,
  } = useStripeContext();
  const isCustomerDataValid = useAppSelector(selectIsCustomerDataValid());
  const isShippingDataValid = useAppSelector(selectIsShippingDataValid());
  const isCustomerLoading = useAppSelector(selectIsLoadingCustomer);
  const isShippingLoading = useAppSelector(selectIsLoadingShipping);
  const orderData = useAppSelector(selectOrderData);

  const navigation = useAppNavigation();
  const orderSummary = useAppSelector(selectOrderSummaryData);

  const totalAmount =
    orderSummary && orderSummary !== null ? orderSummary.total : 0;

  if (
    orderData !== null &&
    (orderData?.status === "payment_pending" || orderData.status === "complete")
  ) {
    const handleConfirmPayment = () => {
      initializePaymentSheet()
        .then(() => {
          confirmPayment()
            .then(() => {
              dispatch(updateOrderComplete())
                .unwrap()
                .then(() => {
                  navigation.navigate("Confirmation");
                });
            })
            .catch((error) => {
              console.log("error on confirm payment", error);
              Alert.alert(error);
            });
        })
        .catch((error) => {
          console.log("error on initialize sheet", error);
          Alert.alert(error);
        });
    };

    return (
      <CustomFooter>
        <FooterButton
          text={`Complete Payment Info`}
          disabled={isLoading}
          onPress={handleConfirmPayment}
          isLoading={isLoading}
        />
      </CustomFooter>
    );
  }

  console.log(orderData);

  const handlePaymentIntentCreation = () => {
    dispatch(updateCustomerData())
      .unwrap()
      .then(() => {
        dispatch(updateShippingData())
          .unwrap()
          .then(() => {
            dispatch(createPayment());
          });
      });
  };

  return (
    <CustomFooter>
      <FooterButton
        text={`Prepare Payment for  ${formatCurrency({
          amount: totalAmount,
          currency: "MXN",
        })}`}
        disabled={
          !isPaymentSheetReady && (!isCustomerDataValid || !isShippingDataValid)
        }
        onPress={handlePaymentIntentCreation}
        isLoading={isLoading || isCustomerLoading || isShippingLoading}
      />
    </CustomFooter>
  );
};

export default CheckoutFooter;
