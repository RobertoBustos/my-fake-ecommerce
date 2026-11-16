import { StyleSheet } from "react-native-unistyles";

const cartItemCardStyleSheet = StyleSheet.create((theme) => ({
    description: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        color: theme.colors.typography
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 16,
        color: theme.colors.typography
    },
    price: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 16,
        color: theme.colors.typography
    },
    subtotal: {
        fontSize: 24,
        fontWeight: "bold",
        color: theme.colors.primary,
    },
    image: {
        backgroundColor: "red"
    }
}));

export default cartItemCardStyleSheet;