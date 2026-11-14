import { createStyleSheet } from "react-native-unistyles";

const navigationHeaderStyleSheet = createStyleSheet(theme => ({
    statusBarArea: {
        backgroundColor: theme.colors.primary
    },
    container: {
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 16
    },
    backContainer: {
        minWidth: 30
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: theme.colors.onPrimary
    }
}));

export default navigationHeaderStyleSheet