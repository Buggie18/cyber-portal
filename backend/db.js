// db.js
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Configure Postgres connection via env
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432
});

// Read and optionally execute init.sql
const initDb = async () => {
  try {
    const shouldInit = String(process.env.INIT_DB || "false").toLowerCase() === "true";
    if (!shouldInit) return;

    const initPath = path.join(__dirname, "init.sql");
    const initSql = fs.readFileSync(initPath).toString();
    await pool.query(initSql);
    console.log("✅ Tables are ready (users, policies)");
  } catch (err) {
    console.error("❌ Error initializing database:", err);
  }
};

// Export pool and init function; let server decide when to init
module.exports = { pool, initDb };

