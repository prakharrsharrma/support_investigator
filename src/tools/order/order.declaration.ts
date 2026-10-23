import { Type, type FunctionDeclaration } from "@google/genai";

export const getOrderDeclaration: FunctionDeclaration = {
  name: "getOrder",
  description: "Retrieve an order by its order ID to check its current status.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      orderId: {
        type: Type.STRING,
        description: "The order identifier, e.g. ORD-123",
      },
    },
    required: ["orderId"],
  },
};
