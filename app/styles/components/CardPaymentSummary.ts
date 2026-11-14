import { StyleSheet } from "react-native-unistyles";

const cardPaymentStyleSheet = StyleSheet.create(theme => ({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        marginVertical: 4,
        fontSize: 16,
        color: theme.colors.typography
    },
}));

export default cardPaymentStyleSheet