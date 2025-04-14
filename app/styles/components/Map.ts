import { createStyleSheet } from "react-native-unistyles";

const mapStyleSheet = createStyleSheet(theme => ({
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