import { z } from "zod";
import { PolicyCategory } from "../../data/policies";

export const searchPolicyArgsSchema = z
  .object({
    category: z.enum(PolicyCategory),
  })
  .strict();
