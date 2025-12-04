import React, { useState, useEffect } from "react";
import axios from "axios";
import AgentCard from "../components/AgentCard";
import AgentDetails from "../components/AgentDetails";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
  // Registration form state
  const [registerForm, setRegisterForm] = useState({
    agentId: `agent-${Date.now()}`,
    name: "",
    type: "server",
    hostname: "",
    platform: "",
    osVersion: "",
    version: "1.0.0",
    apiKey: "demo-api-key",
  });

  const fetchAgents = async () => {
    try {
      const response = await axios.get("/api/agents");
      setAgents(response.data.agents || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching agents:", err);
      setError("Failed to load agents");
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadAgents = async () => {
      await fetchAgents();
      if (isMounted) setLoading(false);
    };

    loadAgents();
    const interval = setInterval(fetchAgents, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const getAgentStats = () => {
    const total = agents.length;
    const online = agents.filter((a) => a.status === "online").length;
    const offline = total - online;

    return { total, online, offline };
  };

  const handleAgentClick = (agent) => {
    setSelectedAgent(agent);
  };

  const handleCloseDetails = () => {
    setSelectedAgent(null);
  };

  const handleRegisterAgent = async () => {
    setRegisterLoading(true);
    try {
      const response = await axios.post(
        "/api/agents/register",
        {
          agentId: registerForm.agentId,
          name: registerForm.name,
          type: registerForm.type,
          hostname: registerForm.hostname || "unknown",
          platform: registerForm.platform || "unknown",
          osVersion: registerForm.osVersion || "unknown",
          version: registerForm.version,
        },
        {
          headers: {
            Authorization: `Bearer ${registerForm.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: "Agent registered successfully!",
          severity: "success",
        });
        setRegisterDialogOpen(false);
        setRegisterForm({
          agentId: `agent-${Date.now()}`,
          name: "",
          type: "server",
          hostname: "",
          platform: "",
          osVersion: "",
          version: "1.0.0",
          apiKey: "demo-api-key",
        });
        await fetchAgents();
      }
    } catch (err) {
      console.error("Error registering agent:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.error || "Failed to register agent",
        severity: "error",
      });
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleDeregisterAgent = async (agentId) => {
    if (!window.confirm(`Are you sure you want to deregister agent ${agentId}?`)) {
      return;
    }

    try {
      const response = await axios.post(
        "/api/agents/deregister",
        { agentId },
        {
          headers: {
            Authorization: `Bearer demo-api-key`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: "Agent deregistered successfully!",
          severity: "success",
        });
        await fetchAgents();
      }
    } catch (err) {
      console.error("Error deregistering agent:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.error || "Failed to deregister agent",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{ mt: 8, display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  const stats = getAgentStats();

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 4 }}>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Agents
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor and manage your security agents.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setRegisterDialogOpen(true)}
          sx={{ ml: 2 }}
        >
          Register Agent
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total agents
                </Typography>
                <Typography variant="h4">{stats.total}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Online
                </Typography>
                <Typography variant="h4" color="success.main">
                  {stats.online}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Offline
                </Typography>
                <Typography variant="h4" color="error.main">
                  {stats.offline}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {agents.length === 0 ? (
        <Paper elevation={3} sx={{ p: 6, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            No agents found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start an agent to see it appear here.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {agents.map((agent) => (
            <Grid item xs={12} md={6} lg={4} key={agent.agentId}>
              <AgentCard
                agent={agent}
                onClick={() => handleAgentClick(agent)}
                onDeregister={handleDeregisterAgent}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {selectedAgent && (
        <AgentDetails agent={selectedAgent} onClose={handleCloseDetails} />
      )}

      {/* Register Agent Dialog */}
      <Dialog open={registerDialogOpen} onClose={() => setRegisterDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Register New Agent</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Agent ID"
              value={registerForm.agentId}
              onChange={(e) => setRegisterForm({ ...registerForm, agentId: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Agent Name"
              value={registerForm.name}
              onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Agent Type"
              select
              value={registerForm.type}
              onChange={(e) => setRegisterForm({ ...registerForm, type: e.target.value })}
              required
              fullWidth
            >
              <MenuItem value="server">Server</MenuItem>
              <MenuItem value="firewall">Firewall</MenuItem>
              <MenuItem value="network">Network</MenuItem>
            </TextField>
            <TextField
              label="Hostname"
              value={registerForm.hostname}
              onChange={(e) => setRegisterForm({ ...registerForm, hostname: e.target.value })}
              fullWidth
              placeholder="Optional"
            />
            <TextField
              label="Platform"
              value={registerForm.platform}
              onChange={(e) => setRegisterForm({ ...registerForm, platform: e.target.value })}
              fullWidth
              placeholder="Optional (e.g., win32, linux)"
            />
            <TextField
              label="OS Version"
              value={registerForm.osVersion}
              onChange={(e) => setRegisterForm({ ...registerForm, osVersion: e.target.value })}
              fullWidth
              placeholder="Optional"
            />
            <TextField
              label="Version"
              value={registerForm.version}
              onChange={(e) => setRegisterForm({ ...registerForm, version: e.target.value })}
              fullWidth
            />
            <TextField
              label="API Key"
              value={registerForm.apiKey}
              onChange={(e) => setRegisterForm({ ...registerForm, apiKey: e.target.value })}
              required
              fullWidth
              type="password"
              helperText="API key for agent authentication"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRegisterDialogOpen(false)} disabled={registerLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleRegisterAgent}
            variant="contained"
            disabled={registerLoading || !registerForm.agentId || !registerForm.name || !registerForm.apiKey}
          >
            {registerLoading ? <CircularProgress size={20} /> : "Register"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Agents;