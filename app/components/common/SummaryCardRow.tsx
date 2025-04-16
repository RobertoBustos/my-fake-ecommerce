import { Text, View } from "react-native";
import { useStyles } from "react-native-unistyles";
import summaryCardRowStyleSheet from "../../styles/components/SummaryCardRow";

export type SummaryCardRowPropsType = {
  concept?: string;
  value?: string;
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
      {concept ? <Text style={styles.rowText}>{concept}</Text> : null}
      {value ? <Text style={styles.rowText}>{value}</Text> : ""}
    </View>
  );
};

export default SummaryCardRow;
