import { ActivityIndicator, View } from "react-native";
import { useStyles } from "react-native-unistyles";
import loadingScreenStyleSheet from "../../styles/components/LoadingScreen";

const LoadingScreen = () => {
  const { styles, theme } = useStyles(loadingScreenStyleSheet);

  return (
    <View style={styles.container} testID="LoadingScreen.Container">
      <ActivityIndicator
        size={"large"}
        color={theme.colors.typography}
        style={styles.loader}
        testID="LoadingScreen.Loader"
      />
    </View>
  );
};

export default LoadingScreen;
