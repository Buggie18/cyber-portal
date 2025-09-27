// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Policies from "./pages/Policies";
import Landing from "./pages/Landing";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import SecurityPredictionPage from "./pages/SecurityPredictionPage";

function App() {
  const token = localStorage.getItem("token");

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={token ? <Dashboard /> : <Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/policies"
          element={
            <ProtectedRoute>
              <Policies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/security-prediction"
          element={
            <ProtectedRoute>
              <SecurityPredictionPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
