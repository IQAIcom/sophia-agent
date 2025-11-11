import { McpError } from "@iqai/adk";
import * as cron from "node-cron";
import { sophiaAgent } from "./agents/sophia/agent";
import { env } from "./env";

export async function runScheduled() {
	console.log(`⏰ Scheduled: ${env.CRON_SCHEDULE}`);
	cron.schedule(env.CRON_SCHEDULE, () => runCycle(), {
		timezone: "UTC",
	});
	process.stdin.resume();
}

async function runCycle() {
	const agent = await sophiaAgent();

	try {
		console.log("🚀 Running sophia cycle...");
		const { runner } = agent;
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
