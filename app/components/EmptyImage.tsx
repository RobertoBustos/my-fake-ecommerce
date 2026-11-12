import { View } from "react-native";
import { useStyles } from "react-native-unistyles";
import LoadingSpinner from "./LoadingSpinner";

export type EmptyImagePropsType = {
  width: number;
  height: number;
};

const EmptyImage = ({ width, height }: EmptyImagePropsType) => {
  const { theme } = useStyles();

  return (
    <View style={{ width, height }}>
      <LoadingSpinner
        size={"small"}
        color={theme.colors.primary}
        testID="LoadingScreen.Loader"
      />
    </View>
  );
};

export default EmptyImage;
