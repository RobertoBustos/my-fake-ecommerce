import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import { colors } from "../constants/colors";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchOrder } from "../redux/order/reducer";
import { selectOrderData } from "../redux/order/selectors";
import CustomCard from "./common/CustomCard";

const PendingOrderMessage = () => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const orderData = useAppSelector(selectOrderData);

  const handleRedirect = () => {
    navigation.navigate("Checkout");
  };

  useEffect(() => {
    dispatch(fetchOrder());
    return () => {};
  }, [dispatch]);

  return orderData ? (
    <CustomCard onPress={handleRedirect} variant="warning">
      <Text style={styles.text}>Complete your last order</Text>
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
