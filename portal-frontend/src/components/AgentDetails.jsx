import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Grid,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AgentDetails = ({ agent, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!agent?.agentId) return;

    const fetchAgentDetails = async () => {
      try {
        const response = await axios.get(`/api/agents/${agent.agentId}`);
        setDetails(response.data);
      } catch (error) {
        console.error("Error fetching agent details:", error);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchAgentDetails();
  }, [agent?.agentId]);

  const formatBytes = (bytes) => {
    if (!bytes) return "N/A";
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round((bytes / 1024 ** i) * 100) / 100} ${sizes[i]}`;
  };

  const formatUptime = (seconds) => {
    if (!seconds) return "N/A";
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    
    return parts.join(" ") || "< 1m";
  };

  const renderOverview = () => {
    const latestMetric = details?.metrics?.[details.metrics.length - 1];
    
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Agent information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Agent ID
              </Typography>
              <Typography variant="body1">{agent.agentId}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1">{agent.name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Type
              </Typography>
              <Typography variant="body1">{agent.type}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Status
              </Typography>
              <Typography
                variant="body1"
                color={agent.status === "online" ? "success.main" : "error.main"}
              >
                {agent.status}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Hostname
              </Typography>
              <Typography variant="body1">{agent.hostname || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Platform
              </Typography>
              <Typography variant="body1">{agent.platform || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                OS version
              </Typography>
              <Typography variant="body1">{agent.osVersion || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Agent version
              </Typography>
              <Typography variant="body1">{agent.version || "N/A"}</Typography>
            </Grid>
          </Grid>
        </Box>

        {latestMetric && (
          <Box>
            <Typography variant="h6" gutterBottom>
              System metrics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  CPU usage
                </Typography>
                <Typography variant="body1">
                  {latestMetric.system?.cpuUsage?.toFixed(2)}%
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Memory usage
                </Typography>
                <Typography variant="body1">
                  {latestMetric.system?.memoryUsagePercent}%
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Total memory
                </Typography>
                <Typography variant="body1">
                  {formatBytes(latestMetric.system?.memoryTotal)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Free memory
                </Typography>
                <Typography variant="body1">
                  {formatBytes(latestMetric.system?.memoryFree)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  System uptime
                </Typography>
                <Typography variant="body1">
                  {formatUptime(latestMetric.system?.uptime)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Process uptime
                </Typography>
                <Typography variant="body1">
                  {formatUptime(latestMetric.process?.processUptime)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    );
  };

  const renderMetrics = () => {
    if (!details?.metrics || details.metrics.length === 0) {
      return (
        <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
          No metrics available
        </Typography>
      );
    }

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {details.metrics
          .slice(-5)
          .reverse()
          .map((metric, index) => (
            <Box key={index} sx={{ border: 1, borderColor: "divider", borderRadius: 2, p: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                {new Date(metric.timestamp).toLocaleString()}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    CPU
                  </Typography>
                  <Typography variant="body1">
                    {metric.system?.cpuUsage?.toFixed(2)}%
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Memory
                  </Typography>
                  <Typography variant="body1">
                    {metric.system?.memoryUsagePercent}%
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Network in
                  </Typography>
                  <Typography variant="body1">
                    {formatBytes(metric.network?.bytesIn)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          ))}
      </Box>
    );
  };

  const renderLogs = () => {
    if (!details?.logs || details.logs.length === 0) {
      return (
        <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
          No logs available
        </Typography>
      );
    }

    const getLevelColor = (level) => {
      switch (level.toUpperCase()) {
        case "ERROR":
          return "error.main";
        case "WARN":
          return "warning.main";
        case "INFO":
          return "primary.main";
        case "DEBUG":
          return "text.secondary";
        default:
          return "text.primary";
      }
    };

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {details.logs.slice(-20).reverse().map((log, index) => (
          <Box
            key={index}
            sx={{
              borderLeft: 4,
              borderColor: "divider",
              pl: 2,
              py: 1,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: getLevelColor(log.level) }}
              >
                {log.level}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(log.timestamp).toLocaleString()}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {log.message}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Dialog
      open={!!agent}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      aria-labelledby="agent-details-title"
    >
      <DialogTitle id="agent-details-title" sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h6">{agent.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {agent.agentId}
            </Typography>
          </Box>
          <IconButton onClick={onClose} aria-label="Close agent details">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Tabs
        value={activeTab}
        onChange={(_, value) => setActiveTab(value)}
        sx={{ px: 3 }}
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab value="overview" label="Overview" />
        <Tab value="metrics" label="Metrics" />
        <Tab value="logs" label="Logs" />
      </Tabs>
      <Divider />

      <DialogContent dividers sx={{ maxHeight: "70vh" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {activeTab === "overview" && renderOverview()}
            {activeTab === "metrics" && renderMetrics()}
            {activeTab === "logs" && renderLogs()}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AgentDetails;