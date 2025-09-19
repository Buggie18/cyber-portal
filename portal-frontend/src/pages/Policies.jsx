import React, { useEffect, useState } from "react";
import axios from "axios";
import PolicyForm from "../components/PolicyForm";
import PolicyTable from "../components/PolicyTable";
import { Container, Typography, Paper, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function Policies() {
  const [policies, setPolicies] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "view";

  const fetchPolicies = async () => {
    try {
      const res = await axios.get("/api/policies", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setPolicies(res.data);
    } catch {
      alert("Failed to fetch policies");
    }
  };

  useEffect(() => {
    if (mode === "view") fetchPolicies();
  }, [mode]);

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Paper elevation={4} sx={{ p: 5 }}>
        <Typography variant="h5" gutterBottom>
          {mode === "add" ? "➕ Add New Policy" : "📋 Policies"}
        </Typography>

        {mode === "add" ? (
          <PolicyForm onPolicyAdded={fetchPolicies} />
        ) : (
          <PolicyTable policies={policies} />
        )}

        <Button
          variant="text"
          sx={{ mt: 3 }}
          onClick={() => navigate("/dashboard")}
        >
          ⬅ Back to Dashboard
        </Button>
      </Paper>
    </Container>
  );
}
