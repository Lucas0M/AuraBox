import { Router } from "express";
import { createCheckoutSessionController } from "../controllers/checkout.controller.js";

export const checkoutRouter = Router();

checkoutRouter.post("/sessions", createCheckoutSessionController);
