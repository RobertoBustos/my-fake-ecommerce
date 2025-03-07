import { StyleSheet, View } from "react-native";
import { colors } from "../../constants/colors";
import SkeletonWrapper from "../common/SkeletonWrapper";

export type FormSkeletonPropsType = {
  rows?: number;
};

const FormSkeleton = ({ rows = 1 }: FormSkeletonPropsType) => {
  return Array.from({ length: rows }).map((_, index) => {
    return (
      <SkeletonWrapper key={index}>
        <View style={styles.container}>
          <View style={styles.content} />
        </View>
      </SkeletonWrapper>
    );
  });
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 4,
  },
  content: {
    flex: 1,
    backgroundColor: colors.skeletonBackground,
    borderRadius: 8,
  },
});
export default FormSkeleton;
