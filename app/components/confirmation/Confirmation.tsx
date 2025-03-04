import { StyleSheet, View } from "react-native";
import ConfirmationHeader from "./ConfirmationHeader";

const Confirmation = () => {
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
