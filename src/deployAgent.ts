import { VersionedTransaction, Connection, Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import * as dotenv from "dotenv";
dotenv.config();

import { agentDetails } from "./defineagent.js";
import { checkAgentExists, storeAgent } from "./firebase.js";
import fs from "fs";
import fetch from "node-fetch";

const RPC_ENDPOINT = "https://api.mainnet-beta.solana.com";
const web3Connection = new Connection(RPC_ENDPOINT, "confirmed");

async function sendLocalCreateTx() {
    const agentName = agentDetails.name;

    // Check if the agent already exists
    const agentExists = await checkAgentExists(agentName);
    if (agentExists) {
        console.error(`Agent "${agentName}" already exists. Try another name.`);
        return;
    }

    // Validate the private keypair
    const secretKey = process.env.PRIVATE_KEYPAIR;
    if (!secretKey) {
        throw new Error("PRIVATE_KEYPAIR is not set in the .env file!");
    }
    const signerKeyPair = Keypair.fromSecretKey(bs58.decode(secretKey));
    const mintKeypair = Keypair.generate();

    // Prepare metadata upload
    const FormData = (await import("form-data")).default;
    const formData = new FormData();
    formData.append("file", fs.createReadStream(agentDetails.imagePath));
    formData.append("name", agentDetails.name);
    formData.append("symbol", agentDetails.symbol);

    const modifiedDescription = `${agentDetails.description}\n\n. Powered by QudeAI`;
    formData.append("description", modifiedDescription);

    const metadataResponse = await fetch("https://pump.fun/api/ipfs", {
        method: "POST",
        body: formData,
        headers: formData.getHeaders(),
    });

    if (!metadataResponse.ok) {
        throw new Error(`Failed to upload metadata: ${metadataResponse.statusText}`);
    }

    const metadataResponseJSON = (await metadataResponse.json()) as {
        metadata: { name: string; symbol: string };
        metadataUri: string;
    };

    // Create the token on Solana
    const response = await fetch("https://pumpportal.fun/api/trade-local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            publicKey: signerKeyPair.publicKey.toBase58(),
            action: "create",
            tokenMetadata: {
                name: metadataResponseJSON.metadata.name,
                symbol: metadataResponseJSON.metadata.symbol,
                uri: metadataResponseJSON.metadataUri,
            },
            mint: mintKeypair.publicKey.toBase58(),
            denominatedInSol: "true",
            amount: agentDetails.initialBuyAmount,
            slippage: 10,
            priorityFee: 0.0005,
            pool: "pump",
        }),
    });

    if (response.ok) {
        const data = await response.arrayBuffer();
        const tx = VersionedTransaction.deserialize(new Uint8Array(data));
        tx.sign([mintKeypair, signerKeyPair]);
        const signature = await web3Connection.sendTransaction(tx);

        console.log(`Transaction successful: https://solscan.io/tx/${signature}`);

        // Store agent details in Firebase, including personality
        await storeAgent(agentName, { 
            ...agentDetails, 
            mintAddress: mintKeypair.publicKey.toBase58(), 
            personality: agentDetails.personality // Save the personality field
        });

        console.log(`Agent "${agentName}" and mint address saved to Firebase.`);
    } else {
        console.error(`Error creating token: ${response.statusText}`);
    }
}

sendLocalCreateTx().catch((error) => {
    console.error("An error occurred during deployment:", error);
});

