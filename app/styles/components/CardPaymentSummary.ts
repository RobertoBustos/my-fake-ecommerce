import { createStyleSheet } from "react-native-unistyles";

const cardPaymentStyleSheet = createStyleSheet(theme => ({
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