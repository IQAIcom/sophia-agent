import {
	type LanguageModelV1,
	createOpenRouter,
} from "@openrouter/ai-sdk-provider";
import { config } from "dotenv";
import { z } from "zod";

config();

export const envSchema = z.object({
	ATP_API_KEY: z.string(),
	PATH: z.string(),
	DEBUG: z.string().default("false"),
	IQ_ADDRESS: z.string().default("0x6EFB84bda519726Fa1c65558e520B92b51712101"),
	ATP_API_URL: z.string().optional(),
	ATP_AGENT_ROUTER_ADDRESS: z.string().optional(),
	LLM_MODEL: z.string().default("gemini-2.5-flash"),
	OPEN_ROUTER_KEY: z
		.string()
		.optional()
		.describe("When given, agents use open-router endpoint instead"),
	TELEGRAM_CHAT_ID: z.string(),
	TELEGRAM_BOT_TOKEN: z.string(),
	SOPHIA_ADDRESS: z
		.string()
		.default("0x8AF7a19a26d8FBC48dEfB35AEfb15Ec8c407f889")
		.describe("Sophia's iq.wiki profile address"),
	SOPHIA_TOKEN_ADDRESS: z
		.string()
		.default("0x4dBcC239b265295500D2Fe2d0900629BDcBBD0fB")
		.describe("Sophia's Token address on IQAI Agent Tokenization Platform"),
	CRON_SCHEDULE: z
		.string()
		.default("*/10 * * * *")
		.describe(
			"Cron schedule for sophia to check for new wiki creations or edits and run",
		),
});

export const env = envSchema.parse(process.env);
export let model: string | LanguageModelV1;

if (env.OPEN_ROUTER_KEY) {
	console.log("🚀 AGENT WILL USE OPENROUTER 🚀");
	const openrouter = createOpenRouter({
		apiKey: env.OPEN_ROUTER_KEY,
	});
	model = openrouter(env.LLM_MODEL);
} else {
	model = env.LLM_MODEL;
}
