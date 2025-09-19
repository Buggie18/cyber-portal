import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import { Container, Typography, Paper, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username || "User");
      } catch {
        setUsername("User");
      }
    }
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Paper elevation={4} sx={{ p: 5, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {username} 🎉
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          This is your cybersecurity portal dashboard.  
          Use the buttons below to manage firewall policies.
        </Typography>

        <Stack spacing={2} direction="row" justifyContent="center">
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/policies?mode=add")}
          >
            ➕ Add Policy
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/policies?mode=view")}
          >
            📋 View Policies
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
