import { PropsWithChildren, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import ToastMessage from "./common/ToastMessage";

export type LayoutPropsType = PropsWithChildren & {
  footerComponent?: ReactNode;
};

const Layout = ({ children, footerComponent }: LayoutPropsType) => {
  return (
    <View style={styles.container}>
      <ToastMessage />
      {children}
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
});

export default Layout;
