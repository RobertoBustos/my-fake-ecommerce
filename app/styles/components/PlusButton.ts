import { StyleSheet } from "react-native-unistyles";

const plusButtonStyleSheet = StyleSheet.create(theme => ({
    button: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.primary,
        width: 100,
        height: 50,
        borderTopRightRadius: theme.borders.radius,
        borderBottomRightRadius: theme.borders.radius,
    }
}));

export default plusButtonStyleSheet