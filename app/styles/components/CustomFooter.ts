import { createStyleSheet } from "react-native-unistyles";

const customFooterStyleSheet = createStyleSheet(theme => ({
    container: {
        width: "100%",
        height: 70,
        paddingVertical: 8,
    }
}));

export default customFooterStyleSheet