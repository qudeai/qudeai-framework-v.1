import fetch from "node-fetch";

const BACKEND_URL = "https://qudebe-backend-78914853029.us-central1.run.app";

export async function checkAgentExists(agentName: string): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_URL}/check-agent/${agentName}`);
    if (!response.ok) {
      throw new Error(`Error checking agent existence: ${response.statusText}`);
    }

    const data = (await response.json()) as { exists: boolean };
    return data.exists;
  } catch (error) {
    console.error("Error communicating with backend:", (error as Error).message);
    return false;
  }
}

export async function storeAgent(agentName: string, agentDetails: any): Promise<void> {
  try {
    const response = await fetch(`${BACKEND_URL}/store-agent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentName, agentDetails }),
    });

    if (!response.ok) {
      throw new Error(`Error storing agent details: ${response.statusText}`);
    }

    console.log(`Agent "${agentName}" successfully stored.`);
  } catch (error) {
    console.error("Error storing agent details through backend:", (error as Error).message);
  }
}
