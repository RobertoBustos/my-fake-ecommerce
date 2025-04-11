import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/colors";

export type SummaryCardRowPropsType = {
  concept: string;
  value: string;
  testID?: string;
};

export const SummaryCardRow = ({
  concept,
  value,
  testID,
}: SummaryCardRowPropsType) => {
  return (
    <View style={styles.rowContainer} testID={testID}>
      <Text style={styles.rowText}>{concept}</Text>
      <Text style={styles.rowText}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
  },
  rowText: {
    fontSize: 16,
  },
});

export default SummaryCardRow;
