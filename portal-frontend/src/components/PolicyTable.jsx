// src/components/PolicyTable.jsx
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Paper, 
  TableContainer,
  Chip,
  Box,
  Typography
} from "@mui/material";

export default function PolicyTable({ policies = [] }) {
  if (!policies || policies.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          No policies found
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Name</strong></TableCell>
            <TableCell><strong>Rule</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Created</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {policies.map((policy) => (
            <TableRow key={policy.id || policy.policy_id}>
              <TableCell>{policy.name}</TableCell>
              <TableCell>{policy.definition?.rule || "-"}</TableCell>
              <TableCell>
                <Chip 
                  label={policy.status || "active"} 
                  color={policy.status === "active" ? "success" : "warning"}
                  size="small"
                />
              </TableCell>
              <TableCell>
                {policy.created_at 
                  ? new Date(policy.created_at).toLocaleString() 
                  : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
