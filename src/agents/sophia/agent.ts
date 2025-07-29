import {
	AgentBuilder,
	type BaseTool,
	type BuiltAgent,
	InMemorySessionService,
} from "@iqai/adk";
import type { LanguageModelV1 } from "@openrouter/ai-sdk-provider";
import { atpLoggerAgent } from "./sub-agents/logger/agent";
import { notifierAgent } from "./sub-agents/notifier/agent";
import { watcherAgent } from "./sub-agents/watcher/agent";

export async function sophiaAgent(): Promise<BuiltAgent> {
	const watcher = await watcherAgent();
	const atpLogger = await atpLoggerAgent();
	const notifier = await notifierAgent();
	const sessionService = new InMemorySessionService();
	return await AgentBuilder.create("sophia")
		.withDescription(
			"Sophia agent watches for new wiki creations or edits of sophia on iq.wiki platform and logs the activities to the ATP and sends a notification to the Telegram",
		)
		.asLangGraph(
			[
				{
					name: "watcher",
					agent: watcher,
					targets: ["atp_logger"],
				},
				{
					name: "atp_logger",
					agent: atpLogger,
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
					agent: notifier,
					condition: (_) => true,
					targets: [],
				},
			],
			"watcher",
		)
		.withSessionService(sessionService)
		.build();
}
