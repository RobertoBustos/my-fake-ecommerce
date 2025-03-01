import { StyleSheet, View } from "react-native";
import SkeletonWrapper from "../common/SkeletonWrapper";

export type ImageSkeletonPropsType = {
  width: number;
  height: number;
};

const ImageSkeleton = ({ height, width }: ImageSkeletonPropsType) => {
  const mixedStyles = { ...styles.container };

  mixedStyles.height = height;
  mixedStyles.width = width;

  return (
    <SkeletonWrapper>
      <View style={mixedStyles}>
        <View style={styles.image} />
      </View>
    </SkeletonWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 140,
    height: 140,
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 16,
  },
  image: {
    flex: 1,
    backgroundColor: "#adadad",
    borderRadius: 10,
  },
});

export default ImageSkeleton;
