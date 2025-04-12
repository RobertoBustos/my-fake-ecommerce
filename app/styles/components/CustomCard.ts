import { createStyleSheet } from "react-native-unistyles";

const customCardStyleSheet = createStyleSheet(theme => ({
    container: {
        width: "100%",
        backgroundColor: theme.colors.surface,
        justifyContent: "space-between",
        marginVertical: 8,
        borderRadius: theme.borders.radius,
        padding: 8,
        //shadows
        shadowColor: theme.colors.shadow,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.30,
        shadowRadius: 1,
        elevation: 8,
    },
    headerText: {
        color: theme.colors.primary,
        fontSize: 16,
        fontWeight: "bold",
        borderBottomWidth: 3,
        borderBottomColor: theme.colors.primary,
        marginBottom: 8,
    },
    content: {
        flexDirection: "row"
    }
}));

export default customCardStyleSheet