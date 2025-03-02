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
      {footerComponent && footerComponent !== null ? (
        <View style={styles.footer}>{footerComponent}</View>
      ) : null}
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
  footer: {
    width: "100%",
    height: 70,
    paddingVertical: 8,
  },
});

export default Layout;
