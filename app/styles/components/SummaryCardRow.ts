import { createStyleSheet } from "react-native-unistyles";

const summaryCardRowStyleSheet = createStyleSheet((theme) => ({
    rowContainer: {
        paddingVertical: 4,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.disabled,
    },
    rowText: {
        fontSize: 16,
        color: theme.colors.typography
    },
}));

export default summaryCardRowStyleSheet;