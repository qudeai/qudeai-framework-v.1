import fetch from "node-fetch";
import { getAgentData } from "./firebase.js";
import { OpenAI } from "openai";
import * as dotenv from "dotenv";
dotenv.config();

const openAi = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function validateAgentAndRespond(agentName: string, userMessage: string) {
  const agentData = await getAgentData(agentName);

  if (!agentData) {
    console.error(`Error: Agent "${agentName}" does not exist or has no data.`);
    return;
  }

  try {
    const response = await openAi.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are ${agentName}, an AI agent with the following personality: "${agentData.personality}". Respond to the user based on this personality.`,
        },
        { role: "user", content: userMessage },
      ],
    });

    const agentReply = response.choices[0]?.message?.content || "I'm sorry, I couldn't process your request.";
    console.log(`Agent ${agentName}: ${agentReply}`);
  } catch (error) {
    console.error("Error generating response:", error);
  }
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: npm run askqude {agent_name} "Your message here"');
  process.exit(1);
}

const agentName = args[0];
const userMessage = args.slice(1).join(" ");
validateAgentAndRespond(agentName, userMessage).catch((error) => {
  console.error("An error occurred:", error);
});
