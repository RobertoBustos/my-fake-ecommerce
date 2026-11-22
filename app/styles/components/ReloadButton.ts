import { StyleSheet } from "react-native-unistyles";

const reloadButtonStyleSheet = StyleSheet.create(theme => ({
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