import { sophiaAgent } from "./agents/sophia/agent";
import { createTelegramAgent } from "./agents/telegram-agent/agent";
import { runScheduled } from "./cron";

async function main() {
	console.log("💫🧑‍🍳 Starting Sophia Agent...");
	await createTelegramAgent();
	const agent = await sophiaAgent();
	await runScheduled(agent);
}

main().catch(console.error);
