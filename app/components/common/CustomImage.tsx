import { useCallback, useEffect, useState } from "react";
import { Alert, Image } from "react-native";
import { useStyles } from "react-native-unistyles";
import { fileToBase64 } from "../../utils/fileToBase64";
import EmptyImage from "../EmptyImage";

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
  const [image, setImage] = useState<string | null>(null);
  const { theme } = useStyles();

  const loadImage = useCallback(async () => {
    try {
      const response = await fetch(imageUrl);
      const blobPart = await response.blob();
      const file = new File([blobPart], "image.jpg", {});
      const fileBase64 = await fileToBase64(file);
      setImage(fileBase64);
    } catch (error) {
      Alert.alert((error as Error).message);
    }
  }, [imageUrl]);

  useEffect(() => {
    loadImage();
    return () => {};
  }, [loadImage]);

  if (image === null) {
    return <EmptyImage width={width} height={height} />;
  }

  return (
    <Image
      source={{ uri: image }}
      style={{
        width,
        height,
        borderWidth: 1,
        borderColor: theme.borders.color,
        borderRadius: theme.borders.radius,
        backgroundColor: theme.colors.background,
      }}
      resizeMode="contain"
      testID={testID}
    />
  );
};

export default CustomImage;
