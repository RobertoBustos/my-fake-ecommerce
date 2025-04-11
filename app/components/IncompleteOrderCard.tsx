import { StyleSheet, Text } from "react-native";
import { colors } from "../constants/colors";
import { IncompleteOrderType } from "../constants/types";
import useAppNavigation from "../hooks/useAppNavigation";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setSelectedOrderId } from "../redux/order/reducer";
import { selectSelectedOrderId } from "../redux/order/selectors";
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

  const handleRedirect = () => {
    if (currentOrderId !== data.id) {
      dispatch(setSelectedOrderId(data.id));
    }
    navigation.navigate("Checkout", { orderId: data.id });
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

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    textAlign: "center",
    padding: 8,
    color: colors.primary,
    fontWeight: 500,
  },
});

export default IncompleteOrderCard;
