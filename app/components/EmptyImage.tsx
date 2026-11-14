import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import LoadingSpinner from "./LoadingSpinner";

export type EmptyImagePropsType = {
  width: number;
  height: number;
  isLoading?: boolean;
};

const EmptyImage = ({ width, height, isLoading = true }: EmptyImagePropsType) => {
  const { theme } = useUnistyles();

  return (
    <View style={{ width, height }} testID="EmptyImage.Container">
      {isLoading && (
        <LoadingSpinner
          size={"small"}
          color={theme.colors.primary}
          testID="LoadingScreen.Loader"
        />
      )}
    </View>
  );
};

export default EmptyImage;
