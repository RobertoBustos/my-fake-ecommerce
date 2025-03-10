import { StyleSheet, Text } from "react-native";
import { colors } from "../constants/colors";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { useAppSelector } from "../redux/hooks";
import { selectIncompleteOrders } from "../redux/order/selectors";
import CustomCard from "./common/CustomCard";

const PendingOrderMessage = () => {
  const navigation = useAppNavigation();
  const incompleteOrders = useAppSelector(selectIncompleteOrders);

  const handleRedirect = () => {
    navigation.navigate("Checkout", {
      orderId: incompleteOrders[3].orderId,
    });
  };

  return incompleteOrders.length > 0 ? (
    <CustomCard onPress={handleRedirect} variant="warning">
      <Text
        style={styles.text}
      >{`You have ${incompleteOrders.length} incomplete orders`}</Text>
    </CustomCard>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 70,
    backgroundColor: colors.warning,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    padding: 8,
    color: colors.primary,
    fontWeight: 500,
  },
});

export default PendingOrderMessage;
