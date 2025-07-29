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

const gracefulShutdown = async (signal: string) => {
	console.log(`🛑 ${signal} received, shutting down...`);
	process.exit(0);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
