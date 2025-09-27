const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const SecurityLog = await hre.ethers.getContractFactory("SecurityLog");

  // Deploy the contract (await deployment)
  const securityLog = await SecurityLog.deploy();
  await securityLog.waitForDeployment(); // <-- ethers v6

  console.log("SecurityLog deployed to:", securityLog.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
