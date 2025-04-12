import { createStyleSheet } from "react-native-unistyles";

const emptyProductStyleSheet = createStyleSheet(theme => ({
    container: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    message: {
        fontSize: 32,
        textAlign: "center",
        marginTop: 24,
        color: theme.colors.disabled
    },
}));

export default emptyProductStyleSheet