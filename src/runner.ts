import {
	GoogleLLM,
	LLMRegistry,
	McpError,
	McpToolset,
	type MessageRole,
} from "@iqai/adk";
import * as cron from "node-cron";
import type { SophiaAgent } from "./agents/sophia";
import { env } from "./env";
import {
	createAtpConfig,
	createIqWikiConfig,
	createTelegramConfig,
} from "./utils/mcp-config";

LLMRegistry.registerLLM(GoogleLLM);

let atpToolset: McpToolset | undefined;
let telegramToolset: McpToolset | undefined;
let iqWikiToolset: McpToolset | undefined;

export async function initializeToolsets() {
	atpToolset = new McpToolset(createAtpConfig());
	const atpTools = await atpToolset.getTools();
	console.log("🔗 ATP tools initialized");

	telegramToolset = new McpToolset(createTelegramConfig());
	const telegramTools = await telegramToolset.getTools();
	console.log("🔗 Telegram tools initialized");

	iqWikiToolset = new McpToolset(createIqWikiConfig());
	const iqWikiTools = await iqWikiToolset.getTools();

	return { atpTools, telegramTools, iqWikiTools };
}

export async function runScheduled(agent: SophiaAgent) {
	console.log(`⏰ Scheduled: ${env.CRON_SCHEDULE}`);
	cron.schedule(env.CRON_SCHEDULE, () => runCycle(agent), {
		timezone: "UTC",
	});

	await runCycle(agent);
	process.stdin.resume();
}

async function runCycle(agent: SophiaAgent) {
	try {
		console.log("🚀 Running sophia cycle...");
		const result = await agent.run({
			messages: [
				{
					role: "user" as MessageRole,
					content: "run the sophia agent",
				},
			],
		});

		if (result.content) {
			console.log(`✅ Result: ${result.content}`);
		}
	} catch (error) {
		const errorMsg =
			error instanceof McpError
				? `${error.type}: ${error.message}`
				: String(error);
		console.error(`❌ Error: ${errorMsg}`);
	}
}

export async function cleanup() {
	await Promise.allSettled([
		atpToolset?.close(),
		telegramToolset?.close(),
		iqWikiToolset?.close(),
	]);
}

const gracefulShutdown = async (signal: string) => {
	console.log(`🛑 ${signal} received, shutting down...`);
	await cleanup();
	process.exit(0);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
