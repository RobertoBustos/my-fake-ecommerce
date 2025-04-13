import { createStyleSheet } from "react-native-unistyles";

const addressStyleSheet = createStyleSheet((theme) => ({
    container: {
        flex: 1,
        alignItems: "center",
    },
    input: {
        alignItems: "center",
        width: "100%",
        height: 40,
        paddingHorizontal: 8,
        backgroundColor: theme.colors.inputBackGround,
        marginVertical: 4,
        fontSize: 16,
        borderColor: theme.colors.inputBackGround,
        borderWidth: 1,
        borderRadius: theme.borders.radius / 2
    }
}));

export default addressStyleSheet;