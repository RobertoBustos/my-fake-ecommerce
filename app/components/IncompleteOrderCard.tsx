import { Text } from "react-native";
import { useStyles } from "react-native-unistyles";
import { IncompleteOrderType, Status } from "../constants/types";
import useAppNavigation from "../hooks/useAppNavigation";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setSelectedOrderId } from "../redux/order/reducer";
import { selectSelectedOrderId } from "../redux/order/selectors";
import incompleteOrderStyleSheet from "../styles/components/IncompleteOrderCard";
import { formatCurrency } from "../utils/formatCurrency";
import CustomCard from "./common/CustomCard";

const invalidIncompleteStatus = ["cancelled", "complete"];

export type IncompleteOrderCardPropsType = {
  data: IncompleteOrderType;
  disabled?: boolean;
};

const IncompleteOrderCard = ({
  data,
  disabled,
}: IncompleteOrderCardPropsType) => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const currentOrderId = useAppSelector(selectSelectedOrderId);
  const { styles } = useStyles(incompleteOrderStyleSheet);

  const handleRedirect = () => {
    if (currentOrderId !== data.id) {
      dispatch(setSelectedOrderId(data.id));
    }
    if (data.status === Status.PAYMENT_PENDING) {
      return navigation.navigate("Checkout", { orderId: data.id });
    }
    return navigation.navigate("Customer", { orderId: data.id });
  };

  if (invalidIncompleteStatus.includes(data.status)) {
    return null;
  }

  return (
    <CustomCard
      variant="warning"
      onPress={handleRedirect}
      testID={`IncompleteOrderList.CardContainer`}
      disabled={disabled}
    >
      <Text
        style={styles.text}
        testID={`IncompleteOrderList.CardText`}
      >{`Complete order number ${data.id} for $${formatCurrency(
        data.totals.total
      )}`}</Text>
    </CustomCard>
  );
};

export default IncompleteOrderCard;
