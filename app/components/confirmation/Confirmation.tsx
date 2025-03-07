import { useAppSelector } from "@/app/redux/hooks";
import { selectOrderData } from "@/app/redux/order/selectors";
import { StyleSheet, View } from "react-native";
import ConfirmationHeader from "./ConfirmationHeader";

const Confirmation = () => {
  const order = useAppSelector(selectOrderData);

  return (
    <View style={styles.container}>
      <ConfirmationHeader />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Confirmation;
