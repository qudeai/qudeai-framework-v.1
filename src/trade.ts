import { config } from "dotenv";
import { VersionedTransaction, Connection, Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import fetch from "node-fetch";
import { checkAgentExists } from "./firebase.js";

config();

const RPC_ENDPOINT = process.env.RPC_ENDPOINT || "https://api.mainnet-beta.solana.com";
const web3Connection = new Connection(RPC_ENDPOINT, "confirmed");


async function sendPortalTransaction(agentName: string) {

  const agentExists = await checkAgentExists(agentName);
  if (!agentExists) {
    console.error(`Error: No agent found with the name "${agentName}".`);
    return;
  }

  const action = process.env.ACTION || "buy"; 
  const mint = process.env.MINT || ""; 
  const amount = parseInt(process.env.AMOUNT || "1000");

  const secretKey = process.env.PRIVATE_KEYPAIR;
  if (!secretKey) {
    throw new Error("PRIVATE_KEYPAIR is not set in the .env file!");
  }

  const decodedSecretKey = bs58.decode(secretKey);

  if (decodedSecretKey.length !== 64) {
    throw new Error("Invalid private key length! Ensure the key is correctly encoded in base58.");
  }

  const signerKeyPair = Keypair.fromSecretKey(decodedSecretKey);

  const response = await fetch("https://pumpportal.fun/api/trade-local", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      publicKey: signerKeyPair.publicKey.toBase58(),
      action: action,
      mint: mint,
      denominatedInSol: "false",
      amount: amount,
      slippage: 10,
      priorityFee: 0.00001,
      pool: "pump",
    }),
  });

  if (response.status === 200) {
    const data = await response.arrayBuffer();
    const tx = VersionedTransaction.deserialize(new Uint8Array(data));
    tx.sign([signerKeyPair]);
    const signature = await web3Connection.sendTransaction(tx);
    console.log(`Transaction successful: https://solscan.io/tx/${signature}`);
  } else {
    console.error("Error:", response.statusText);
  }
}

const agentName = process.argv[2];

if (!agentName) {
  console.error("Error: Please provide the agent name as an argument.");
  process.exit(1);
}

sendPortalTransaction(agentName).catch((error) => {
  console.error("An error occurred:", error);
});
