import { StyleSheet } from "react-native-unistyles";

const mapStyleSheet = StyleSheet.create(theme => ({
    container: {
        width: "100%",
        height: 300,
        borderRadius: theme.borders.radius,
        marginTop: 16
    },
    map: {
        width: "100%",
        height: "100%",
        borderRadius: theme.borders.radius
    }
}));

export default mapStyleSheet