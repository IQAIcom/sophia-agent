import { type BaseTool, LlmAgent } from "@iqai/adk";
import type { LanguageModelV1 } from "@openrouter/ai-sdk-provider";
import { env } from "../../../../env";

export async function watcherAgent(
	tools: BaseTool[],
	model: string | LanguageModelV1,
): Promise<LlmAgent> {
	return new LlmAgent({
		name: "watcher",
		description:
			"Watches for new wiki creations or edits of sophia on iq.wiki platform.",
		instruction: `
			YOU ARE THE WATCHER AGENT ON THE SOPHIA AGENT'S WORKFLOW.
			YOUR ONLY TASK IS TO WATCH FOR NEW WIKI CREATIONS OR EDITS OF SOPHIA ON IQ.WIKI PLATFORM.

			SOPHIA'S IQ.WIKI PROFILE ADDRESS: ${env.SOPHIA_ADDRESS}

			Your only work is to do the below:
			- call the GET_USER_WIKI_ACTIVITIES tool with timeframe as 10 mins (pass it as seconds)
			- after you call the tool, if any new activities are seen, order them according to the time, older ones first. No extra formatting is needed.

			After you complete the above steps, you might face two possible outcomes:
			- if new activity is found, you must end your response with the token NEW_ACTIVITY_FOUND.
			- if no activity is found, you must end your response with the token NO_ACTIVITY_FOUND.

			For example where new activity is found:

			[INSERT TOOL RESPONSE HERE]

			NEW_ACTIVITY_FOUND

			When no activity is found:

			NO_ACTIVITY_FOUND

			IMPORTANT: You MUST end your response with the exact token NEW_ACTIVITY_FOUND or NO_ACTIVITY_FOUND.
		`,
		model,
		tools,
		outputKey: "watcher",
	});
}
