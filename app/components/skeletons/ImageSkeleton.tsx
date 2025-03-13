import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { GLOBAL_THEME_BORDER_RADIUS, colors } from "../../constants/colors";
import SkeletonWrapper from "../common/SkeletonWrapper";

export type ImageSkeletonPropsType = {
  width: number;
  height: number;
};

const ImageSkeleton = ({
  height = 140,
  width = 140,
}: ImageSkeletonPropsType) => {
  const mixedStyles: StyleProp<ViewStyle> = { ...styles.container };

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
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 16,
  },
  image: {
    flex: 1,
    backgroundColor: colors.skeletonBackground,
    borderRadius: GLOBAL_THEME_BORDER_RADIUS,
  },
});

export default ImageSkeleton;
