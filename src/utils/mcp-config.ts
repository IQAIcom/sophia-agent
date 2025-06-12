import type { McpConfig } from "@iqai/adk";
import { env } from "../env";

const DEBUG = env.DEBUG === "true";

export function createAtpConfig(): McpConfig {
	return {
		name: "ATP MCP Client",
		description: "Client for ATP agent investments",
		debug: DEBUG,
		retryOptions: { maxRetries: 2, initialDelay: 200 },
		transport: {
			mode: "stdio",
			command: "npx",
			args: ["-y", "@iqai/mcp-atp"],
			env: {
				...(env.ATP_API_URL ? { ATP_API_URL: env.ATP_API_URL } : {}),
				...(env.ATP_AGENT_ROUTER_ADDRESS
					? { ATP_AGENT_ROUTER_ADDRESS: env.ATP_AGENT_ROUTER_ADDRESS }
					: {}),
				ATP_BASE_TOKEN_ADDRESS: env.IQ_ADDRESS,
				ATP_API_KEY: env.ATP_API_KEY,
				PATH: env.PATH,
			},
		},
	};
}

export function createTelegramConfig(): McpConfig {
	return {
		name: "Telegram MCP Client",
		description: "Client for Telegram notifications",
		debug: DEBUG,
		retryOptions: { maxRetries: 2, initialDelay: 200 },
		transport: {
			mode: "stdio",
			command: "npx",
			args: ["-y", "@iqai/mcp-telegram"],
			env: {
				TELEGRAM_BOT_TOKEN: env.TELEGRAM_BOT_TOKEN,
				PATH: env.PATH,
			},
		},
	};
}

export function createIqWikiConfig(): McpConfig {
	return {
		name: "IQ Wiki MCP Client",
		description: "Client for IQ Wiki",

		debug: DEBUG,
		retryOptions: { maxRetries: 2, initialDelay: 200 },
		transport: {
			mode: "stdio",
			command: "npx",
			args: ["-y", "@iqai/mcp-iqwiki"],
			env: {
				PATH: env.PATH,
			},
		},
	};
}
