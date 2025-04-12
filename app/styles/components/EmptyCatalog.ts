import { createStyleSheet } from "react-native-unistyles";

const emptyCatalogStyleSheet = createStyleSheet((theme) => ({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    message: {
        fontSize: 32,
        textAlign: "center",
        marginTop: 24,
        color: theme.colors.disabled,
        marginBottom: 16,
    },
}));

export default emptyCatalogStyleSheet;