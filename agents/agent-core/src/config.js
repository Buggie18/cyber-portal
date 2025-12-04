// agents/agent-core/src/config.js
require('dotenv').config();

module.exports = {
  AGENT_ID: process.env.AGENT_ID || `agent-${Date.now()}`,
  AGENT_NAME: process.env.AGENT_NAME || 'Default Agent',
  AGENT_TYPE: process.env.AGENT_TYPE || 'server', // server, firewall, network
  SERVER_URL: process.env.SERVER_URL || 'http://localhost:8080',
  API_KEY: process.env.API_KEY || 'demo-api-key',
  HEARTBEAT_INTERVAL: parseInt(process.env.HEARTBEAT_INTERVAL) || 30000, // 30 seconds
  METRICS_INTERVAL: parseInt(process.env.METRICS_INTERVAL) || 60000, // 60 seconds
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};