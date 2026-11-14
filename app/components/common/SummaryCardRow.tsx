import { Text, View } from "react-native";
import styles from "../../styles/components/SummaryCardRow";

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
  return (
    <View style={styles.rowContainer} testID={testID}>
      {concept ? <Text style={styles.rowText}>{concept}</Text> : null}
      {value ? <Text style={styles.rowText}>{value}</Text> : ""}
    </View>
  );
};

export default SummaryCardRow;
