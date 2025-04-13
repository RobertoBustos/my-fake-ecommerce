import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React from "react";
import { Text, View } from "react-native";
import { useStyles } from "react-native-unistyles";
import customerHeaderStyleSheet from "../../styles/components/CustomerHeader";

const CustomerHeader = () => {
  const { styles, theme } = useStyles(customerHeaderStyleSheet);

  return (
    <View style={styles.container} testID="CustomerHeader.Container">
      <FontAwesome6
        name="user-shield"
        size={theme.headerIconSize}
        color={theme.colors.primary}
      />
      <Text style={styles.text} testID="CustomerHeader.Text">
        Enter your information to continue
      </Text>
    </View>
  );
};

export default CustomerHeader;
