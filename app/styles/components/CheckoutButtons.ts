import { StyleSheet } from "react-native-unistyles";

const checkoutButtonsStyleSheet = StyleSheet.create((theme) => ({
    container: {
        width: "100%",
        height: 70,
        paddingVertical: 8,
        flexDirection: "row",
        gap: 32,
    },
    buttonContainer: {
        flex: 1,
        width: "100%"
    }
}));

export default checkoutButtonsStyleSheet;