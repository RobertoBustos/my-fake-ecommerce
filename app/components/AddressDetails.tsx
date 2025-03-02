import { StyleSheet, Text } from "react-native";
import CustomCard from "./common/CustomCard";
import AddressDetailsForm from "./forms/AddressDetailsForm";

const AddressDetails = () => {
  return (
    <CustomCard>
      <Text style={styles.headerText}>Address Details</Text>
      <AddressDetailsForm />
    </CustomCard>
  );
};

const styles = StyleSheet.create({
  headerText: {
    color: "teal",
    fontSize: 16,
    fontWeight: "500",
    borderBottomWidth: 3,
    borderBottomColor: "teal",
    marginBottom: 8,
  },
});

export default AddressDetails;
