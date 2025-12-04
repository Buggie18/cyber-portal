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
  Tabs,
  Tab,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  AssignmentTurnedIn as AssignPolicyIcon,
  Description as LogsIcon,
  ShowChart as MetricsIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PersonAdd as RegisterIcon,
  PersonRemove as DeregisterIcon,
  Assignment as PolicyIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dialog states
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [policyDialogOpen, setPolicyDialogOpen] = useState(false);
  const [metricsDialogOpen, setMetricsDialogOpen] = useState(false);
  const [logsDialogOpen, setLogsDialogOpen] = useState(false);
  
  const [registerLoading, setRegisterLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
  // Selection for bulk operations
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState("");
  
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

  // Agent logs and metrics
  const [agentLogs, setAgentLogs] = useState([]);
  const [agentMetrics, setAgentMetrics] = useState([]);

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

  const fetchPolicies = async () => {
    try {
      const response = await axios.get("/api/policies");
      setPolicies(response.data.policies || []);
    } catch (err) {
      console.error("Error fetching policies:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      await Promise.all([fetchAgents(), fetchPolicies()]);
      if (isMounted) setLoading(false);
    };

    loadData();
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

  const handleRefresh = async () => {
    setLoading(true);
    await fetchAgents();
    setLoading(false);
    showSnackbar("Agents refreshed successfully", "success");
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
        showSnackbar("Agent registered successfully!", "success");
        setRegisterDialogOpen(false);
        resetRegisterForm();
        await fetchAgents();
      }
    } catch (err) {
      console.error("Error registering agent:", err);
      showSnackbar(err.response?.data?.error || "Failed to register agent", "error");
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleDeregisterAgent = async (agentId, agentName) => {
    if (!window.confirm(`Are you sure you want to deregister agent "${agentName}"?`)) {
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
        showSnackbar(`Agent "${agentName}" deregistered successfully!`, "success");
        await fetchAgents();
      }
    } catch (err) {
      console.error("Error deregistering agent:", err);
      showSnackbar(err.response?.data?.error || "Failed to deregister agent", "error");
    }
  };

  const handleAssignPolicy = async () => {
    if (!selectedPolicy) {
      showSnackbar("Please select a policy", "warning");
      return;
    }

    if (selectedAgents.length === 0) {
      showSnackbar("Please select at least one agent", "warning");
      return;
    }

    try {
      const assignPromises = selectedAgents.map(agentId =>
        axios.post("/api/agents/policy-status", {
          agentId,
          policyId: selectedPolicy,
          status: "pending",
          message: "Policy assigned via UI"
        }, {
          headers: {
            Authorization: `Bearer demo-api-key`,
          }
        })
      );
      
      await Promise.all(assignPromises);
      showSnackbar(`Policy assigned to ${selectedAgents.length} agent(s)!`, "success");
      setPolicyDialogOpen(false);
      setSelectedAgents([]);
      setSelectedPolicy("");
    } catch (err) {
      showSnackbar(err.response?.data?.error || "Failed to assign policy", "error");
    }
  };

  const handleSendHeartbeat = async (agentId, agentName) => {
    try {
      await axios.post("/api/agents/heartbeat", {
        agentId,
        status: "online",
        uptime: 0,
        policiesApplied: 0
      }, {
        headers: {
          Authorization: `Bearer demo-api-key`,
        }
      });
      showSnackbar(`Heartbeat sent for "${agentName}"`, "success");
      await fetchAgents();
    } catch (err) {
      showSnackbar("Failed to send heartbeat", "error");
    }
  };

  const handleViewLogs = async (agentId) => {
    try {
      const response = await axios.get(`/api/agents/${agentId}`);
      setAgentLogs(response.data.logs || []);
      setLogsDialogOpen(true);
    } catch (err) {
      showSnackbar("Failed to fetch logs", "error");
    }
  };

  const handleViewMetrics = async (agentId) => {
    try {
      const response = await axios.get(`/api/agents/${agentId}`);
      setAgentMetrics(response.data.metrics || []);
      setMetricsDialogOpen(true);
    } catch (err) {
      showSnackbar("Failed to fetch metrics", "error");
    }
  };

  const toggleAgentSelection = (agentId) => {
    setSelectedAgents(prev =>
      prev.includes(agentId)
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const resetRegisterForm = () => {
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
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.agentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Agent Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor, manage, and control your security agents
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Tooltip title="Refresh agents">
            <IconButton color="primary" onClick={handleRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setRegisterDialogOpen(true)}
          >
            Register Agent
          </Button>
          {selectedAgents.length > 0 && (
            <Button
              variant="outlined"
              startIcon={<AssignPolicyIcon />}
              onClick={() => setPolicyDialogOpen(true)}
              color="secondary"
            >
              Assign Policy ({selectedAgents.length})
            </Button>
          )}
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total Agents
                </Typography>
                <Typography variant="h3" fontWeight={600}>{stats.total}</Typography>
              </Box>
              <SettingsIcon sx={{ fontSize: 50, opacity: 0.3 }} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)", color: "white" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Online
                </Typography>
                <Typography variant="h3" fontWeight={600}>{stats.online}</Typography>
              </Box>
              <CheckCircleIcon sx={{ fontSize: 50, opacity: 0.3 }} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, background: "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)", color: "white" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Offline
                </Typography>
                <Typography variant="h3" fontWeight={600}>{stats.offline}</Typography>
              </Box>
              <CancelIcon sx={{ fontSize: 50, opacity: 0.3 }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search agents by name, ID, or type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Selected Agents Banner */}
      {selectedAgents.length > 0 && (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => setSelectedAgents([])}>
              Clear Selection
            </Button>
          }
        >
          {selectedAgents.length} agent(s) selected
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Tabs for different views */}
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} variant="fullWidth">
          <Tab label="All Agents" />
          <Tab label={`Online (${stats.online})`} />
          <Tab label={`Offline (${stats.offline})`} />
        </Tabs>
      </Paper>

      {/* Agents Grid */}
      {filteredAgents.length === 0 ? (
        <Paper elevation={3} sx={{ p: 6, textAlign: "center" }}>
          <SettingsIcon sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {searchQuery ? "No agents found matching your search" : "No agents found"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchQuery ? "Try a different search term" : "Start an agent or register a new one to see it appear here"}
          </Typography>
          {!searchQuery && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setRegisterDialogOpen(true)}
            >
              Register Your First Agent
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredAgents
            .filter(agent => {
              if (activeTab === 1) return agent.status === "online";
              if (activeTab === 2) return agent.status === "offline";
              return true;
            })
            .map((agent) => (
              <Grid item xs={12} md={6} lg={4} key={agent.agentId}>
                <AgentCard
                  agent={agent}
                  onClick={() => handleAgentClick(agent)}
                  onDeregister={() => handleDeregisterAgent(agent.agentId, agent.name)}
                  onHeartbeat={() => handleSendHeartbeat(agent.agentId, agent.name)}
                  onViewLogs={() => handleViewLogs(agent.agentId)}
                  onViewMetrics={() => handleViewMetrics(agent.agentId)}
                  isSelected={selectedAgents.includes(agent.agentId)}
                  onSelect={() => toggleAgentSelection(agent.agentId)}
                />
              </Grid>
            ))}
        </Grid>
      )}

      {/* Agent Details Dialog */}
      {selectedAgent && (
        <AgentDetails agent={selectedAgent} onClose={handleCloseDetails} />
      )}

      {/* Register Agent Dialog */}
      <Dialog open={registerDialogOpen} onClose={() => setRegisterDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <RegisterIcon />
            Register New Agent
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Agent ID"
              value={registerForm.agentId}
              onChange={(e) => setRegisterForm({ ...registerForm, agentId: e.target.value })}
              required
              fullWidth
              helperText="Unique identifier for this agent"
            />
            <TextField
              label="Agent Name"
              value={registerForm.name}
              onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
              required
              fullWidth
              helperText="Human-readable name for the agent"
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
              placeholder="e.g., server-01.example.com"
            />
            <TextField
              label="Platform"
              value={registerForm.platform}
              onChange={(e) => setRegisterForm({ ...registerForm, platform: e.target.value })}
              fullWidth
              placeholder="e.g., linux, win32, darwin"
            />
            <TextField
              label="OS Version"
              value={registerForm.osVersion}
              onChange={(e) => setRegisterForm({ ...registerForm, osVersion: e.target.value })}
              fullWidth
              placeholder="e.g., Ubuntu 22.04, Windows Server 2022"
            />
            <TextField
              label="Agent Version"
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
            startIcon={registerLoading ? <CircularProgress size={20} /> : <RegisterIcon />}
          >
            Register
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Policy Dialog */}
      <Dialog open={policyDialogOpen} onClose={() => setPolicyDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PolicyIcon />
            Assign Policy to Agents
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Selected Agents: {selectedAgents.length}
            </Typography>
            <TextField
              select
              label="Select Policy"
              value={selectedPolicy}
              onChange={(e) => setSelectedPolicy(e.target.value)}
              fullWidth
              required
            >
              {policies.map((policy) => (
                <MenuItem key={policy.policy_id} value={policy.policy_id}>
                  {policy.name} - {policy.status}
                </MenuItem>
              ))}
            </TextField>
            {policies.length === 0 && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                No policies available. Please create a policy first.
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPolicyDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAssignPolicy}
            variant="contained"
            disabled={!selectedPolicy || selectedAgents.length === 0}
            startIcon={<AssignPolicyIcon />}
          >
            Assign Policy
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Logs Dialog */}
      <Dialog open={logsDialogOpen} onClose={() => setLogsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LogsIcon />
            Agent Logs
          </Box>
        </DialogTitle>
        <DialogContent>
          {agentLogs.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
              No logs available
            </Typography>
          ) : (
            <List>
              {agentLogs.map((log, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={log.message}
                      secondary={`${log.level} - ${new Date(log.timestamp).toLocaleString()}`}
                    />
                  </ListItem>
                  {index < agentLogs.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* View Metrics Dialog */}
      <Dialog open={metricsDialogOpen} onClose={() => setMetricsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MetricsIcon />
            Agent Metrics
          </Box>
        </DialogTitle>
        <DialogContent>
          {agentMetrics.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
              No metrics available
            </Typography>
          ) : (
            <Box sx={{ mt: 2 }}>
              {agentMetrics.slice(-5).reverse().map((metric, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(metric.timestamp).toLocaleString()}
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">CPU Usage</Typography>
                        <Typography variant="h6">{metric.system?.cpuUsage?.toFixed(2)}%</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">Memory Usage</Typography>
                        <Typography variant="h6">{metric.system?.memoryUsagePercent}%</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">Network In</Typography>
                        <Typography variant="h6">{(metric.network?.bytesIn / 1024).toFixed(2)} KB</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMetricsDialogOpen(false)}>Close</Button>
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