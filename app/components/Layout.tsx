import { PropsWithChildren, ReactNode } from "react";
import { View } from "react-native";
import styles from "../styles/components/Layout";
import ToastMessage from "./common/ToastMessage";

export type LayoutPropsType = PropsWithChildren & {
  headerComponent?: ReactNode;
  footerComponent?: ReactNode;
  testID?: string;
};

const Layout = ({
  children,
  headerComponent,
  footerComponent,
  testID,
}: LayoutPropsType) => {
  return (
    <View style={styles.container} testID={testID}>
      <ToastMessage />
      {headerComponent}
      <View style={styles.content}>{children}</View>
      {footerComponent}
    </View>
  );
};

export default Layout;
