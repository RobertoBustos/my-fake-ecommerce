import { createStyleSheet } from "react-native-unistyles";

const layoutStyleSheet = createStyleSheet((theme) => ({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingHorizontal: 16,
        backgroundColor: theme.colors.background
    },
    content: {
        flex: 1,
        width: "100%",
    },
}));

export default layoutStyleSheet;