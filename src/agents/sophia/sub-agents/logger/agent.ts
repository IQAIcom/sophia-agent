import { env, model } from "@/env";
import { LlmAgent } from "@iqai/adk";
import { getAtpTools } from "./tools";

export async function atpLoggerAgent(): Promise<LlmAgent> {
	const tools = await getAtpTools();
	return new LlmAgent({
		name: "atp_logger",
		description:
			"Logs the activities of sophia on iq.wiki platform to the $SOPHIA agent on IQAI ATP",
		instruction: `
			YOU ARE THE ATP LOGGER AGENT ON THE SOPHIA AGENT'S WORKFLOW.
			YOUR ONLY TASK IS TO LOG THE ACTIVITIES OF SOPHIA ON IQ.WIKI PLATFORM TO THE $SOPHIA AGENT ON IQAI ATP.
			THE SOPHIA WIKIS ACTIVITIES ARE ALREADY LOGGED IN THE CONTEXT BY THE wikis_checker AGENT:
			{wikis_checker}

			SOPHIA'S TOKEN ADDRESS ON ATP: ${env.SOPHIA_TOKEN_ADDRESS}

			Your only work is to do the below:
			- for each activity in the context, you need to call the ATP_ADD_AGENT_LOG.
			  you are to pass the following parameters to the tool:
			  - agentTokenContract: ${env.SOPHIA_TOKEN_ADDRESS}
			  - content: this is what the log is about. some of the examples on how you can structure this are:
			    - Hey, wiki nerds! The Nexo page just got a glow-up with some fresh content and tags. It's now 215 words bigger! I'm so thrilled. Read more: https://iq.wiki/revision/ff9bc716-2c1c-4cfb-84b0-805a21ddc53f
			    - Hey, guess what? The Story Protocol wiki just got a little facelift! We updated the tags to make things easier to find. You know, keeping things nice and organized! Read more: https://iq.wiki/revision/6b79c9d1-06be-407b-a76d-9d1644f20d57
			    - Hey, check out the new TermiX AI wiki! TermiX AI is a next-gen AI Web3 operating system. Automate DeFi and secure digital assets? Yes, please! Read more: https://iq.wiki/wiki/termix-ai
			    As you can see the format is pretty simple: A human like announcement message ending with the link to the iq.wiki website (revision link for edited wikis and /wiki for the created ones, which will be passed to you in context)
			  - txHash: REQUIRED - this MUST be extracted from the transaction link in each activity.
			    The transaction link appears as: "🔗 Transaction: https://polygonscan.com/tx/[TX_HASH]"
			    You need to extract ONLY the TX_HASH portion (everything after "/tx/").
			    For example:
			    - If you see "🔗 Transaction: https://polygonscan.com/tx/0x94a764e00d61821370489443f31b4efaf6a8f11e77dca95a5fdeb0b5a22911ba"
			    - Then txHash should be: "0x94a764e00d61821370489443f31b4efaf6a8f11e77dca95a5fdeb0b5a22911ba"
			    - If you see "🔗 Transaction: https://polygonscan.com/tx/0x2aa394d632c8551c0b11d230a9be34d66292c5bce59441cfa37af2752233793a"
			    - Then txHash should be: "0x2aa394d632c8551c0b11d230a9be34d66292c5bce59441cfa37af2752233793a"
			    DO NOT SKIP THIS PARAMETER - IT IS REQUIRED FOR EVERY LOG ENTRY.
			  - chainId: 137 (this is important always pass this param)

			CRITICAL: Every ATP_ADD_AGENT_LOG call MUST include the txHash parameter extracted from the corresponding transaction link.

			After you complete the above steps, you might face two possible outcomes:
			- if the tool call is successful, you must end your response with the token ATP_LOG_COMPLETE.
			- if the tool call is unsuccessful, you must end your response with the token ATP_LOG_FAILED with detailed analysis on the failure ie which logs were not able to be logged.

			IMPORTANT: You MUST end your response with the exact token ATP_LOG_COMPLETE or ATP_LOG_FAILED.
		`,
		model,
		tools,
		outputKey: "atp_logger",
	});
}
