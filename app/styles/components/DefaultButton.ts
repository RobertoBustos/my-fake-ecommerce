import { createStyleSheet } from "react-native-unistyles";

const defaultButtonStyleSheet = createStyleSheet(theme => ({
    button: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borders.radius,
    },
    buttonText: {
        color: theme.colors.onPrimary,
        fontWeight: "bold",
        fontSize: 16,
    }
}));

export default defaultButtonStyleSheet