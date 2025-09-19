// src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Container, TextField, Button, Typography, Box, Paper, InputAdornment, IconButton, Avatar, Stack } from "@mui/material";
import { Visibility, VisibilityOff, PersonAddAlt1 } from "@mui/icons-material";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/register", { username, password });
      alert("User registered! Please log in.");
      navigate("/login");
    } catch (err) {
      alert("Registration failed!");
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
            <PersonAddAlt1 />
          </Avatar>
          <Typography variant="h5" fontWeight={600}>
            Create your account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join to manage your security policies
          </Typography>
        </Stack>
        <Box component="form" onSubmit={handleRegister}>
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
            autoComplete="new-password"
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
            Register
          </Button>
        </Box>
        <Typography sx={{ mt: 1.5 }} textAlign="center" variant="body2">
          Already have an account? <Link to="/login">Login here</Link>
        </Typography>
      </Paper>
    </Container>
  );
}
