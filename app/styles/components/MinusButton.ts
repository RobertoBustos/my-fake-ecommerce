import { StyleSheet } from "react-native-unistyles";

const minusButtonStyleSheet = StyleSheet.create(theme => ({
    button: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.primary,
        width: 100,
        height: 50,
        borderTopLeftRadius: theme.borders.radius,
        borderBottomLeftRadius: theme.borders.radius,
    }
}));

export default minusButtonStyleSheet