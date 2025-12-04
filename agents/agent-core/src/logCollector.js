// agents/agent-core/src/logCollector.js
const crypto = require('crypto');

class LogCollector {
  constructor(agent) {
    this.agent = agent;
    this.logBuffer = [];
  }

  async collect() {
    // Simulate log collection
    const logs = [
      this.generateLog('INFO', 'System health check passed'),
      this.generateLog('INFO', 'Network traffic within normal range'),
      this.generateLog('DEBUG', 'Policy sync completed')
    ];

    this.logBuffer.push(...logs);

    // If buffer is large enough, send to server
    if (this.logBuffer.length >= 10) {
      await this.flush();
    }

    return logs;
  }

  generateLog(level, message) {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      agentId: this.agent.agentId,
      hash: this.createHash(message)
    };
  }

  createHash(data) {
    return crypto
      .createHash('sha256')
      .update(data + Date.now())
      .digest('hex');
  }

  async flush() {
    if (this.logBuffer.length === 0) return;

    try {
      await this.agent.axiosInstance.post('/api/agents/logs', {
        agentId: this.agent.agentId,
        logs: this.logBuffer
      });

      console.log(`📝 Sent ${this.logBuffer.length} logs to server`);
      this.logBuffer = [];
    } catch (error) {
      console.error('Failed to send logs:', error.message);
    }
  }
}

module.exports = LogCollector;