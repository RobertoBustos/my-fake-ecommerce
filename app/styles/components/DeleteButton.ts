import { createStyleSheet } from "react-native-unistyles";

const deleteButtonStyleSheet = createStyleSheet(theme => ({
    button: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
}));

export default deleteButtonStyleSheet