import { toolRegistry } from "./tools.registry";

export async function executeTool(name: string, args: unknown) {
  if (!Object.hasOwn(toolRegistry, name)) {
    throw new Error(`Unknown tool: ${name}`);
  }

  const toolName = name as keyof typeof toolRegistry;
  const tool = toolRegistry[toolName];

  const validatedArgs = tool.schema.parse(args);

  return await tool.execute(validatedArgs);
}
