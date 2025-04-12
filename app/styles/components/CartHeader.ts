import { createStyleSheet } from "react-native-unistyles";

const cartHeaderStyleSheet = createStyleSheet((theme) => ({
    container: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
    },
    text: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 8,
        color: theme.colors.typography
    },
}));

export default cartHeaderStyleSheet;