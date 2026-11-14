import { StyleSheet } from "react-native-unistyles";

const orderNotAllowedScreenStyleSheet = StyleSheet.create((theme) => ({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        marginBottom: 32,
    },
    text: {
        fontSize: 32,
        textAlign: "center",
        color: theme.colors.disabled,
        fontWeight: "bold",
    },
}));

export default orderNotAllowedScreenStyleSheet;