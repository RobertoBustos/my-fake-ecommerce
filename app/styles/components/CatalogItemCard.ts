import { StyleSheet } from "react-native-unistyles";

const catalogItemCardStyleSheet = StyleSheet.create((theme) => ({
    description: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 16,
        color: theme.colors.typography
    },
    price: {
        color: theme.colors.primary,
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
}));

export default catalogItemCardStyleSheet;