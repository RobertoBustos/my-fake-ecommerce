import customFooterStyleSheet from "@/app/styles/components/CustomFooter";
import { PropsWithChildren } from "react";
import { Platform } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { useStyles } from "react-native-unistyles";

const CustomFooter = ({ children }: PropsWithChildren) => {
  const { styles } = useStyles(customFooterStyleSheet);
  const offset = { closed: 0, opened: Platform.OS === "ios" ? 36 : 0 };

  return (
    <KeyboardStickyView style={styles.container} offset={offset}>
      {children}
    </KeyboardStickyView>
  );
};

export default CustomFooter;
