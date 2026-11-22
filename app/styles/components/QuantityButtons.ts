import { Platform } from "react-native";
import { StyleSheet } from "react-native-unistyles";

const quantityButtonsStyleSheet = StyleSheet.create(theme => ({
    container: {
        flexDirection: "row",
        height: "auto",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    quantity: {
        flex: 1,
        fontSize: 24,
        height: "100%",
        textAlign: "center",
        textAlignVertical: "center",
        paddingVertical: Platform.OS === "ios" ? 7 : 0,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderTopColor: theme.borders.color,
        borderBottomColor: theme.borders.color,
        backgroundColor: theme.colors.surface,
        color: theme.colors.typography
    },
}));

export default quantityButtonsStyleSheet