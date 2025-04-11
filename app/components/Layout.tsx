import { PropsWithChildren, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    width: "100%",
  },
});

export default Layout;
