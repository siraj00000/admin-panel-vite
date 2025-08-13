export const theme = {
    primary: "#92875E",
    primaryDark: "#5C5E3D",
    secondary: "#eab308",
    background: "#1B3C46",
    text: "#B0B0B0",
    textActive: "#FFFFFF",
    semiTransparent: "rgba(255, 255, 255, 0.1)"
} as const;

export const APP_CONFIG = {
    APP_NAME: 'Islamic Admin Portal',
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1',
    TOKEN_KEY: 'authToken',
    ADMIN_DATA_KEY: 'adminData',
} as const;