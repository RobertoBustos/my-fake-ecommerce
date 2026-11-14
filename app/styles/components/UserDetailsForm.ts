import { StyleSheet } from "react-native-unistyles";

const userDetailsFormStyleSheet = StyleSheet.create((theme) => ({
    container: {
        flex: 1,
    },
    input: {
        alignItems: "center",
        width: "100%",
        height: 60,
        paddingHorizontal: 8,
        backgroundColor: theme.colors.inputBackGround,
        marginVertical: 16,
        fontSize: 16,
        borderColor: theme.colors.inputBackGround,
        borderWidth: 1,
        borderRadius: theme.borders.radius / 2,
        color: theme.colors.typography
    },
    errorText: {
        color: theme.colors.error,
    },
}));

export default userDetailsFormStyleSheet;