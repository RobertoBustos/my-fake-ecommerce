import { StyleSheet, Text, View } from "react-native";
import { useCartContext } from "../contexts/CartContext";
import { formatCurrency } from "../utils/formatCurrency";
import CustomCard from "./common/CustomCard";

const OrderDetails = () => {
  const { getCartSummary } = useCartContext();
  const data = getCartSummary();

  return (
    <CustomCard>
      <Text style={styles.headerText}>Order Summary</Text>
      <OrderDetailsRow
        concept={`${data.details.length} items`}
        value={formatCurrency({
          amount: data.subtotal,
          currency: "MXN",
        })}
      />
      {data.taxes ? (
        <OrderDetailsRow
          concept={`Taxes`}
          value={formatCurrency({
            amount: data.taxes,
            currency: "MXN",
          })}
        />
      ) : null}
      {data.discount ? (
        <OrderDetailsRow
          concept={`Discount`}
          value={formatCurrency({
            amount: data.discount,
            currency: "MXN",
          })}
        />
      ) : null}
      <OrderDetailsRow
        concept={`Total`}
        value={formatCurrency({
          amount: data.total,
          currency: "MXN",
        })}
      />
    </CustomCard>
  );
};

export type OrderDetailsRow = {
  concept: string;
  value: string;
};

export const OrderDetailsRow = ({ concept, value }: OrderDetailsRow) => {
  return (
    <View style={styles.rowContainer}>
      <Text style={styles.rowText}>{concept}</Text>
      <Text style={styles.rowText}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    color: "teal",
    fontSize: 16,
    fontWeight: "500",
    borderBottomWidth: 3,
    borderBottomColor: "teal",
    marginBottom: 8,
  },
  rowContainer: {
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  rowText: {
    fontSize: 16,
  },
});

export default OrderDetails;
