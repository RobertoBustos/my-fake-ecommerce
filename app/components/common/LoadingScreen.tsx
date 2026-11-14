import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import styles from "../../styles/components/LoadingScreen";
import LoadingSpinner from "../LoadingSpinner";

const LoadingScreen = () => {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container} testID="LoadingScreen.Container">
      <LoadingSpinner
        size={"large"}
        color={theme.colors.typography}
        testID="LoadingScreen.Loader"
      />
    </View>
  );
};

export default LoadingScreen;
