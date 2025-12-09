// routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { pool } = require("../db");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Register new user (for testing/demo)
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Try to insert with role column first (for new schema)
    // If role column doesn't exist, fall back to old schema
    let result;
    try {
      result = await pool.query(
        "INSERT INTO users (username, password_hash, role) VALUES ($1, $2, 'user') RETURNING id, username, role",
        [username, hashedPassword]
      );
    } catch (roleError) {
      // If role column doesn't exist, try without it
      if (roleError.code === '42703' || roleError.message.includes('role')) {
        console.log("Role column not found, using legacy registration");
        result = await pool.query(
          "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username",
          [username, hashedPassword]
        );
        // Add default role to response
        result.rows[0].role = 'user';
      } else {
        throw roleError;
      }
    }

    res.json({ message: "User registered", user: result.rows[0] });
  } catch (err) {
    console.error("Registration error:", err);
    // Provide more specific error messages
    if (err.code === '23505') {
      return res.status(400).json({ error: "Username already exists" });
    }
    res.status(500).json({ error: "Registration failed: " + (err.message || "Unknown error") });
  }
});

// Login existing user
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Use role from database, or default to 'user' if role column doesn't exist
    const userRole = user.role || 'user';

    const token = jwt.sign(
      { id: user.id, username: user.username, role: userRole },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
