import { View } from "react-native";
import { useStyles } from "react-native-unistyles";
import loadingScreenStyleSheet from "../../styles/components/LoadingScreen";
import LoadingSpinner from "../LoadingSpinner";

const LoadingScreen = () => {
  const { styles, theme } = useStyles(loadingScreenStyleSheet);

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
