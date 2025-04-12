import { createStyleSheet } from "react-native-unistyles";

const reloadButtonStyleSheet = createStyleSheet(theme => ({
    button: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        width: 100,
        height: 50,
    },
    buttonText: {
        color: theme.colors.typography
    }
}));

export default reloadButtonStyleSheet