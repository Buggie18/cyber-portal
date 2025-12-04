import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Stack,
  Button,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

const AgentCard = ({ agent, onClick, onDeregister }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case "server":
        return (
          <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
            />
          </svg>
        );
      case "firewall":
        return (
          <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        );
      case "network":
        return (
          <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
        );
      default:
        return (
          <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
            />
          </svg>
        );
    }
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

  const handleDeregisterClick = (e) => {
    e.stopPropagation(); // Prevent card click
    if (onDeregister) {
      onDeregister(agent.agentId);
    }
  };

  return (
    <Card
      onClick={onClick}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "box-shadow 0.2s ease",
        "&:hover": { boxShadow: 6 },
        position: "relative",
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2} mb={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                p: 1,
                borderRadius: 1,
                bgcolor: agent.status === "online" ? "primary.light" : "grey.100",
                color: agent.status === "online" ? "primary.main" : "text.secondary",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {getTypeIcon(agent.type)}
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {agent.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {agent.agentId}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={agent.status}
              size="small"
              color={agent.status === "online" ? "success" : "default"}
              variant={agent.status === "online" ? "filled" : "outlined"}
            />
            {onDeregister && (
              <IconButton
                size="small"
                color="error"
                onClick={handleDeregisterClick}
                sx={{ ml: 1 }}
                aria-label="Deregister agent"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        </Stack>

        <Box sx={{ "& > *": { display: "flex", justifyContent: "space-between", mb: 0.5 } }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Type
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {agent.type || "N/A"}
            </Typography>
          </Box>

          {agent.hostname && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                Hostname
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {agent.hostname}
              </Typography>
            </Box>
          )}

          {agent.platform && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                Platform
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {agent.platform}
              </Typography>
            </Box>
          )}

          <Box>
            <Typography variant="body2" color="text.secondary">
              Last heartbeat
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {formatTimestamp(agent.lastHeartbeat)}
            </Typography>
          </Box>

          {agent.policiesApplied !== undefined && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                Policies applied
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {agent.policiesApplied}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ mt: "auto", pt: 0, px: 2, pb: 2 }}>
        <Button size="small" color="primary">
          View details
        </Button>
      </CardActions>
    </Card>
  );
};

export default AgentCard;