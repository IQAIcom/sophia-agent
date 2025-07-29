import { AgentBuilder, type BuiltAgent } from "@iqai/adk";
import { atpLoggerAgent } from "./sub-agents/logger/agent";
import { notifierAgent } from "./sub-agents/notifier/agent";
import { wikisCheckerAgent } from "./sub-agents/wikis-checker/agent";

export async function sophiaAgent(): Promise<BuiltAgent> {
	const wikisChecker = await wikisCheckerAgent();
	const atpLogger = await atpLoggerAgent();
	const notifier = await notifierAgent();
	return await AgentBuilder.create("sophia")
		.withDescription(
			"Sophia agent watches for new wiki creations or edits of sophia on iq.wiki platform and logs the activities to the ATP and sends a notification to the Telegram",
		)
		.asLangGraph(
			[
				{
					name: "wikis_checker",
					agent: wikisChecker,
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
			"wikis_checker",
		)
		.build();
}
