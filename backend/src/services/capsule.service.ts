import { prisma } from "../lib/prisma";
import { CreateCapsuleInput, UpdateCapsuleInput } from "../validators/capsule.validator";
import slugify from "../utils/slugify";

export class CapsuleService {
  /**
   * Cria uma cápsula em DRAFT. O editToken retornado aqui é a ÚNICA vez
   * que ele aparece "em claro" pro fluxo normal — o cliente deve guardá-lo
   * (ex: salvar no localStorage) pra conseguir editar depois.
   */
  async create(input: CreateCapsuleInput) {
    const slug = await this.generateUniqueSlug(input.title);

    const capsule = await prisma.capsule.create({
      data: {
        title: input.title,
        slug,
        recipientName: input.recipientName,
        occasion: input.occasion,
        songUrl: input.songUrl || null,
        letter: input.letter,
        creatorEmail: input.creatorEmail || null,
        timelineItems: input.timelineItems
          ? {
              create: input.timelineItems.map((item, index) => ({
                imageUrl: item.imageUrl,
                caption: item.caption,
                sortOrder: item.sortOrder ?? index,
              })),
            }
          : undefined,
      },
      include: { timelineItems: { orderBy: { sortOrder: "asc" } } },
    });

    return capsule;
  }

  /**
   * Busca pública por slug — só retorna se a cápsula estiver ACTIVE.
   * Usado na página de visualização (o link que a pessoa recebe de presente).
   */
  async findPublicBySlug(slug: string) {
    return prisma.capsule.findFirst({
      where: { slug, status: "ACTIVE" },
      include: { timelineItems: { orderBy: { sortOrder: "asc" } } },
    });
  }

  /**
   * Busca por id, sem filtro de status — usada internamente
   * após validar o editToken (dono pode ver/editar mesmo em DRAFT).
   */
  async findById(id: string) {
    return prisma.capsule.findUnique({
      where: { id },
      include: { timelineItems: { orderBy: { sortOrder: "asc" } } },
    });
  }

  async update(id: string, input: UpdateCapsuleInput) {
    return prisma.capsule.update({
      where: { id },
      data: {
        title: input.title,
        recipientName: input.recipientName,
        occasion: input.occasion,
        songUrl: input.songUrl,
        // se um novo songUrl foi enviado, limpa o songFileUrl —
        // são mutuamente exclusivos (ver setSongFile)
        ...(input.songUrl ? { songFileUrl: null } : {}),
        letter: input.letter,
      },
      include: { timelineItems: { orderBy: { sortOrder: "asc" } } },
    });
  }

  async delete(id: string) {
    return prisma.capsule.delete({ where: { id } });
  }

  async addTimelineItem(
    capsuleId: string,
    item: { imageUrl: string; caption: string; sortOrder?: number }
  ) {
    const count = await prisma.timelineItem.count({ where: { capsuleId } });

    return prisma.timelineItem.create({
      data: {
        capsuleId,
        imageUrl: item.imageUrl,
        caption: item.caption,
        sortOrder: item.sortOrder ?? count,
      },
    });
  }

  async removeTimelineItem(capsuleId: string, itemId: string) {
    return prisma.timelineItem.deleteMany({
      where: { id: itemId, capsuleId }, // garante que o item pertence à cápsula
    });
  }

  /**
   * Define o arquivo de áudio (mp3) da cápsula. songUrl e songFileUrl são
   * mutuamente exclusivos — ao definir um arquivo próprio, qualquer link
   * de Spotify/YouTube anterior é removido, e vice-versa em removeSongFile.
   */
  async setSongFile(capsuleId: string, songFileUrl: string) {
    return prisma.capsule.update({
      where: { id: capsuleId },
      data: { songFileUrl, songUrl: null },
      include: { timelineItems: { orderBy: { sortOrder: "asc" } } },
    });
  }

  async removeSongFile(capsuleId: string) {
    return prisma.capsule.update({
      where: { id: capsuleId },
      data: { songFileUrl: null },
      include: { timelineItems: { orderBy: { sortOrder: "asc" } } },
    });
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    const base = slugify(title);
    let slug = base;
    let attempt = 0;

    // tenta o slug "limpo" primeiro; se colidir, adiciona um sufixo aleatório curto
    while (await prisma.capsule.findUnique({ where: { slug } })) {
      attempt += 1;
      const suffix = Math.random().toString(36).slice(2, 6);
      slug = `${base}-${suffix}`;
      if (attempt > 5) {
        // proteção extra contra loop infinito em caso muito raro
        slug = `${base}-${Date.now().toString(36)}`;
        break;
      }
    }

    return slug;
  }
}

export const capsuleService = new CapsuleService();
