import type { Request, Response } from "express";
import { capsulesService } from "../services/capsules.service.js";

export async function createCheckoutSessionController(
  request: Request,
  response: Response,
) {
  const { capsuleId } = request.body ?? {};

  if (typeof capsuleId !== "string" || capsuleId.trim().length === 0) {
    response.status(400).json({ error: "capsuleId is required" });
    return;
  }

  const session = await capsulesService.createCheckoutSession(capsuleId);

  response.status(201).json({ data: session });
}
