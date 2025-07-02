import { sophiaAgent } from "./agents/sophia";
import { env } from "./env";
import { runScheduled } from "./runner";
import { initializeToolsets } from "./runner";

async function main() {
	console.log("💫🧑‍🍳 Starting Sophia Agent...");
	const { atpTools, telegramTools, iqWikiTools } = await initializeToolsets();
	const agent = await sophiaAgent(
		atpTools,
		telegramTools,
		iqWikiTools,
		env.LLM_MODEL,
	);
	await runScheduled(agent);
}

main().catch(console.error);
