import {
	type BaseTool,
	type LLMResponse,
	LangGraphAgent,
	type LangGraphAgentConfig,
} from "@iqai/adk";
import { AtpLoggerAgent } from "./atp-logger";
import { NotifierAgent } from "./notifier";
import { WatcherAgent } from "./watcher";

export class SophiaAgent extends LangGraphAgent {
	constructor(
		atpTools: BaseTool[],
		telegramTools: BaseTool[],
		iqWikiTools: BaseTool[],
	) {
		const config: LangGraphAgentConfig = {
			name: "atp_investment_workflow",
			description:
				"Autonomous ATP agent investment workflow with discovery, analysis, and execution",
			nodes: [
				{
					name: "watcher",
					agent: new WatcherAgent(iqWikiTools),
					targets: ["atp_logger"],
				},
				{
					name: "atp_logger",
					agent: new AtpLoggerAgent(atpTools),
					condition: (result: LLMResponse, _) => {
						const content =
							typeof result.content === "string"
								? result.content
								: JSON.stringify(result.content);
						const matched = /new_activity_found/i.test(content);
						return matched;
					},
					targets: ["notifier"],
				},
				{
					name: "notifier",
					agent: new NotifierAgent(telegramTools),
					condition: (_) => true,
					targets: [],
				},
			],
			rootNode: "watcher",
			maxSteps: 12,
		};

		super(config);
	}
}
