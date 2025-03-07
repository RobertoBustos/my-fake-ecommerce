import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { useAppSelector } from "../redux/hooks";
import { selectOrderSummaryData } from "../redux/order/selectors";
import { formatCurrency } from "../utils/formatCurrency";
import CustomCard from "./common/CustomCard";

const OrderSummary = () => {
  const orderSumaryData = useAppSelector(selectOrderSummaryData);

  return orderSumaryData ? (
    <CustomCard>
      <Text style={styles.headerText}>Order Summary</Text>
      <OrderDetailsRow
        concept={`${orderSumaryData.details.length} items`}
        value={formatCurrency({
          amount: orderSumaryData.subtotal,
          currency: "MXN",
        })}
      />
      {orderSumaryData.taxes ? (
        <OrderDetailsRow
          concept={`Taxes`}
          value={formatCurrency({
            amount: orderSumaryData.taxes,
            currency: "MXN",
          })}
        />
      ) : null}
      {orderSumaryData.discount ? (
        <OrderDetailsRow
          concept={`Discount`}
          value={formatCurrency({
            amount: orderSumaryData.discount,
            currency: "MXN",
          })}
        />
      ) : null}
      <OrderDetailsRow
        concept={`Total`}
        value={formatCurrency({
          amount: orderSumaryData.total,
          currency: "MXN",
        })}
      />
    </CustomCard>
  ) : null;
};

export type OrderDetailsRowPropsType = {
  concept: string;
  value: string;
};

export const OrderDetailsRow = ({
  concept,
  value,
}: OrderDetailsRowPropsType) => {
  return (
    <View style={styles.rowContainer}>
      <Text style={styles.rowText}>{concept}</Text>
      <Text style={styles.rowText}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "500",
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
    marginBottom: 8,
  },
  rowContainer: {
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
  },
  rowText: {
    fontSize: 16,
  },
});

export default OrderSummary;
