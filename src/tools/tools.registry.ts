import { z } from "zod";
import { getOrderDeclaration } from "./order/order.declaration";
import { getOrder } from "./order/order.tool";
import { getOrderSchema } from "./order/order.schemas";

export const toolRegistry = {
  getOrder: {
    declaration: getOrderDeclaration,
    schema: getOrderSchema,
    execute: (args: z.infer<typeof getOrderSchema>) => getOrder(args.orderId),
  },
};
