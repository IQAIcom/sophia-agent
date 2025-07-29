import { McpIqWiki } from "@iqai/adk";

export const getIqWikiTools = async () => {
	const toolset = McpIqWiki();

	const tools = await toolset.getTools();

	return tools;
};
