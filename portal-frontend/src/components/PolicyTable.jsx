// src/components/PolicyTable.jsx
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer } from "@mui/material";

export default function PolicyTable({ policies }) {
  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Rule</TableCell>
            <TableCell>Created By</TableCell>
            <TableCell>Created At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {policies.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.id}</TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.definition.rule}</TableCell>
              <TableCell>{p.created_by}</TableCell>
              <TableCell>{new Date(p.created_at).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
