import { Platform } from "react-native";
import { createStyleSheet } from "react-native-unistyles";

const productStyleSheet = createStyleSheet(theme => ({
    scrollContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    loader: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 20,
        textAlign: "center",
        marginBottom: 20,
        color: theme.colors.typography
    },
    price: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 20,
        color: theme.colors.primary,
    },
    descriptionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 20,
        textAlign: "left",
        color: theme.colors.typography
    },
    description: {
        textAlign: "justify",
        marginTop: 8,
        color: theme.colors.typography,
        marginBottom: Platform.OS === "android" ? 64 : 0
    },
    stock: {
        fontSize: 16,
        marginTop: 20,
        color: theme.colors.typography,
        fontWeight: "bold"
    },
}));

export default productStyleSheet