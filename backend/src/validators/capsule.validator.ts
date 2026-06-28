import { z } from "zod";

export const timelineItemInputSchema = z.object({
  imageUrl: z.string().url("URL da imagem inválida"),
  caption: z.string().min(1, "A legenda não pode ser vazia").max(280),
  sortOrder: z.number().int().nonnegative().optional(),
});

// Nota: songFileUrl (upload de mp3) não entra aqui — é preenchido via
// endpoint de upload dedicado (POST /capsules/:id/song), igual ao fluxo
// de imagens da timeline. songUrl (link Spotify/YouTube) e songFileUrl
// são mutuamente exclusivos: enviar um novo arquivo limpa o outro, e vice-versa.
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
  // opcional — usado só para reenviar o link de gerenciamento por e-mail
  // depois do pagamento confirmado. Aceita string vazia (campo não preenchido
  // no formulário) tratando como ausência, igual ao padrão usado em songUrl.
  creatorEmail: z.string().email("E-mail inválido").optional().or(z.literal("")),
  timelineItems: z.array(timelineItemInputSchema).max(50).optional(),
});

export const updateCapsuleSchema = createCapsuleSchema.partial();

export type CreateCapsuleInput = z.infer<typeof createCapsuleSchema>;
export type UpdateCapsuleInput = z.infer<typeof updateCapsuleSchema>;
