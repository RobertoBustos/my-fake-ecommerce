export const lightTheme = {
    colors: {
        typography: '#000000',
        background: '#ffffff',
        surface: '#efefef',
        primary: '#000040',
        shadow: "#a0a0a0",
        onPrimary: "#ffffff",
        disabled: "#a3a3a3",
        warning: "#ffc107",
        error: "#dc3545",
        inputBackGround: "#d3d3d3"
    },
    margins: {
        sm: 2,
        md: 4,
        lg: 8,
        xl: 12
    },
    borders: {
        radius: 25,
        color: "#a3a3a3"
    },
    headerIconSize: 100
} as const

export const darkTheme = {
    colors: {
        typography: '#ffffff',
        background: '#121212',
        surface: 'hsl(0, 0%, 20%)',
        primary: 'hsl(240, 52%,61%)',
        shadow: "transparent",
        onPrimary: "#ffffff",
        disabled: "#a3a3a3",
        warning: "hsl(45, 52%, 61%)",
        error: "hsl(349, 52%, 61%)",
        inputBackGround: "hsl(0, 0%, 35%)"
    },
    margins: {
        sm: 2,
        md: 4,
        lg: 8,
        xl: 12
    },
    borders: {
        radius: 25,
        color: "#a3a3a3"
    },
    headerIconSize: 100
} as const

export default {
    lightTheme,
    darkTheme
}