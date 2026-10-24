import { toolRegistry } from "./tools.registry";

export async function executeTool(name: string, args: unknown) {
  if (!Object.hasOwn(toolRegistry, name)) {
    throw new Error(`Unknown tool: ${name}`);
  }

  const tool = toolRegistry[name as keyof typeof toolRegistry];

  return await tool.run(args);
}
