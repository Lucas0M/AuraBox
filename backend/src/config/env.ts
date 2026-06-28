import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatória"),
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  FRONTEND_URL: z.string().url(),

  ABACATEPAY_API_KEY: z.string().min(1, "ABACATEPAY_API_KEY é obrigatória"),
  ABACATEPAY_WEBHOOK_SECRET: z.string().min(1, "ABACATEPAY_WEBHOOK_SECRET é obrigatória"),

  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Variáveis de ambiente inválidas ou faltando:");
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
