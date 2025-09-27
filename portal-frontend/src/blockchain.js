// src/blockchain.js
import { ethers } from "ethers";
import SecurityLogABI from "./contracts/SecurityLogABI.json";

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0xF9715a9119E78F392B3996fa5D595c34571a36C6";

let contract;

export async function connectContract() {
  if (!window.ethereum) {
    alert("Install MetaMask first!");
    return null;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();

  contract = new ethers.Contract(CONTRACT_ADDRESS, SecurityLogABI, signer);
  return contract;
}

// Add a new log on blockchain
export async function addLog(user, eventType) {
  if (!contract) await connectContract();
  const tx = await contract.addLog(user, eventType);
  await tx.wait();
  console.log("Blockchain log added:", user, eventType);
}

// Fetch all logs from blockchain
export async function getLogs() {
    if (!contract) await connectContract();
  
    const countBN = await contract.getLogsCount(); // BigInt
    const count = Number(countBN); // convert BigInt to Number for loop
  
    const logs = [];
    for (let i = 0; i < count; i++) {
      const [user, eventType, timestampBN] = await contract.getLog(i);
      logs.push({
        user,
        eventType,
        timestamp: new Date(Number(timestampBN) * 1000), // convert BigInt to Number
      });
    }
  
    return logs.reverse(); // newest first
  }
  
