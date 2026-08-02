import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#4f46e5" },
        background: { default: "#ffffff", paper: "#ffffff" },
      },
    },
    dark: {
      palette: {
        primary: { main: "#818cf8" },
        background: { default: "#0a0a0a", paper: "#141414" },
        error: { main: "#f87171" },
        success: { main: "#4ade80" },
      },
    },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
    fontSize: 14,
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { textTransform: "none" } },
    },
  },
});

export default theme;
