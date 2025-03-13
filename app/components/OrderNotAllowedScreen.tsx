import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { useAppDispatch } from "../redux/hooks";
import { setSelectedOrderId } from "../redux/order/reducer";

export type OrderNotAllowedScreenPropsType = {
  textToDisplay: string;
};

const OrderNotAllowedScreen = ({
  textToDisplay,
}: OrderNotAllowedScreenPropsType) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(setSelectedOrderId(undefined));
    };
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <FontAwesome6
        name="face-grin-beam-sweat"
        size={100}
        color={colors.primary}
        style={styles.icon}
      />
      <Text style={styles.text}>{textToDisplay}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginBottom: 32,
  },
  text: {
    fontSize: 32,
    textAlign: "center",
    color: colors.primary,
    fontWeight: 500,
  },
});

export default OrderNotAllowedScreen;
