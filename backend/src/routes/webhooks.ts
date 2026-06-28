import { Router, raw } from "express";
import { checkoutController } from "../controllers/checkout.controller";
import { asyncHandler } from "../utils/async-handler";

const router = Router();

/**
 * Webhook da AbacatePay.
 *
 * ATENÇÃO: usa raw() em vez do express.json() global, porque a validação
 * de assinatura HMAC precisa dos bytes exatos do corpo da requisição.
 * Se o body já tivesse passado por JSON.parse + re-serialização, a
 * assinatura calculada não bateria com a enviada pela AbacatePay.
 *
 * Por isso esta rota é registrada em app.ts ANTES do express.json() global.
 */
router.post(
  "/abacatepay",
  raw({ type: "application/json" }),
  asyncHandler((req, res) => checkoutController.handleAbacatePayWebhook(req, res))
);

export default router;
