// backend/routes/agents.js
const express = require('express');
const router = express.Router();
const { pool } = require('../db'); 

// In-memory storage for agent data
const agents = new Map();
const agentMetrics = new Map();
const agentLogs = new Map();


// Middleware to verify API key (simple version)
const verifyApiKey = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid API key' });
  }
  
  // For prototype, accept any non-empty key
  // In production, validate against database
  next();
};

// Test route to verify router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Agents router is working!' });
});

// Register a new agent
router.post('/register', verifyApiKey, async (req, res) => {
  try {
    const { agentId, name, type, hostname, platform, osVersion, version } = req.body;
    
    if (!agentId || !name) {
      return res.status(400).json({ error: 'agentId and name are required' });
    }
    
    const agent = {
      agentId,
      name,
      type: type || 'server',
      hostname,
      platform,
      osVersion,
      version,
      status: 'online',
      registeredAt: new Date().toISOString(),
      lastHeartbeat: new Date().toISOString()
    };
    
    agents.set(agentId, agent);
    
    // Store in database
    try {
      await pool.query(
        `INSERT INTO agents (agent_id, name, type, hostname, platform, os_version, version, status, registered_at, last_heartbeat)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (agent_id) DO UPDATE SET
           status = $8,
           last_heartbeat = $10`,
        [agentId, name, type, hostname, platform, osVersion, version, 'online', 
         agent.registeredAt, agent.lastHeartbeat]
      );
    } catch (dbError) {
      console.log('Database storage skipped (table may not exist):', dbError.message);
    }
    
    console.log(`✅ Agent registered: ${agentId} (${name})`);
    
    res.status(201).json({
      success: true,
      message: 'Agent registered successfully',
      agent
    });
  } catch (error) {
    console.error('Error registering agent:', error);
    res.status(500).json({ error: 'Failed to register agent' });
  }
});

// Agent heartbeat
router.post('/heartbeat', verifyApiKey, async (req, res) => {
  try {
    const { agentId, status, uptime, policiesApplied } = req.body;
    
    if (!agentId) {
      return res.status(400).json({ error: 'agentId is required' });
    }
    
    const agent = agents.get(agentId);
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found. Please register first.' });
    }
    
    // Update agent status
    agent.status = status || 'online';
    agent.lastHeartbeat = new Date().toISOString();
    agent.uptime = uptime;
    agent.policiesApplied = policiesApplied;
    
    agents.set(agentId, agent);
    
    // Update in database
    try {
      await pool.query(
        'UPDATE agents SET status = $1, last_heartbeat = $2 WHERE agent_id = $3',
        [agent.status, agent.lastHeartbeat, agentId]
      );
    } catch (dbError) {
      console.log('Database update skipped:', dbError.message);
    }
    
    res.json({
      success: true,
      message: 'Heartbeat received',
      timestamp: agent.lastHeartbeat
    });
  } catch (error) {
    console.error('Error processing heartbeat:', error);
    res.status(500).json({ error: 'Failed to process heartbeat' });
  }
});

// Receive agent metrics
router.post('/metrics', verifyApiKey, async (req, res) => {
  try {
    const { agentId, timestamp, metrics } = req.body;
    
    if (!agentId || !metrics) {
      return res.status(400).json({ error: 'agentId and metrics are required' });
    }
    
    // Store metrics (keep last 100 entries per agent)
    if (!agentMetrics.has(agentId)) {
      agentMetrics.set(agentId, []);
    }
    
    const agentMetricsList = agentMetrics.get(agentId);
    agentMetricsList.push({ timestamp, ...metrics });
    
    // Keep only last 100 entries
    if (agentMetricsList.length > 100) {
      agentMetricsList.shift();
    }
    
    res.json({
      success: true,
      message: 'Metrics received'
    });
  } catch (error) {
    console.error('Error storing metrics:', error);
    res.status(500).json({ error: 'Failed to store metrics' });
  }
});

// Receive agent logs
router.post('/logs', verifyApiKey, async (req, res) => {
  try {
    const { agentId, logs } = req.body;
    
    if (!agentId || !logs) {
      return res.status(400).json({ error: 'agentId and logs are required' });
    }
    
    // Store logs (keep last 500 entries per agent)
    if (!agentLogs.has(agentId)) {
      agentLogs.set(agentId, []);
    }
    
    const agentLogsList = agentLogs.get(agentId);
    agentLogsList.push(...logs);
    
    // Keep only last 500 entries
    while (agentLogsList.length > 500) {
      agentLogsList.shift();
    }
    
    res.json({
      success: true,
      message: 'Logs received',
      count: logs.length
    });
  } catch (error) {
    console.error('Error storing logs:', error);
    res.status(500).json({ error: 'Failed to store logs' });
  }
});

// Get policies for agent
router.get('/policies', verifyApiKey, async (req, res) => {
  try {
    const { agentId } = req.query;
    
    if (!agentId) {
      return res.status(400).json({ error: 'agentId is required' });
    }
    
    // Get all active policies from database
    const result = await pool.query(
      "SELECT * FROM policies WHERE status = 'active' ORDER BY created_at DESC"
    );
    
    res.json({
      success: true,
      policies: result.rows
    });
  } catch (error) {
    console.error('Error fetching policies:', error);
    res.status(500).json({ error: 'Failed to fetch policies' });
  }
});

// Update policy status for agent
router.post('/policy-status', verifyApiKey, async (req, res) => {
  try {
    const { agentId, policyId, status, message } = req.body;
    
    if (!agentId || !policyId || !status) {
      return res.status(400).json({ error: 'agentId, policyId, and status are required' });
    }
    
    console.log(`📝 Policy ${policyId} ${status} on agent ${agentId}: ${message}`);
    
    res.json({
      success: true,
      message: 'Policy status updated'
    });
  } catch (error) {
    console.error('Error updating policy status:', error);
    res.status(500).json({ error: 'Failed to update policy status' });
  }
});

// Deregister agent
router.post('/deregister', verifyApiKey, async (req, res) => {
  try {
    const { agentId } = req.body;
    
    if (!agentId) {
      return res.status(400).json({ error: 'agentId is required' });
    }
    
    const agent = agents.get(agentId);
    
    if (agent) {
      agent.status = 'offline';
      agents.set(agentId, agent);
      
      // Update in database
      try {
        await pool.query(
          'UPDATE agents SET status = $1 WHERE agent_id = $2',
          ['offline', agentId]
        );
      } catch (dbError) {
        console.log('Database update skipped:', dbError.message);
      }
    }
    
    console.log(`❌ Agent deregistered: ${agentId}`);
    
    res.json({
      success: true,
      message: 'Agent deregistered'
    });
  } catch (error) {
    console.error('Error deregistering agent:', error);
    res.status(500).json({ error: 'Failed to deregister agent' });
  }
});

// Get all agents (for frontend)
router.get('/', async (req, res) => {
  try {
    const agentsList = Array.from(agents.values());
    
    res.json({
      success: true,
      agents: agentsList,
      count: agentsList.length
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// Get specific agent details
router.get('/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    
    const agent = agents.get(agentId);
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    const metrics = agentMetrics.get(agentId) || [];
    const logs = agentLogs.get(agentId) || [];
    
    res.json({
      success: true,
      agent,
      metrics: metrics.slice(-10), // Last 10 metric entries
      logs: logs.slice(-50) // Last 50 log entries
    });
  } catch (error) {
    console.error('Error fetching agent details:', error);
    res.status(500).json({ error: 'Failed to fetch agent details' });
  }
});

module.exports = router;