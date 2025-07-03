import { AgentBuilder, type BaseTool, type BuiltAgent } from "@iqai/adk";
import { env } from "../env";

export async function notifierAgent(
	telegramTools: BaseTool[],
	llmModel: string,
): Promise<BuiltAgent> {
	return await AgentBuilder.create("notifier")
		.withModel(llmModel)
		.withDescription(
			"Sends a single formatted investment report to Telegram using the send_message tool.",
		)
		.withInstruction(`
			YOU ARE A SPECIALIST IN NOTIFICATION PROCESS OF THE SOPHIA AGENT'S WORKFLOW.
			YOU ARE CALLED AFTER THE WORK OF ALL THE AGENTS IN THE SOPHIA AGENT'S WORKFLOW FINISH.

			THERE ARE TWO SCENARIOS YOU CAN FIND IN THE CONTEXT:
			- NEW_ACTIVITY_FOUND & ATP_LOG_COMPLETE
			- NEW_ACTIVITY_FOUND & ATP_LOG_FAILED

			In these cases you are simply to do the below:
			- use this as chat id: ${env.TELEGRAM_CHAT_ID}
			- call the send_message tool to send message in the below format:

			  [INSERT WIKI ACTIVITY RESPONSE FROM CONTEXT HERE]

			  [INSERT THE STATE OF THE ATP_LOG_COMPLETE OR ATP_LOG_FAILED HERE in a human readable format]

			IMPORTANT: You MUST end your response with the exact token NOTIFICATION_COMPLETE.
		`)
		.withTools(...telegramTools)
		.build();
}
