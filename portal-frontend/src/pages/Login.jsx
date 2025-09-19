// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Container, TextField, Button, Typography, Box, Paper, InputAdornment, IconButton, Avatar, Stack } from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined } from "@mui/icons-material";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/login", { username, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed! Check username/password.");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", py: 2 }}
    >
      <Paper elevation={6} sx={{ p: { xs: 2.5, md: 4 }, width: "100%" }}>
        <Stack alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
          <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
            <LockOutlined />
          </Avatar>
          <Typography variant="h5" fontWeight={600}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary">
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
          <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 1.5 }}>
            Login
          </Button>
        </Box>
        <Typography sx={{ mt: 1.5 }} textAlign="center" variant="body2">
          Don’t have an account? <Link to="/register">Register here</Link>
        </Typography>
      </Paper>
    </Container>
  );
}
