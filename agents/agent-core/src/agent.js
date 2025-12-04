// agents/agent-core/src/agent.js
const axios = require('axios');
const os = require('os');
const PolicyHandler = require('./policyHandler');
const MetricsCollector = require('./metricsCollector');
const LogCollector = require('./logCollector');

class Agent {
  constructor(config) {
    this.agentId = config.agentId;
    this.agentName = config.agentName;
    this.agentType = config.agentType;
    this.serverUrl = config.serverUrl;
    this.apiKey = config.apiKey;
    this.heartbeatInterval = config.heartbeatInterval;
    this.metricsInterval = config.metricsInterval;
    
    this.isRunning = false;
    this.heartbeatTimer = null;
    this.metricsTimer = null;
    this.logTimer = null;
    this.appliedPolicies = [];
    
    this.policyHandler = new PolicyHandler(this);
    this.metricsCollector = new MetricsCollector(this);
    this.logCollector = new LogCollector(this);
    
    this.axiosInstance = axios.create({
      baseURL: this.serverUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async start() {
    console.log('🔄 Registering agent with server...');
    
    try {
      // Register with server
      await this.register();
      
      this.isRunning = true;
      
      // Start heartbeat
      this.startHeartbeat();
      
      // Start metrics collection
      this.startMetricsCollection();

      // Start log collection
      this.startLogCollection();
      
      // Start polling for policies
      this.startPolicyPolling();
      
      console.log('✅ Agent started successfully');
    } catch (error) {
      console.error('❌ Failed to start agent:', error.message);
      throw error;
    }
  }

  async stop() {
    this.isRunning = false;
    
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }
    
    if (this.metricsTimer) {
      clearInterval(this.metricsTimer);
    }

    if (this.logTimer) {
      clearInterval(this.logTimer);
      this.logTimer = null;
    }
    
    if (this.policyPollTimer) {
      clearInterval(this.policyPollTimer);
    }

    // Flush any remaining logs
    try {
      await this.logCollector.flush();
    } catch (error) {
      console.error('⚠️  Failed to flush logs on shutdown:', error.message);
    }
    
    // Notify server of shutdown
    try {
      await this.axiosInstance.post('/api/agents/deregister', {
        agentId: this.agentId
      });
      console.log('✅ Agent deregistered');
    } catch (error) {
      console.error('⚠️  Failed to deregister:', error.message);
    }
  }

  async register() {
    try {
      const response = await this.axiosInstance.post('/api/agents/register', {
        agentId: this.agentId,
        name: this.agentName,
        type: this.agentType,
        hostname: os.hostname(),
        platform: os.platform(),
        osVersion: os.release(),
        version: '1.0.0'
      });
      
      console.log('✅ Agent registered:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Registration failed:', error.response?.data || error.message);
      throw error;
    }
  }

  startHeartbeat() {
    this.heartbeatTimer = setInterval(async () => {
      try {
        await this.sendHeartbeat();
      } catch (error) {
        console.error('⚠️  Heartbeat failed:', error.message);
      }
    }, this.heartbeatInterval);
    
    // Send initial heartbeat
    this.sendHeartbeat();
  }

  async sendHeartbeat() {
    try {
      const response = await this.axiosInstance.post('/api/agents/heartbeat', {
        agentId: this.agentId,
        status: 'online',
        uptime: process.uptime(),
        policiesApplied: this.appliedPolicies.length
      });
      
      console.log(`💓 Heartbeat sent at ${new Date().toISOString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  startMetricsCollection() {
    this.metricsTimer = setInterval(async () => {
      try {
        const metrics = await this.metricsCollector.collect();
        await this.sendMetrics(metrics);
      } catch (error) {
        console.error('⚠️  Metrics collection failed:', error.message);
      }
    }, this.metricsInterval);
  }

  startLogCollection() {
    // Collect logs periodically; reuse metrics interval for simplicity
    this.logTimer = setInterval(async () => {
      try {
        await this.logCollector.collect();
      } catch (error) {
        console.error('⚠️  Log collection failed:', error.message);
      }
    }, this.metricsInterval);

    // Initial collection to start buffer
    this.logCollector.collect().catch((error) => {
      console.error('⚠️  Initial log collection failed:', error.message);
    });
  }

  async sendMetrics(metrics) {
    try {
      await this.axiosInstance.post('/api/agents/metrics', {
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
        metrics
      });
      
      console.log('📊 Metrics sent');
    } catch (error) {
      throw error;
    }
  }

  startPolicyPolling() {
    // Poll for new policies every 30 seconds
    this.policyPollTimer = setInterval(async () => {
      try {
        await this.checkForPolicies();
      } catch (error) {
        console.error('⚠️  Policy check failed:', error.message);
      }
    }, 30000);
    
    // Check immediately
    this.checkForPolicies();
  }

  async checkForPolicies() {
    try {
      const response = await this.axiosInstance.get('/api/agents/policies', {
        params: { agentId: this.agentId }
      });
      
      const policies = response.data.policies || [];
      
      // Apply new policies
      for (const policy of policies) {
        if (!this.appliedPolicies.find(p => p.id === policy.id)) {
          await this.applyPolicy(policy);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async applyPolicy(policy) {
    try {
      console.log(`🔧 Applying policy: ${policy.name}`);
      
      const result = await this.policyHandler.apply(policy);
      
      if (result.success) {
        this.appliedPolicies.push(policy);
        
        // Notify server of successful application
        await this.axiosInstance.post('/api/agents/policy-status', {
          agentId: this.agentId,
          policyId: policy.id,
          status: 'applied',
          message: result.message,
        });
        
        console.log(`✅ Policy applied: ${policy.name}`);
      } else {
        console.error(`❌ Policy application failed: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Error applying policy:', error.message);
    }
  }
}

module.exports = Agent;