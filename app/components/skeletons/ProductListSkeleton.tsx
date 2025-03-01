import SkeletonLoading from "expo-skeleton-loading";
import { StyleSheet, View } from "react-native";

const ProductListSkeleton = () => {
  return Array.from({ length: 8 }).map((_, index) => {
    return <ProductCardSkeleton key={index} />;
  });
};

export const ProductCardSkeleton = () => {
  return (
    <SkeletonLoading background={"#adadad"} highlight={"#ffffff"}>
      <View style={styles.container}>
        <View style={styles.left} />
        <View style={styles.right} />
      </View>
    </SkeletonLoading>
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
    backgroundColor: "#adadad",
    borderRadius: 10,
  },
  right: {
    width: "30%",
    backgroundColor: "#adadad",
    borderRadius: 10,
  },
});

export default ProductListSkeleton;
