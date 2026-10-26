import { Type, type FunctionDeclaration } from "@google/genai";
import { PolicyCategory } from "../../data/policies";

export const searchPolicyDeclaration: FunctionDeclaration = {
  name: "searchPolicy",
  description:
    "Retrieve company policies related to refunds, deliveries, or damaged products.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      category: {
        type: Type.STRING,
        enum: Object.values(PolicyCategory),
        description: "Category of policy to retrieve",
      },
    },
    required: ["category"],
  },
};
