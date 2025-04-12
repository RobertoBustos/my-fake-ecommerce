import { createStyleSheet } from "react-native-unistyles";

const incompleteOrderStyleSheet = createStyleSheet(theme => ({
    text: {
        fontSize: 16,
        textAlign: "center",
        padding: 8,
        color: theme.colors.typography,
        fontWeight: "bold",
    },
}));

export default incompleteOrderStyleSheet