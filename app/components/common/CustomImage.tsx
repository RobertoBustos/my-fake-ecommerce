import { useImage } from "expo-image";
import { Image } from "react-native";
import ImageSkeleton from "../skeletons/ImageSkeleton";

export type CustomImagePropsType = {
  imageUrl: string;
  width: number;
  height: number;
};

const CustomImage = ({ imageUrl, width, height }: CustomImagePropsType) => {
  const image = useImage(imageUrl, {
    maxHeight: height,
    maxWidth: width,
    onError(error, retry) {
      console.error("Loading failed:", error.message);
    },
  });

  if (!image) {
    return <ImageSkeleton width={width} height={height} />;
  }

  return (
    <Image src={imageUrl} style={{ width, height }} resizeMode="contain" />
  );
};

export default CustomImage;
