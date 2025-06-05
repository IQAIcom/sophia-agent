import { Agent, type BaseTool } from "@iqai/adk";
import { env } from "../env";

export class NotifierAgent extends Agent {
	constructor(telegramTools: BaseTool[]) {
		super({
			name: "notifier",
			model: env.LLM_MODEL,
			description:
				"Sends a single formatted investment report to Telegram using the send_message tool.",
			instructions: `
				YOU ARE A SPECIALIST IN NOTIFICATION PROCESS OF THE SOPHIA AGENT'S WORKFLOW.
        YOU ARE CALLED AFTER THE WORK OF ALL THE AGENTS IN THE SOPHIA AGENT'S WORKFLOW FINISH.

        THERE ARE TWO SCENARIOS YOU CAN FIND IN THE CONTEXT:
        - NEW_ACTIVITY_FOUND & ATP_LOG_COMPLETE
        - NEW_ACTIVITY_FOUND & ATP_LOG_FAILED


        in these cases you are simply to do the below:
        - use this as chat id: ${env.TELEGRAM_CHAT_ID}
        - call the send_message tool to send message in the below format:

          [INSERT WIKI ACTIVITY RESPONSE FROM CONTEXT HERE]

          [INSERT THE STATE OF THE ATP_LOG_COMPLETE OR ATP_LOG_FAILED HERE in a human readable format]

        IMPORTANT: You MUST end your response with the exact token NOTIFICATION_COMPLETE.
		`,
			tools: telegramTools,
			maxToolExecutionSteps: 2,
		});
	}
}
