import { z } from "zod";

export const getShipmentArgsSchema = z
  .object({
    shipmentId: z.string().trim().min(1),
  })
  .strict();
