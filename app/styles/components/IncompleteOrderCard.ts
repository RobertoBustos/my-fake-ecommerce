import { StyleSheet } from "react-native-unistyles";

const incompleteOrderStyleSheet = StyleSheet.create(theme => ({
    text: {
        fontSize: 16,
        textAlign: "center",
        padding: 8,
        color: theme.colors.typography,
        fontWeight: "bold",
    },
}));

export default incompleteOrderStyleSheet