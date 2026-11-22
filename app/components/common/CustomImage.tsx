import { useEffect, useState } from "react";
import { Image } from "react-native";
import { useUnistyles } from "react-native-unistyles";
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
  // The result is kept with its URL: one for another URL is stale while the new one loads.
  // A null image means it couldn't be loaded
  const [loaded, setLoaded] = useState<{ url: string; image: string | null }>();
  const { theme } = useUnistyles();

  useEffect(() => {
    // fetch throws on an empty URL, and some products have no image
    if (!imageUrl) return;
    let isCurrent = true;
    const loadImage = async () => {
      try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blobPart = await response.blob();
        const file = new File([blobPart], "image.jpg", {});
        const fileBase64 = await fileToBase64(file);
        if (isCurrent) setLoaded({ url: imageUrl, image: fileBase64 });
      } catch (error) {
        // A missing image is not worth interrupting the user: keep the placeholder
        console.warn(`Could not load the image ${imageUrl}: ${(error as Error).message}`);
        if (isCurrent) setLoaded({ url: imageUrl, image: null });
      }
    };
    loadImage();
    return () => {
      isCurrent = false;
    };
  }, [imageUrl]);

  const result = loaded?.url === imageUrl ? loaded : undefined;
  const image = result?.image;
  const hasFailed = !imageUrl || image === null;

  if (!image) {
    return <EmptyImage width={width} height={height} isLoading={!hasFailed} />;
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
