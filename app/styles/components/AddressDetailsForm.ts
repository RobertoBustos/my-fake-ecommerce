import { createStyleSheet } from "react-native-unistyles";

const addressDetailsFormStyleSheet = createStyleSheet((theme) => ({
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
        borderRadius: theme.borders.radius / 2
    }
}));

export default addressDetailsFormStyleSheet;