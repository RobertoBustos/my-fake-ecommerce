import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { useCartContext } from "../contexts/CartContext";
import { formatCurrency } from "../utils/formatCurrency";
import CustomCard from "./common/CustomCard";

const OrderDetails = () => {
  const { cartSummary } = useCartContext();

  return (
    <CustomCard>
      <Text style={styles.headerText}>Order Summary</Text>
      <OrderDetailsRow
        concept={`${cartSummary.details.length} items`}
        value={formatCurrency({
          amount: cartSummary.subtotal,
          currency: "MXN",
        })}
      />
      {cartSummary.taxes ? (
        <OrderDetailsRow
          concept={`Taxes`}
          value={formatCurrency({
            amount: cartSummary.taxes,
            currency: "MXN",
          })}
        />
      ) : null}
      {cartSummary.discount ? (
        <OrderDetailsRow
          concept={`Discount`}
          value={formatCurrency({
            amount: cartSummary.discount,
            currency: "MXN",
          })}
        />
      ) : null}
      <OrderDetailsRow
        concept={`Total`}
        value={formatCurrency({
          amount: cartSummary.total,
          currency: "MXN",
        })}
      />
    </CustomCard>
  );
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

export default OrderDetails;
