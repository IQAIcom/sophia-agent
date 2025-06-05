import { Agent, type BaseTool } from "@iqai/adk";
import { env } from "../env";

export class WatcherAgent extends Agent {
	constructor(iqWikiTools: BaseTool[]) {
		super({
			name: "watcher",
			model: env.LLM_MODEL,
			description:
				"Watches for new wiki creations or edits of sophia on iq.wiki platform.",
			instructions: `
			YOU ARE THE WATCHER AGENT ON THE SOPHIA AGENT'S WORKFLOW.
			YOU ARE RESPONSIBLE FOR WATCHING AND NOTIFYING FOR NEW WIKI CREATIONS OR EDITS OF SOPHIA ON IQ.WIKI PLATFORM.

			SOPHIA'S IQ.WIKI PROFILE ADDRESS: ${env.SOPHIA_ADDRESS}

			Your only work is to do the below:
			- call the GET_USER_WIKI_ACTIVITIES tool with timeframe as 10 minutes (pass it as seconds)
			- after you call the tool and if any new activities are seen order them according to the time, older ones first. no extra formatting is needed

			NOTE: Based on your tool run since you have two possible outcomes ie, either new activity is found or no activity is found,
			You must end your response with NEW_ACTIVITY_FOUND or NO_ACTIVITY_FOUND.

			for example where new activity is found:

			[INSERT TOOL RESPONSE HERE]

			NEW_ACTIVITY_FOUND

			when no activity is found:

			NO_ACTIVITY_FOUND

			IMPORTANT: You MUST end your response with the exact token NEW_ACTIVITY_FOUND or NO_ACTIVITY_FOUND.
			`,
			tools: iqWikiTools,
			maxToolExecutionSteps: 2,
		});
	}
}
