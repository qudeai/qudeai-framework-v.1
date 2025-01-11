
# QudeAI Agent Framework
##### The Qude Framework open-source code allows users to create AI agents directly in their CLI, with Qude acting as a co-pilot to help build them. The Qude API enables interaction with the AI agents created using the Qude Framework's open-source code.

### 🌟 Key Features
- Agent Deployment: Deploy custom AI agents onto the Solana blockchain.
- Agent Interaction: Use natural language queries to interact with deployed agents.
- Market Analysis: Fetch real-time blockchain data, including market cap, top token holders, and trading activity
- Trend Insights: Discover trending tokens and analyze trading patterns.
- Custom Queries: Execute powerful custom queries for advanced data analysis.
- Bitquery Integration: Seamlessly integrates with Bitquery APIs to fetch blockchain data.

### 🛠 Framework Capabilities:
- Token Interaction: Query token metrics such as market cap and top holders.
- Trading Analysis: Identify trending tokens and analyze transaction data.
- Customizable Commands: Easily define custom scripts for agent interaction and deployment.
- Cross-Platform: Fully compatible with modern Node.js environments.

## 🚀 Quick Start
### Prerequisites
- Node.js (>= 16.x)
- npm (or yarn) installed
- A valid Bitquery API key
- read .env.example for rest of the Prerequisites

### Installation 
1. Clone the repository
``` bash 
git clone https://github.com/qudeai/qudeai-framework-v.1.git
cd qudeai-framework-v.1
```
2. Install dependencies:
``` bash
npm install
```
3. Set up environment variables: Create a .env file in the root directory and add the following variables:
 
```bash
PRIVATE_KEYPAIR=<YOUR_PRIVATE_KEYPAIR>
OPENAI_API_KEY=<YOUR_OPENAI_API_KEY> 
RPC_ENDPOINT=https://api.mainnet-beta.solana.com 
Add your Bitquery API in interactAgent.ts 
```
4. Build the Framework
```bash
npm run build
```

## 📜 Available Commands
1. Ask Queries to an Agent:
```bash
npm run askqude {agentName} {yourQuestion}
```
   - example
   ```bash
   npm run askqude Aura "What is the market cap of Solana?"
```
2. Deploy an Agent or Token:
- Go to defineAgent.ts and replace placeholders as you want. 
- Then Run,
```bash 
npm run build 
```
```bash
npm run deployqude
```
- Deploys a new agent or token to the Solana blockchain.

3. Interact with an Agent:
```bash
npm run interactqude {agent_name} ask "Your question"
```
- Example 
```bash
npm run interactqude Aura ask "Trending token 24h"
```
4. Fetch Trending Tokens:
```bash 
npm run interactqude Aura ask "Trending token 24h"
```
5. Fetch Top Token Holders:
```bash
npm run interactqude Aura ask "Top holders: {mintAddress}"
```
- Example 
```bash
npm run interactqude Aura ask "Top holders: 6LKbpcg2fQ84Ay3kKXVyo3bHUGe3s36g9EVbKYSupump"
```
6. Fetch Market Cap Data:
```bash
npm run interactqude Aura ask "Marketcap count:{count} term:\"{term}\""
``` 
- Example
```bash
npm run interactqude Aura ask "Marketcap count:50 term:\"pump\""
```
7. Fetch First Top Buyers:
```bash
npm run interactqude {agentName} ask "First top {count} buyers for: {mintAddress}"
```
- Example 
```bash 
npm run interactqude Aura ask "First top 10 buyers for: 6LKbpcg2fQ84Ay3kKXVyo3bHUGe3s36g9EVbKYSupump"
```
8. Trade tokens
```bash 
npm run qude-trade {agent_name}
```
## Dependencies

The project utilizes the following dependencies:

