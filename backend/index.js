// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { pool, initDb } = require("./db");
const authRoutes = require("./routes/auth");
const policyRoutes = require("./routes/policies");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize DB schema if enabled
initDb();

// Routes
app.use("/api", authRoutes);
app.use("/api", policyRoutes);

// Health check
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  } catch (e) {
    res.status(500).json({ status: "db_error" });
  }
});

// Start server
const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

