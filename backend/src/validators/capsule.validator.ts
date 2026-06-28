import { z } from "zod";

export const timelineItemInputSchema = z.object({
  imageUrl: z.string().url("URL da imagem inválida"),
  caption: z.string().min(1, "A legenda não pode ser vazia").max(280),
  sortOrder: z.number().int().nonnegative().optional(),
});

export const createCapsuleSchema = z.object({
  title: z.string().min(1, "O título é obrigatório").max(120),
  recipientName: z.string().max(120).optional(),
  occasion: z.string().max(120).optional(),
  songUrl: z
    .string()
    .url("URL da música inválida")
    .refine(
      (url) =>
        url.includes("spotify.com") ||
        url.includes("youtube.com") ||
        url.includes("youtu.be"),
      "A música deve ser um link do Spotify ou YouTube"
    )
    .optional()
    .or(z.literal("")),
  letter: z.string().min(1, "A carta não pode ser vazia").max(5000),
  timelineItems: z.array(timelineItemInputSchema).max(50).optional(),
});

export const updateCapsuleSchema = createCapsuleSchema.partial();

export type CreateCapsuleInput = z.infer<typeof createCapsuleSchema>;
export type UpdateCapsuleInput = z.infer<typeof updateCapsuleSchema>;
