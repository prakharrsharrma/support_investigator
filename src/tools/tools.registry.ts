import type { FunctionDeclaration } from "@google/genai";
import { z } from "zod";
import { getOrderDeclaration } from "./order/order.declaration";
import { getOrderSchema } from "./order/order.schemas";
import { getOrder } from "./order/order.tool";
import { getShipmentDeclaration } from "./shipment/shipment.declaration";
import { getShipmentArgsSchema } from "./shipment/shipment.schemas";
import { getShipment } from "./shipment/shipment.tool";

function defineTool<T extends z.ZodType>(
  declaration: FunctionDeclaration,
  schema: T,
  execute: (args: z.output<T>) => unknown,
) {
  return {
    declaration,
    run: (rawArgs: unknown) => {
      const args = schema.parse(rawArgs);
      return execute(args);
    },
  };
}

export const toolRegistry = {
  getOrder: defineTool(getOrderDeclaration, getOrderSchema, (args) =>
    getOrder(args.orderId),
  ),

  getShipment: defineTool(
    getShipmentDeclaration,
    getShipmentArgsSchema,
    (args) => getShipment(args.shipmentId),
  ),
};
