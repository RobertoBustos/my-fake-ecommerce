import summaryCardRowStyleSheet from "@/app/styles/components/SummaryCardRow";
import { Text, View } from "react-native";
import { useStyles } from "react-native-unistyles";

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
  const { styles } = useStyles(summaryCardRowStyleSheet);

  return (
    <View style={styles.rowContainer} testID={testID}>
      <Text style={styles.rowText}>{concept}</Text>
      <Text style={styles.rowText}>{value}</Text>
    </View>
  );
};

export default SummaryCardRow;
