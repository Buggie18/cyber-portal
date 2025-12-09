// src/pages/Landing.jsx
import React from "react";
import { Container, Box, Typography, Button, Stack, Paper, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { Security } from "@mui/icons-material";

export default function Landing() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: theme.palette.mode === "dark"
          ? "linear-gradient(135deg, #1a1f3a 0%, #0f1629 50%, #0a0e27 100%)"
          : "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)",
        backgroundAttachment: "fixed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme.palette.mode === "dark"
            ? "radial-gradient(circle at 20% 50%, rgba(74, 144, 226, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 212, 255, 0.1) 0%, transparent 50%)"
            : "radial-gradient(circle at 20% 50%, rgba(25, 118, 210, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(66, 165, 245, 0.1) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 8 },
            background: theme.palette.mode === "dark"
              ? "rgba(26, 31, 58, 0.85)"
              : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(15px)",
            border: theme.palette.mode === "dark"
              ? "1px solid rgba(74, 144, 226, 0.2)"
              : "1px solid rgba(25, 118, 210, 0.2)",
            borderRadius: 4,
          }}
        >
          <Box textAlign="center">
            <Box
              sx={{
                display: "inline-flex",
                p: 2,
                borderRadius: "50%",
                background: theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, #4a90e2 0%, #00d4ff 100%)"
                  : "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                color: "white",
                mb: 3,
              }}
            >
              <Security sx={{ fontSize: 48 }} />
            </Box>
            <Typography
              variant="h3"
              fontWeight={700}
              gutterBottom
              sx={{
                background: theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, #4a90e2 0%, #00d4ff 100%)"
                  : "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                mb: 2,
              }}
            >
              Welcome to Cybersecurity Portal
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.mode === "dark" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
                maxWidth: 640,
                mx: "auto",
                mb: 4,
              }}
            >
              Streamline policy management and stay on top of your security posture. Login to continue
              or create a new account to get started.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
              <Button
                component={Link}
                to="/login"
                variant="contained"
                size="large"
                sx={{
                  background: theme.palette.mode === "dark"
                    ? "linear-gradient(135deg, #4a90e2 0%, #00d4ff 100%)"
                    : "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: theme.palette.mode === "dark"
                    ? "0 4px 12px rgba(74, 144, 226, 0.3)"
                    : "0 4px 12px rgba(25, 118, 210, 0.3)",
                  "&:hover": {
                    background: theme.palette.mode === "dark"
                      ? "linear-gradient(135deg, #5aa0f2 0%, #10e4ff 100%)"
                      : "linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: theme.palette.mode === "dark"
                      ? "0 6px 16px rgba(74, 144, 226, 0.4)"
                      : "0 6px 16px rgba(25, 118, 210, 0.4)",
                  },
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: theme.palette.mode === "dark" ? "rgba(74, 144, 226, 0.5)" : "rgba(25, 118, 210, 0.5)",
                  color: theme.palette.mode === "dark" ? "rgba(255,255,255,0.9)" : "rgba(25, 118, 210, 0.9)",
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: theme.palette.mode === "dark" ? "rgba(74, 144, 226, 0.8)" : "rgba(25, 118, 210, 0.8)",
                    background: theme.palette.mode === "dark" ? "rgba(74, 144, 226, 0.1)" : "rgba(25, 118, 210, 0.05)",
                  },
                }}
              >
                Register
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}


