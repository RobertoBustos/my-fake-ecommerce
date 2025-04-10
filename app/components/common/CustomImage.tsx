import { useImage } from "expo-image";
import { Image } from "react-native";

export type CustomImagePropsType = {
  imageUrl: string;
  width: number;
  height: number;
  testID?: string;
};

const CustomImage = ({
  imageUrl,
  width,
  height,
  testID,
}: CustomImagePropsType) => {
  const image = useImage(imageUrl, {
    maxHeight: height,
    maxWidth: width,
    onError(error, retry) {},
  });

  if (!image) {
    return null;
  }

  return (
    <Image
      src={imageUrl}
      style={{ width, height }}
      resizeMode="contain"
      testID={testID}
    />
  );
};

export default CustomImage;
