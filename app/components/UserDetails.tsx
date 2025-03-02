import { StyleSheet, Text } from "react-native";
import { colors } from "../constants/colors";
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
    color: colors.primary,
    fontSize: 16,
    fontWeight: "500",
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
    marginBottom: 8,
  },
});

export default UserDetails;
