// routes/policies.js
const express = require("express");
const { pool } = require("../db");
const jwt = require("jsonwebtoken");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to check JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Add a new policy
router.post("/policies", authenticateToken, async (req, res) => {
  try {
    const { name, definition } = req.body;
    const created_by = req.user.username;

    const result = await pool.query(
      "INSERT INTO policies (name, definition, created_by) VALUES ($1, $2, $3) RETURNING *",
      [name, definition, created_by]
    );

    res.json({
      success: true,
      policy: result.rows[0],
      message: "✅ Policy added successfully"
    });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ success: false, error: "❌ Failed to add policy" });
  }
});

// Get all policies
router.get("/policies", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM policies ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: "❌ Failed to fetch policies" });
  }
});

module.exports = router;
