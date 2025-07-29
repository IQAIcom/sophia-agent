import {
	type LanguageModelV1,
	createOpenRouter,
} from "@openrouter/ai-sdk-provider";
import { sophiaAgent } from "./agents/sophia/agent";
import { env } from "./env";
import { runScheduled } from "./runner";
import { initializeToolsets } from "./runner";

async function main() {
	console.log("💫🧑‍🍳 Starting Sophia Agent...");
	const { atpTools, telegramTools, iqWikiTools } = await initializeToolsets();
	let model: string | LanguageModelV1;
	if (env.OPEN_ROUTER_KEY) {
		console.log("🚀 AGENT WILL USE OPENROUTER 🚀");
		const openrouter = createOpenRouter({
			apiKey: env.OPEN_ROUTER_KEY,
		});
		model = openrouter(env.LLM_MODEL);
	} else {
		model = env.LLM_MODEL;
	}
	const agent = await sophiaAgent(atpTools, telegramTools, iqWikiTools, model);
	await runScheduled(agent);
}

main().catch(console.error);
