import React, { createContext, useMemo, useState, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

export const ColorModeContext = createContext({ mode: "light", toggleColorMode: () => {} });

export default function ThemeContextProvider({ children }) {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("themeMode") || "light";
  });

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: mode === "light" ? "#1976d2" : "#4a90e2" },
          secondary: { main: mode === "light" ? "#dc004e" : "#00d4ff" },
          background: {
            default: mode === "light" ? "#f4f6f8" : "#0a0e27",
            paper: mode === "light" ? "#ffffff" : "#1a1f3a",
          },
        },
        typography: {
          fontFamily: `"Roboto", "Segoe UI", "Helvetica Neue", Arial, sans-serif`,
        },
        shape: {
          borderRadius: 12, // smoother rounded corners
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                background: mode === "dark" 
                  ? "linear-gradient(135deg, #1a1f3a 0%, #0f1629 50%, #0a0e27 100%)"
                  : undefined,
                backgroundAttachment: "fixed",
                minHeight: "100vh",
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
