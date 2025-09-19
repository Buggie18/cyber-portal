// src/components/PolicyForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box } from "@mui/material";

export default function PolicyForm({ onPolicyAdded }) {
  const [name, setName] = useState("");
  const [rule, setRule] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "/api/policies",
        { name, definition: { rule } },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setName("");
      setRule("");
      onPolicyAdded();
    } catch {
      alert("Failed to add policy");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        label="Policy Name"
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextField
        label="Rule (e.g., deny port 22)"
        fullWidth
        margin="normal"
        value={rule}
        onChange={(e) => setRule(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Add Policy
      </Button>
    </Box>
  );
}
