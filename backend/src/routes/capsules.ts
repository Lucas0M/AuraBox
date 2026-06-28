import { Router } from "express";
import { capsulesController } from "../controllers/capsules.controller";
import { validateBody } from "../middlewares/validate.middleware";
import { requireEditToken } from "../middlewares/edit-token.middleware";
import { upload, uploadAudio } from "../middlewares/upload.middleware";
import { createCapsuleSchema, updateCapsuleSchema } from "../validators/capsule.validator";
import { asyncHandler } from "../utils/async-handler";

const router = Router();

// Pública: cria a cápsula em DRAFT (qualquer pessoa pode criar, sem login)
router.post(
  "/",
  validateBody(createCapsuleSchema),
  asyncHandler((req, res) => capsulesController.create(req, res))
);

// Pública: visualização da cápsula paga (link que vai pro presenteado)
router.get(
  "/public/:slug",
  asyncHandler((req, res) => capsulesController.getPublicBySlug(req, res))
);

// A partir daqui, todas as rotas exigem o editToken (dono da cápsula)
router.get(
  "/:id/manage",
  asyncHandler(requireEditToken),
  asyncHandler((req, res) => capsulesController.getForManagement(req, res))
);

router.patch(
  "/:id",
  asyncHandler(requireEditToken),
  validateBody(updateCapsuleSchema),
  asyncHandler((req, res) => capsulesController.update(req, res))
);

router.delete(
  "/:id",
  asyncHandler(requireEditToken),
  asyncHandler((req, res) => capsulesController.delete(req, res))
);

router.post(
  "/:id/timeline-items",
  asyncHandler(requireEditToken),
  upload.single("image"),
  asyncHandler((req, res) => capsulesController.addTimelineItem(req, res))
);

router.delete(
  "/:id/timeline-items/:itemId",
  asyncHandler(requireEditToken),
  asyncHandler((req, res) => capsulesController.removeTimelineItem(req, res))
);

router.post(
  "/:id/song",
  asyncHandler(requireEditToken),
  uploadAudio.single("audio"),
  asyncHandler((req, res) => capsulesController.uploadSong(req, res))
);

router.delete(
  "/:id/song",
  asyncHandler(requireEditToken),
  asyncHandler((req, res) => capsulesController.removeSong(req, res))
);

export default router;
