import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React from "react";
import { Text, View } from "react-native";
import { useStyles } from "react-native-unistyles";
import addressHeaderStyleSheet from "../../styles/components/AddressHeader";

const AddressHeader = () => {
  const { styles, theme } = useStyles(addressHeaderStyleSheet);

  return (
    <View style={styles.container} testID="AddressHeader.Container">
      <FontAwesome6
        name="location-dot"
        size={theme.headerIconSize}
        color={theme.colors.primary}
      />
      <Text style={styles.text} testID="AddressHeader.Text">
        Enter your address to continue
      </Text>
    </View>
  );
};

export default AddressHeader;
