// src/components/PolicyAndBlockchainTable.jsx
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer } from "@mui/material";
import axios from "axios";
import { getLogs } from "../blockchain";

export default function PolicyAndBlockchainTable() {
  const [policies, setPolicies] = useState([]);
  const [blockchainLogs, setBlockchainLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1️⃣ Fetch backend policies
        const policyRes = await axios.get("/api/policies", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setPolicies(policyRes.data);

        // 2️⃣ Fetch blockchain logs
        const logs = await getLogs();
        setBlockchainLogs(logs);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading data...</div>;

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Name / Event</TableCell>
            <TableCell>Rule / User</TableCell>
            <TableCell>Timestamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Backend Policies */}
          {policies.map((policy) => (
            <TableRow key={`policy-${policy.id}`}>
              <TableCell>Policy</TableCell>
              <TableCell>{policy.name}</TableCell>
              <TableCell>{policy.definition?.rule || "-"}</TableCell>
              <TableCell>{new Date(policy.created_at).toLocaleString()}</TableCell>
            </TableRow>
          ))}

          {/* Blockchain Logs */}
          {blockchainLogs.map((log, index) => (
            <TableRow key={`log-${index}`}>
              <TableCell>Blockchain Log</TableCell>
              <TableCell>{log.eventType}</TableCell>
              <TableCell>{log.user}</TableCell>
              <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