| Dependency         | Version  | Description                                                                 |
|--------------------|----------|-------------------------------------------------------------------------|
| `@solana/web3.js`          | ^1.98.0  | Interact with Solana blockchain.	                             |
| `dotenv`             | ^16.4.7   | Load environment variables from a .env file.           |
| `firebase`   | ^11.1.0  | Firebase SDK for secure and scalable data storage.                          |
| `node-fetch`           | ^3.3.2  | Lightweight HTTP client for making API requests.                            |
| `openai`           | ^4.77.3  | Integration with OpenAI APIs for natural language queries.              |
| `bs58`          | ^6.0.0	  | Base58 encoding/decoding for Solana addresses.	                             |
| `form-data`             | ^4.0.1   | Handle multipart/form-data requests.          |
| `punycode`   | ^2.3.1	  | Utility for converting Unicode strings.


## Dev Dependencies

The project utilizes the following development dependencies:

| Dependency         | Version  | Purpose                                                                 |
|--------------------|----------|-------------------------------------------------------------------------|
| `typescript`          | ^5.7.3  | Strongly-typed JavaScript for scalable and reliable code.	                                      |
| `ts-node`   | ^10.9.2  | Execute TypeScript code without transpiling it first.                          |
| `tsconfig-paths`           | ^4.2.0  | Resolve module paths in TypeScript projects for better structure.                            

## 🛠 Scripts Overview
#### The framework comes with several npm scripts for ease of use:

- `npm run build`: Transpile TypeScript to JavaScript.
- `npm run askqude`: Ask general questions to your AI agents.
- `npm run deployqude`: Deploy a new agent to the Solana blockchain.
- `npm run interactqude`: Interact with deployed agents using queries.
- `npm run qude-trade`: Trade tokens on solana blockchain.

## 🔧 How It Works
- Firebase Integration: Provides secure storage and retrieval of agent-related data.
- Bitquery Integration: Fetches real-time and historical blockchain data for queries.
- Command Parsing: Processes user commands to route them to the appropriate functionality.
- Customizable Framework: Modify or extend the framework to suit your specific needs.

# USING api.qude.ai API

## Prerequisites

To use the API, ensure you have the following:

1. **API Access**: The API is publicly available at [api.qude.ai](https://api.qude.ai).
2. **API Client**: Use a tool like `curl`, Postman, or any HTTP client library in your preferred programming language.

---

## API Endpoints

### 1. Fetch Agent Details
Retrieve metadata about an agent from the official Qude Framework database.

**GET** `/api/agent/:name`

#### Request Example:
```bash
curl https://api.qude.ai/api/agent/Aura
```
**Response Example:**
```bash
{
  "name": "Aura",
  "description": "An intelligent agent designed to assist with tasks.",
  "createdAt": "2025-01-01T12:00:00Z"
}
```
#### 2. Interact with an Agent (GET Method)
Send a message to an agent and receive an AI-generated response using query parameters.

**GET** `/api/agent/:name/interact?message=YourMessage`

**Request Example:**
```bash
curl "https://api.qude.ai/api/agent/Aura/interact?message=Hello!"
```
**Response Example:**
```bash
{
  "agent": "Aura",
  "reply": "Hello! How can I assist you today?"
}
```
#### 3. Interact with an Agent (POST Method)
Send a message to an agent and receive an AI-generated response using a JSON payload.

**POST** `/api/agent/:name/interact`

**Request Example:**
```bash
curl -X POST "https://api.qude.ai/api/agent/Aura/interact" \
-H "Content-Type: application/json" \
-d '{"message": "Hello, Aura"}'
```
**Response Example:**
```bash
{
  "agent": "Aura",
  "reply": "Hey, how can i help you?"
}
```
## Example Usage in Node.js
Here’s how you can interact with the API programmatically:
```bash
const fetch = require("node-fetch");

async function interactWithAgent(agentName, message) {
  const response = await fetch(`https://api.qude.ai/api/agent/${agentName}/interact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    console.error("Failed to interact with the agent:", response.statusText);
    return;
  }

  const data = await response.json();
  console.log("Agent Reply:", data.reply);
}

interactWithAgent("Aura", "Hello there!");
```

## Notes for api.qude.ai
- No Local Setup Required: This API is fully hosted and ready to use—no Firebase setup or service account keys needed.
- Agent Metadata: All agent information is sourced directly from the official Qude Framework database.

## 🤝 Contribution
We welcome contributions! To get started:

- Fork the repository.
- Create a new branch (feature/my-feature).
- Make your changes and commit them.
- Open a pull request.
