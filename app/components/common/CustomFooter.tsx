import { PropsWithChildren } from "react";
import { Platform } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import styles from "../../styles/components/CustomFooter";

const CustomFooter = ({ children }: PropsWithChildren) => {
  const offset = { closed: 0, opened: Platform.OS === "ios" ? 36 : 0 };

  return (
    <KeyboardStickyView style={styles.container} offset={offset}>
      {children}
    </KeyboardStickyView>
  );
};

export default CustomFooter;
