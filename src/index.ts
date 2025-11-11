import { createTelegramAgent } from "./agents/telegram-agent/agent";
import { runScheduled } from "./cron";

async function main() {
	console.log("💫🧑‍🍳 Starting Sophia Agent...");
	await createTelegramAgent();
	await runScheduled();
}
main().catch(console.error);
