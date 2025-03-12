import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { colors } from "../../constants/colors";
import SkeletonWrapper from "../common/SkeletonWrapper";

export type FormSkeletonPropsType = {
  rows?: number;
  rowHeight?: number;
};

const FormSkeleton = ({ rows = 1, rowHeight = 45 }: FormSkeletonPropsType) => {
  return Array.from({ length: rows }).map((_, index) => {
    const mixedStyles: StyleProp<ViewStyle> = { ...styles.container };
    mixedStyles.height = rowHeight;

    return (
      <SkeletonWrapper key={index}>
        <View style={mixedStyles}>
          <View style={styles.content} />
        </View>
      </SkeletonWrapper>
    );
  });
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 4,
  },
  content: {
    flex: 1,
    backgroundColor: colors.skeletonBackground,
    borderRadius: 10,
  },
});
export default FormSkeleton;
