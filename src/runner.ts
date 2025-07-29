import {
	type BuiltAgent,
	McpAtp,
	McpError,
	McpIqWiki,
	McpTelegram,
	type McpToolset,
} from "@iqai/adk";
import * as cron from "node-cron";
import { env } from "./env";

let atpToolset: McpToolset | undefined;
let telegramToolset: McpToolset | undefined;
let iqWikiToolset: McpToolset | undefined;

export async function initializeToolsets() {
	atpToolset = McpAtp({
		env: {
			...(env.ATP_API_URL ? { ATP_API_URL: env.ATP_API_URL } : {}),
			...(env.ATP_AGENT_ROUTER_ADDRESS
				? { ATP_AGENT_ROUTER_ADDRESS: env.ATP_AGENT_ROUTER_ADDRESS }
				: {}),
			ATP_BASE_TOKEN_ADDRESS: env.IQ_ADDRESS,
			ATP_API_KEY: env.ATP_API_KEY,
			PATH: env.PATH,
		},
	});
	const atpTools = await atpToolset.getTools();
	console.log("🔗 ATP tools initialized");

	telegramToolset = McpTelegram({
		env: {
			TELEGRAM_BOT_TOKEN: env.TELEGRAM_BOT_TOKEN,
			PATH: env.PATH,
		},
	});
	const telegramTools = await telegramToolset.getTools();
	console.log("🔗 Telegram tools initialized");

	iqWikiToolset = McpIqWiki({
		env: {
			PATH: env.PATH,
		},
	});
	const iqWikiTools = await iqWikiToolset.getTools();
	console.log("🔗 IQ Wiki tools initialized");

	return { atpTools, telegramTools, iqWikiTools };
}

export async function runScheduled(builtAgent: BuiltAgent) {
	console.log(`⏰ Scheduled: ${env.CRON_SCHEDULE}`);
	cron.schedule(env.CRON_SCHEDULE, () => runCycle(builtAgent), {
		timezone: "UTC",
	});

	await runCycle(builtAgent);
	process.stdin.resume();
}

async function runCycle(builtAgent: BuiltAgent) {
	try {
		console.log("🚀 Running sophia cycle...");
		const { runner } = builtAgent;
		await runner.ask("start!");
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
