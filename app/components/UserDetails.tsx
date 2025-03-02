import { StyleSheet, Text } from "react-native";
import CustomCard from "./common/CustomCard";
import UserDetailsForm from "./forms/UserDetailsForm";

const UserDetails = () => {
  return (
    <CustomCard>
      <Text style={styles.headerText}>User Details</Text>
      <UserDetailsForm />
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

export default UserDetails;
