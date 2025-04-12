import { createStyleSheet } from "react-native-unistyles";

const orderConfirmationItemStyleSheet = createStyleSheet(theme => ({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        width: "100%",
    },
    text: {
        color: theme.colors.typography,
        fontSize: 14,
    },
    subtotal: {
        color: theme.colors.primary,
        fontWeight: "bold",
        fontSize: 16,
    },
}));

export default orderConfirmationItemStyleSheet