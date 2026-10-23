import z from "zod";

export const getOrderSchema = z
  .object({
    orderId: z.string().trim().min(1),
  })
  .strict();
