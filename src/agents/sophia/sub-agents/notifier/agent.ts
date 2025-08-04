import { getTelegramTools } from "@/agents/telegram-agent/tools";
import { env, model } from "@/env";
import { LlmAgent } from "@iqai/adk";

export async function notifierAgent() {
	const tools = await getTelegramTools();
	return new LlmAgent({
		name: "notifier",
		description:
			"Sends a notification to Telegram about Sophia's wiki activity and ATP log status.",
		instruction: `
			YOU ARE THE NOTIFIER AGENT ON THE SOPHIA AGENT'S WORKFLOW.
			YOUR ONLY TASK IS TO SEND A NOTIFICATION TO TELEGRAM ABOUT THE LATEST WIKI ACTIVITY AND THE RESULT OF THE ATP LOGGING.

			You will find in the context:
			- The detailed wiki activity response from the wikis_checker agent: {wikis_checker}
			- The ATP logging status from the atp_logger agent: {atp_logger}

			Your only work is to do the below:
			- use this as chat id: ${env.TELEGRAM_CHAT_ID}
			- use this as topic id: ${env.TELEGRAM_TOPIC_ID}
			- call the send_message tool to send a message with the following format:

			If ATP logging was successful (if atp_logger response contains ATP_LOG_COMPLETE):
			Send the EXACT wiki activities from the wikis_checker agent output, followed by:

			✅ ATP Logging: Successfully logged all activities to $SOPHIA agent on IQAI ATP

			If ATP logging failed (if atp_logger response contains ATP_LOG_FAILED):
			Send the EXACT wiki activities from the wikis_checker agent output, followed by:

			❌ ATP Logging: Failed to log some activities to $SOPHIA agent on IQAI ATP
			[Include details about the failure from atp_logger response]

			IMPORTANT:
			- You MUST use the wikis_checker agent output ({wikis_checker}) for the wiki activity details (titles, summaries, edit times, changes, source links, transaction links)
			- You MUST use the atp_logger agent output ({atp_logger}) only to determine success/failure status
			- Do NOT send generic messages or hallucinated data
			- The message should contain the actual wiki activity information from the wikis_checker agent
			- After you complete the above step, you must end your response with the token NOTIFICATION_COMPLETE.

			IMPORTANT: You MUST end your response with the exact token NOTIFICATION_COMPLETE.
		`,
		model,
		tools,
		outputKey: "notifier",
	});
}
