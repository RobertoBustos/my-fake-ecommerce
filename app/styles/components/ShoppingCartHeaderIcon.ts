import { StyleSheet } from "react-native-unistyles";

const shoppingCartHeaderIconStylesheet = StyleSheet.create(theme => ({
    container: {
        minWidth: 30,
        position: "relative"
    },
    notificationContainer: {
        backgroundColor: theme.colors.error,
        alignItems: "center",
        justifyContent: "center",
        width: 25,
        borderRadius: theme.borders.radius,
        top: 16,
        left: 16,
        position: "absolute"
    },
    notificationText: {
        color: theme.colors.onPrimary,
        fontWeight: "bold",
        fontSize: 16
    }
}));

export default shoppingCartHeaderIconStylesheet