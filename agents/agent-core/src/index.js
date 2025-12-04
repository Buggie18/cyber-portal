// agents/agent-core/src/index.js
const Agent = require('./agent');
const config = require('./config');

async function main() {
  console.log('🚀 Starting Cybersecurity Agent...');
  console.log(`Agent ID: ${config.AGENT_ID}`);
  console.log(`Server URL: ${config.SERVER_URL}`);

  const agent = new Agent({
    agentId: config.AGENT_ID,
    agentName: config.AGENT_NAME,
    agentType: config.AGENT_TYPE,
    serverUrl: config.SERVER_URL,
    apiKey: config.API_KEY,
    heartbeatInterval: config.HEARTBEAT_INTERVAL,
    metricsInterval: config.METRICS_INTERVAL
  });

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n⚠️  Shutting down agent...');
    await agent.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n⚠️  Shutting down agent...');
    await agent.stop();
    process.exit(0);
  });

  // Start the agent
  try {
    await agent.start();
  } catch (error) {
    console.error('❌ Failed to start agent:', error.message);
    process.exit(1);
  }
}

main();