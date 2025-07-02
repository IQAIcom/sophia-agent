import {
	type BaseTool,
	type BuiltAgent,
	McpError,
	McpToolset,
} from "@iqai/adk";
import * as cron from "node-cron";
import { env } from "./env";
import {
	createAtpConfig,
	createIqWikiConfig,
	createTelegramConfig,
} from "./utils/mcp-config";

let atpToolset: McpToolset | undefined;
let telegramToolset: McpToolset | undefined;
let iqWikiToolset: McpToolset | undefined;

export async function initializeToolsets() {
	const atpConfig = createAtpConfig();
	atpToolset = new McpToolset(atpConfig);
	const atpTools = await atpToolset.getTools();
	console.log("🔗 ATP tools initialized");

	const telegramConfig = createTelegramConfig();
	let telegramTools: BaseTool[] = [];
	telegramToolset = new McpToolset(telegramConfig);
	telegramTools = await telegramToolset.getTools();
	console.log("🔗 Telegram tools initialized");

	iqWikiToolset = new McpToolset(createIqWikiConfig());
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
		const { runner, session } = builtAgent;
		if (!runner || !session) {
			throw new Error("Runner or session not found");
		}

		for await (const event of runner.runAsync({
			userId: "uid_1234",
			sessionId: session.id,
			newMessage: {
				role: "user",
				parts: [{ text: "continue" }],
			},
		})) {
			if (event.content?.parts) {
				const content = event.content.parts
					.map((part: { text?: string }) => part.text || "")
					.join("");
				if (content) {
					console.log(`✅ Result: ${content}`);
				}
			}
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
