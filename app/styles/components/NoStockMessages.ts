import { StyleSheet } from "react-native-unistyles";

const noStockMessageStyleSheet = StyleSheet.create(theme => ({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop: 30,
    },
    text: {
        fontSize: 16,
        textAlign: "center",
        marginTop: 30,
        paddingHorizontal: 24,
        color: theme.colors.error
    },
}));

export default noStockMessageStyleSheet