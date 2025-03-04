import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

const CustomFooter = ({ children }: PropsWithChildren) => {
  return <View style={styles.footer}>{children}</View>;
};

const styles = StyleSheet.create({
  footer: {
    width: "100%",
    height: 70,
    paddingVertical: 8,
  },
});

export default CustomFooter;
