// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Container, TextField, Button, Typography, Box, Paper, InputAdornment, IconButton, Avatar, Stack, useTheme } from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined } from "@mui/icons-material";
import {jwtDecode} from "jwt-decode";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending login request for:", username);
  
      const res = await axios.post("/api/login", { username, password });
      console.log("Login response:", res.data);
  
      const token = res.data.token;
      if (!token) {
        console.error("No token received!");
        alert("Login failed! No token.");
        return;
      }
  
      console.log("Token received:", token);
  
      // Decode JWT
      const decodedToken = jwtDecode(token);
      console.log("Decoded token:", decodedToken);
  
      // Save token and role
      localStorage.setItem("token", token);
      localStorage.setItem("role", decodedToken.role);
      console.log("Role saved to localStorage:", decodedToken.role);
  
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response || err.message);
      alert("Login failed! Check username/password.");
    }
  };
  

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        background: theme.palette.mode === "dark"
          ? "linear-gradient(135deg, #1a1f3a 0%, #0f1629 50%, #0a0e27 100%)"
          : "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)",
        backgroundAttachment: "fixed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
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
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            width: "100%",
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
          <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                background: theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, #4a90e2 0%, #00d4ff 100%)"
                  : "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
              }}
            >
              <LockOutlined />
            </Avatar>
            <Typography
              variant="h5"
              fontWeight={600}
              sx={{
                background: theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, #4a90e2 0%, #00d4ff 100%)"
                  : "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Welcome back
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.mode === "dark" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
              }}
            >
              Sign in to continue to your dashboard
            </Typography>
          </Stack>
          <Box component="form" onSubmit={handleLogin}>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                mt: 2,
                background: theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, #4a90e2 0%, #00d4ff 100%)"
                  : "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                color: "white",
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
          </Box>
          <Typography
            sx={{ mt: 2 }}
            textAlign="center"
            variant="body2"
            style={{
              color: theme.palette.mode === "dark" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: theme.palette.mode === "dark" ? "#4a90e2" : "#1976d2",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Register here
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
