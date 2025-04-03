import { PropsWithChildren } from "react";
import { Platform, StyleSheet } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";

const CustomFooter = ({ children }: PropsWithChildren) => {
  const offset = { closed: 0, opened: Platform.OS === "ios" ? 36 : 0 };

  return (
    <KeyboardStickyView style={styles.footer} offset={offset}>
      {children}
    </KeyboardStickyView>
  );
};

const styles = StyleSheet.create({
  footer: {
    width: "100%",
    height: 70,
    paddingVertical: 8,
  },
});

export default CustomFooter;
