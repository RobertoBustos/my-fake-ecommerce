import loadingScreenStyleSheet from "@/app/styles/components/LoadingScreen";
import { ActivityIndicator, View } from "react-native";
import { useStyles } from "react-native-unistyles";

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
