import React, { useEffect, useState } from "react";
import axios from "axios";
import PolicyForm from "../components/PolicyForm";
import PolicyTable from "../components/PolicyTable";
import { Container, Typography, Paper, Button, Box, useTheme } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function Policies() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "view";

  // Hardcoded dummy policies
  const dummyPolicies = [
    {
      id: "dummy-1",
      policy_id: "dummy-1",
      name: "Block SSH Access",
      status: "active",
      definition: {
        rule: "Block RDP Access"
      },
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      isDummy: true
    },
    {
      id: "dummy-2",
      policy_id: "dummy-2",
      name: "Block HTTP Traffic",
      status: "active",
      definition: {
        rule: "BLock HTTP requests"
      },
      created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      isDummy: true
    },
    {
      id: "dummy-3",
      policy_id: "dummy-3",
      name: "Allow HTTPS Only",
      status: "active",
      definition: {
        rule: "Allow HTTPS Only"
      },
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      isDummy: true
    },
    {
      id: "dummy-4",
      policy_id: "dummy-4",
      name: "Block FTP Ports",
      status: "pending",
      definition: {
        rule: "Prevent FTP Access"
      },
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      isDummy: true
    },
    {
      id: "dummy-5",
      policy_id: "dummy-5",
      name: "Rate Limit ICMP",
      status: "active",
      definition: {
        rule: "Limit ICMP Traffic"
      },
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      isDummy: true
    },
    {
      id: "dummy-6",
      policy_id: "dummy-6",
      name: "Block Telnet",
      status: "active",
      definition: {
        rule: "Block Telnet Access"
      },
      created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      isDummy: true
    },
    {
      id: "dummy-7",
      policy_id: "dummy-7",
      name: "Allow DNS Queries",
      status: "active",
      definition: {
        rule: "Allow DNS Queries"
      },
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      isDummy: true
    },
    {
      id: "dummy-8",
      policy_id: "dummy-8",
      name: "Block RDP Access",
      status: "active",
      definition: {
        rule: "Block RDP Access"
      },
      created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      isDummy: true
    }
  ];

  // Initialize with dummy policies, then fetch real ones
  const [policies, setPolicies] = useState(dummyPolicies);

  const fetchPolicies = async () => {
    try {
      const res = await axios.get("/api/policies", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      // Merge dummy policies with fetched policies (dummy policies first)
      const allPolicies = [...dummyPolicies, ...(res.data || [])];
      setPolicies(allPolicies);
    } catch (err) {
      // If API fails, still show dummy policies
      console.error("Failed to fetch policies:", err);
      setPolicies(dummyPolicies);
    }
  };

  useEffect(() => {
    if (mode === "view") {
      fetchPolicies();
    }
  }, [mode]);

  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: theme.palette.mode === "dark"
          ? "linear-gradient(135deg, #1a1f3a 0%, #0f1629 50%, #0a0e27 100%)"
          : "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)",
        backgroundAttachment: "fixed",
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
            p: 5,
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
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              background: theme.palette.mode === "dark"
                ? "linear-gradient(135deg, #4a90e2 0%, #00d4ff 100%)"
                : "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: 600,
              mb: 3,
            }}
          >
            {mode === "add" ? "➕ Add New Policy" : "📋 Policies"}
          </Typography>

          {mode === "add" ? (
            <PolicyForm onPolicyAdded={fetchPolicies} />
          ) : (
            <PolicyTable policies={policies} />
          )}

          <Button
            variant="outlined"
            sx={{
              mt: 3,
              borderColor: theme.palette.mode === "dark" ? "rgba(74, 144, 226, 0.5)" : "rgba(25, 118, 210, 0.5)",
              color: theme.palette.mode === "dark" ? "rgba(255,255,255,0.9)" : "rgba(25, 118, 210, 0.9)",
              "&:hover": {
                borderColor: theme.palette.mode === "dark" ? "rgba(74, 144, 226, 0.8)" : "rgba(25, 118, 210, 0.8)",
                background: theme.palette.mode === "dark" ? "rgba(74, 144, 226, 0.1)" : "rgba(25, 118, 210, 0.05)",
              },
            }}
            onClick={() => navigate("/dashboard")}
          >
            ⬅ Back to Dashboard
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
