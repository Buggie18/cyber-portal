// src/pages/Landing.jsx
import React from "react";
import { Container, Box, Typography, Button, Stack, Paper } from "@mui/material";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <Container maxWidth="md" sx={{ mt: { xs: 6, md: 12 } }}>
      <Paper elevation={6} sx={{ p: { xs: 3, md: 6 } }}>
        <Box textAlign="center">
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Welcome to Cybersecurity Portal
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640, mx: "auto", mb: 4 }}>
            Streamline policy management and stay on top of your security posture. Login to continue
            or create a new account to get started.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            <Button component={Link} to="/login" variant="contained" size="large">
              Login
            </Button>
            <Button component={Link} to="/register" variant="outlined" size="large">
              Register
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}


