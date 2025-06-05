import { SophiaAgent } from "./agents/sophia";
import { runScheduled } from "./runner";
import { initializeToolsets } from "./runner";

async function main() {
	console.log("💫🧑‍🍳 Starting Sophia Agent...");
	const { atpTools, telegramTools, iqWikiTools } = await initializeToolsets();
	const sophiaAgent = new SophiaAgent(atpTools, telegramTools, iqWikiTools);
	await runScheduled(sophiaAgent);
}

main().catch(console.error);
