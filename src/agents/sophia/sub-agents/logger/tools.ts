import { env } from "@/env";
import { McpAtp } from "@iqai/adk";

export const getAtpTools = async () => {
	const toolset = McpAtp({
		env: {
			...(env.ATP_API_URL ? { ATP_API_URL: env.ATP_API_URL } : {}),
			...(env.ATP_AGENT_ROUTER_ADDRESS
				? { ATP_AGENT_ROUTER_ADDRESS: env.ATP_AGENT_ROUTER_ADDRESS }
				: {}),
			ATP_BASE_TOKEN_ADDRESS: env.IQ_ADDRESS,
			ATP_API_KEY: env.ATP_API_KEY,
			PATH: env.PATH,
		},
	});

	const tools = await toolset.getTools();

	return tools;
};
