// agents/agent-core/src/metricsCollector.js
const os = require('os');

class MetricsCollector {
  constructor(agent) {
    this.agent = agent;
  }

  async collect() {
    const metrics = {
      system: this.getSystemMetrics(),
      process: this.getProcessMetrics(),
      network: await this.getNetworkMetrics()
    };

    return metrics;
  }

  getSystemMetrics() {
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    // Calculate CPU usage
    let totalIdle = 0;
    let totalTick = 0;
    
    cpus.forEach(cpu => {
      for (let type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    });

    const cpuUsage = 100 - ~~(100 * totalIdle / totalTick);

    return {
      cpuUsage: cpuUsage,
      cpuCount: cpus.length,
      memoryTotal: totalMem,
      memoryUsed: usedMem,
      memoryFree: freeMem,
      memoryUsagePercent: ((usedMem / totalMem) * 100).toFixed(2),
      loadAverage: os.loadavg(),
      uptime: os.uptime()
    };
  }

  getProcessMetrics() {
    const memUsage = process.memoryUsage();
    
    return {
      processUptime: process.uptime(),
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      rss: memUsage.rss,
      external: memUsage.external
    };
  }

  async getNetworkMetrics() {
    const networkInterfaces = os.networkInterfaces();
    
    // Simulate network traffic metrics
    // In production, you'd read actual network stats
    return {
      interfaces: Object.keys(networkInterfaces).length,
      bytesIn: Math.floor(Math.random() * 1000000),
      bytesOut: Math.floor(Math.random() * 1000000),
      packetsIn: Math.floor(Math.random() * 10000),
      packetsOut: Math.floor(Math.random() * 10000),
      connections: Math.floor(Math.random() * 100)
    };
  }
}

module.exports = MetricsCollector;