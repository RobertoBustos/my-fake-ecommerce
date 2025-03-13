import { StyleSheet, View } from "react-native";
import { GLOBAL_THEME_BORDER_RADIUS, colors } from "../../constants/colors";
import SkeletonWrapper from "../common/SkeletonWrapper";

const ProductCardSkeleton = () => {
  return (
    <SkeletonWrapper>
      <View style={styles.container}>
        <View style={styles.left} />
        <View style={styles.right} />
      </View>
    </SkeletonWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    maxHeight: 140,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  left: {
    width: "65%",
    backgroundColor: colors.skeletonBackground,
    borderRadius: GLOBAL_THEME_BORDER_RADIUS,
  },
  right: {
    width: "30%",
    backgroundColor: colors.skeletonBackground,
    borderRadius: GLOBAL_THEME_BORDER_RADIUS,
  },
});

export default ProductCardSkeleton;
