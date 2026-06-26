import type { Request, Response } from "express";
import { capsulesService } from "../services/capsules.service.js";

export async function listCapsulesController(
  _request: Request,
  response: Response,
) {
  const capsules = await capsulesService.listCapsules();
  response.json({ data: capsules });
}

export async function getCapsuleBySlugController(
  request: Request,
  response: Response,
) {
  const { slug } = request.params;

  if (typeof slug !== "string") {
    response.status(400).json({ error: "Invalid slug" });
    return;
  }

  const capsule = await capsulesService.getCapsuleBySlug(slug);

  if (!capsule) {
    response.status(404).json({ error: "Capsule not found" });
    return;
  }

  response.json({ data: capsule });
}

export async function createCapsuleController(
  request: Request,
  response: Response,
) {
  const {
    title,
    slug,
    recipientName,
    occasion,
    songUrl,
    letter,
    timelineItems,
  } = request.body ?? {};

  const capsule = await capsulesService.createCapsule({
    title,
    slug,
    recipientName,
    occasion,
    songUrl,
    letter,
    timelineItems,
  });

  response.status(201).json({ data: capsule });
}

export const createDraftCapsuleController = createCapsuleController;
