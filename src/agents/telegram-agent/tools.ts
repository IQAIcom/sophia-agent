import { env } from "@/env";
import { McpTelegram, type SamplingHandler } from "@iqai/adk";

export const getTelegramTools = async (samplingHandler?: SamplingHandler) => {
	const toolset = McpTelegram({
		samplingHandler,
		env: {
			TELEGRAM_BOT_TOKEN: env.TELEGRAM_BOT_TOKEN,
		},
	});

	const tools = await toolset.getTools();

	return tools;
};
