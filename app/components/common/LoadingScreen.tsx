import { ActivityIndicator, StyleSheet, View } from "react-native";
import { colors } from "../../constants/colors";

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size={"large"}
        color={colors.primary}
        style={styles.loader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  loader: {
    flex: 1,
  },
});

export default LoadingScreen;
