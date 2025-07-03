import { AgentBuilder, type BaseTool, type BuiltAgent } from "@iqai/adk";
import { atpLoggerAgent } from "./atp-logger";
import { notifierAgent } from "./notifier";
import { watcherAgent } from "./watcher";

export async function sophiaAgent(
	atpTools: BaseTool[],
	telegramTools: BaseTool[],
	iqWikiTools: BaseTool[],
	llmModel: string,
): Promise<BuiltAgent> {
	const watcher = await watcherAgent(iqWikiTools, llmModel);
	const atpLogger = await atpLoggerAgent(atpTools, llmModel);
	const notifier = await notifierAgent(telegramTools, llmModel);

	return await AgentBuilder.create("sophia")
		.withDescription(
			"Sophia agent watches for new wiki creations or edits of sophia on iq.wiki platform and logs the activities to the ATP and sends a notification to the Telegram",
		)
		.asLangGraph(
			[
				{
					name: "watcher",
					agent: watcher.agent,
					targets: ["atp_logger"],
				},
				{
					name: "atp_logger",
					agent: atpLogger.agent,
					condition: (result) => {
						const content =
							typeof result.content === "string"
								? result.content
								: JSON.stringify(result.content);
						return /new_activity_found/i.test(content);
					},
					targets: ["notifier"],
				},
				{
					name: "notifier",
					agent: notifier.agent,
					condition: (_) => true,
					targets: [],
				},
			],
			"watcher",
		)
		.withQuickSession("sophia", "uid_1234")
		.build();
}
