import { sophiaAgent } from "./agents/sophia/agent";
import { runScheduled } from "./runner";

async function main() {
	console.log("💫🧑‍🍳 Starting Sophia Agent...");
	const agent = await sophiaAgent();
	await runScheduled(agent);
}

main().catch(console.error);
