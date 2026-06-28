import { Request, Response } from "express";
import { capsuleService } from "../services/capsule.service";
import { uploadService } from "../services/upload.service";

export class CapsulesController {
  /**
   * POST /capsules
   * Cria a cápsula em DRAFT. Retorna o editToken — o front DEVE
   * salvar isso localmente, pois é a única vez que ele vem na resposta.
   */
  async create(req: Request, res: Response) {
    const capsule = await capsuleService.create(req.body);

    return res.status(201).json({
      capsule,
      editToken: capsule.editToken,
      warning:
        "Guarde o editToken em local seguro — ele é necessário para editar a cápsula e não será mostrado novamente.",
    });
  }

  /**
   * GET /capsules/:slug
   * Visualização pública — só retorna se status === ACTIVE.
   */
  async getPublicBySlug(req: Request, res: Response) {
    const { slug } = req.params;
    const capsule = await capsuleService.findPublicBySlug(slug);

    if (!capsule) {
      return res.status(404).json({ error: "Cápsula não encontrada ou ainda não está ativa" });
    }

    return res.json({ capsule });
  }

  /**
   * GET /capsules/:id/manage
   * Visualização para o dono (qualquer status), autenticado via editToken.
   * O middleware requireEditToken já validou e populou req.capsule.
   */
  async getForManagement(req: Request, res: Response) {
    const { id } = req.params;
    const capsule = await capsuleService.findById(id);

    if (!capsule) {
      return res.status(404).json({ error: "Cápsula não encontrada" });
    }

    return res.json({ capsule });
  }

  /**
   * PATCH /capsules/:id
   * Edição autenticada via editToken (middleware requireEditToken).
   */
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const capsule = await capsuleService.update(id, req.body);
    return res.json({ capsule });
  }

  /**
   * DELETE /capsules/:id
   */
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await capsuleService.delete(id);
    return res.status(204).send();
  }

  /**
   * POST /capsules/:id/timeline-items
   * Upload de imagem (multipart/form-data, campo "image") + legenda.
   */
  async addTimelineItem(req: Request, res: Response) {
    const { id } = req.params;
    const { caption, sortOrder } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Nenhuma imagem foi enviada" });
    }

    if (!caption || typeof caption !== "string") {
      return res.status(400).json({ error: "A legenda (caption) é obrigatória" });
    }

    const imageUrl = await uploadService.uploadImage(req.file.buffer, req.file.mimetype);

    const item = await capsuleService.addTimelineItem(id, {
      imageUrl,
      caption,
      sortOrder: sortOrder ? Number(sortOrder) : undefined,
    });

    return res.status(201).json({ item });
  }

  /**
   * DELETE /capsules/:id/timeline-items/:itemId
   */
  async removeTimelineItem(req: Request, res: Response) {
    const { id, itemId } = req.params;
    await capsuleService.removeTimelineItem(id, itemId);
    return res.status(204).send();
  }

  /**
   * POST /capsules/:id/song
   * Upload de arquivo de áudio próprio (multipart/form-data, campo "audio").
   * Substitui qualquer songUrl (Spotify/YouTube) existente — são exclusivos.
   */
  async uploadSong(req: Request, res: Response) {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo de áudio foi enviado" });
    }

    const songFileUrl = await uploadService.uploadAudio(req.file.buffer, req.file.mimetype);
    const capsule = await capsuleService.setSongFile(id, songFileUrl);

    return res.status(201).json({ capsule });
  }

  /**
   * DELETE /capsules/:id/song
   * Remove o arquivo de áudio próprio da cápsula (mantém songUrl, se houver).
   */
  async removeSong(req: Request, res: Response) {
    const { id } = req.params;
    const capsule = await capsuleService.removeSongFile(id);
    return res.json({ capsule });
  }
}

export const capsulesController = new CapsulesController();
