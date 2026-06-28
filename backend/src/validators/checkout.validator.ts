import { z } from "zod";

export const createCheckoutSchema = z.object({
  capsuleId: z.string().uuid("ID de cápsula inválido"),
});

export type CreateCheckoutInput = z.infer<typeof createCheckoutSchema>;
