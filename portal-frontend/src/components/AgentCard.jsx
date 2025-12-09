import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Checkbox,
  Divider,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Computer as ComputerIcon,
  Security as SecurityIcon,
  NetworkCheck as NetworkIcon,
  Circle as CircleIcon,
  FavoriteBorder as HeartbeatIcon,
  PersonRemove as DeregisterIcon,
  Description as LogsIcon,
  ShowChart as MetricsIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";

const AgentCard = ({ 
  agent, 
  onClick, 
  onDeregister, 
  onHeartbeat, 
  onViewLogs, 
  onViewMetrics,
  isSelected = false,
  onSelect 
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action) => {
    handleMenuClose();
    action();
  };

  const getTypeIcon = () => {
    switch (agent.type) {
      case "server":
        return <ComputerIcon />;
      case "firewall":
        return <SecurityIcon />;
      case "network":
        return <NetworkIcon />;
      default:
        return <ComputerIcon />;
    }
  };

  const getStatusColor = () => {
    return agent.status === "online" ? "success" : "error";
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const handleCheckboxClick = (event) => {
    event.stopPropagation();
    onSelect();
  };

  return (
    <Card 
      sx={{ 
        height: "100%", 
        display: "flex", 
        flexDirection: "column",
        cursor: "pointer",
        transition: "all 0.3s ease",
        border: isSelected ? 2 : 0,
        borderColor: "primary.main",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }} onClick={onClick}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 2 }}>
            {onSelect && (
              <Checkbox
                checked={isSelected}
                onClick={handleCheckboxClick}
                size="small"
              />
            )}
            <Box
              sx={{
                p: 1,
                borderRadius: 1,
                bgcolor: agent.status === "online" ? "success.light" : "error.light",
                color: agent.status === "online" ? "success.dark" : "error.dark",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {getTypeIcon()}
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={agent.status}
              color={getStatusColor()}
              size="small"
              icon={<CircleIcon sx={{ fontSize: 10 }} />}
            />
            <IconButton
              size="small"
              onClick={handleMenuClick}
              sx={{ ml: "auto" }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>

        <Typography variant="h6" fontWeight={600} gutterBottom noWrap>
          {agent.name}
        </Typography>
        
        <Typography variant="caption" color="text.secondary" display="block" gutterBottom noWrap>
          {agent.agentId}
        </Typography>

        <Divider sx={{ my: 1.5 }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Type:
            </Typography>
            <Typography variant="body2" fontWeight={500} sx={{ textTransform: "capitalize" }}>
              {agent.type}
            </Typography>
          </Box>

          {agent.hostname && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Hostname:
              </Typography>
              <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: "150px" }}>
                {agent.hostname}
              </Typography>
            </Box>
          )}

          {agent.platform && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Platform:
              </Typography>
              <Typography variant="body2" fontWeight={500} sx={{ textTransform: "capitalize" }}>
                {agent.platform}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Last Heartbeat:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {formatTimestamp(agent.lastHeartbeat)}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
          <Tooltip title="View Details">
            <IconButton 
              size="small" 
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              sx={{ flex: 1 }}
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
          
          {onViewLogs && (
            <Tooltip title="View Logs">
              <IconButton 
                size="small" 
                color="info"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewLogs();
                }}
                sx={{ flex: 1 }}
              >
                <LogsIcon />
              </IconButton>
            </Tooltip>
          )}

          {onViewMetrics && (
            <Tooltip title="View Metrics">
              <IconButton 
                size="small" 
                color="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewMetrics();
                }}
                sx={{ flex: 1 }}
              >
                <MetricsIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardActions>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={() => handleMenuAction(onClick)}>
          <ViewIcon sx={{ mr: 1, fontSize: 20 }} />
          View Details
        </MenuItem>
        
        {onHeartbeat && (
          <MenuItem onClick={() => handleMenuAction(onHeartbeat)}>
            <HeartbeatIcon sx={{ mr: 1, fontSize: 20 }} />
            Send Heartbeat
          </MenuItem>
        )}
        
        {onViewLogs && (
          <MenuItem onClick={() => handleMenuAction(onViewLogs)}>
            <LogsIcon sx={{ mr: 1, fontSize: 20 }} />
            View Logs
          </MenuItem>
        )}
        
        {onViewMetrics && (
          <MenuItem onClick={() => handleMenuAction(onViewMetrics)}>
            <MetricsIcon sx={{ mr: 1, fontSize: 20 }} />
            View Metrics
          </MenuItem>
        )}
        
        <Divider />
        
        {onDeregister && (
          <MenuItem 
            onClick={() => handleMenuAction(onDeregister)}
            sx={{ color: "error.main" }}
          >
            <DeregisterIcon sx={{ mr: 1, fontSize: 20 }} />
            Deregister
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
};

export default AgentCard;