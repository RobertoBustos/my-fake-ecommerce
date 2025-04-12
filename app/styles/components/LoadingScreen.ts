import { createStyleSheet } from "react-native-unistyles";

const loadingScreenStyleSheet = createStyleSheet((theme) => ({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    loader: {
        flex: 1,
    },
}));

export default loadingScreenStyleSheet;