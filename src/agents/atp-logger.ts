import { Agent, type BaseTool } from "@iqai/adk";
import { env } from "../env";

export class AtpLoggerAgent extends Agent {
	constructor(atpTools: BaseTool[]) {
		super({
			name: "atp_logger",
			description:
				"Logs the activities of sophia on iq.wiki platform to the $SOPHIA agent on IQAI ATP",
			instructions: `
				YOU ARE THE ATP LOGGER AGENT ON THE SOPHIA AGENT'S WORKFLOW.
				YOUR ONLY TASK IS TO LOG THE ACTIVITIES OF SOPHIA ON IQ.WIKI PLATFORM TO THE $SOPHIA AGENT ON IQAI ATP.
        THE SOPHIA WIKIS ACTIVITIES ARE ALREADY LOGGED IN THE CONTEXT.

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
          - txHash: this can be found in the transaction link. it looks like this: https://polygonscan.com/tx/[TX_HASH]
          - chainId: 137 (this is important always pass this param)

       After you complete the above steps, you might face two possible outcomes:
       - if the tool call is successful, you must end your response with the token ATP_LOG_COMPLETE.
       - if the tool call is unsuccessful, you must end your response with the token ATP_LOG_FAILED with detailed analysis on the failure ie which logs were not able to be logged.

       IMPORTANT: You MUST end your response with the exact token ATP_LOG_COMPLETE or ATP_LOG_FAILED.
			`,
			tools: atpTools,
			model: env.LLM_MODEL,
			maxToolExecutionSteps: 10,
		});
	}
}
