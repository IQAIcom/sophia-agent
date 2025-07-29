import { type BaseTool, McpIqWiki } from "@iqai/adk";

export let tools: BaseTool[];

export const getIqWikiTools = async () => {
	if (!tools) {
		const toolset = McpIqWiki();

		tools = await toolset.getTools();
	}

	return tools;
};
