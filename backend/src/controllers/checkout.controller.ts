import { Request, Response } from "express";
import { checkoutService, CheckoutError } from "../services/checkout.service";
import { verifyAbacateSignature } from "../utils/abacatepay-signature";
import { env } from "../config/env";

export class CheckoutController {
  /**
   * POST /checkout
   * Body: { capsuleId }
   * Cria (ou reaproveita) uma cobrança PIX para a cápsula.
   */
  async create(req: Request, res: Response) {
    const { capsuleId } = req.body;

    try {
      const session = await checkoutService.createForCapsule(capsuleId);
      return res.status(201).json({ checkoutSession: session });
    } catch (error) {
      if (error instanceof CheckoutError) {
        return res.status(error.status).json({ error: error.message });
      }
      throw error;
    }
  }

  /**
   * GET /checkout/:capsuleId
   * Usado pelo front pra fazer polling do status enquanto aguarda o pagamento,
   * como fallback caso o usuário tenha fechado e reaberto a página antes do webhook.
   */
  async getStatus(req: Request, res: Response) {
    const { capsuleId } = req.params;
    const session = await checkoutService.findByCapsuleId(capsuleId);

    if (!session) {
      return res.status(404).json({ error: "Nenhum checkout encontrado para esta cápsula" });
    }

    return res.json({ checkoutSession: session });
  }

  /**
   * POST /webhooks/abacatepay
   *
   * Validação em duas camadas, conforme recomendado pela AbacatePay:
   * 1) webhookSecret na query string (?webhookSecret=...) — configurado por nós
   *    no momento da criação do webhook no dashboard
   * 2) assinatura HMAC no header X-Webhook-Signature — usa uma chave pública
   *    fixa fornecida pela própria AbacatePay (não é nosso secret)
   *
   * IMPORTANTE: este endpoint precisa receber o RAW BODY (string), não o
   * body já parseado pelo express.json(), porque a assinatura é calculada
   * sobre os bytes exatos enviados. Por isso a rota usa express.raw()
   * (ver routes/checkout.ts).
   */
  async handleAbacatePayWebhook(req: Request, res: Response) {
    const webhookSecret = String(req.query.webhookSecret ?? "");

    if (webhookSecret !== env.ABACATEPAY_WEBHOOK_SECRET) {
      return res.status(401).json({ error: "webhookSecret inválido" });
    }

    const signature = req.headers["x-webhook-signature"];
    const rawBody = req.body as Buffer; // graças ao express.raw()

    if (typeof signature !== "string" || !verifyAbacateSignature(rawBody.toString("utf8"), signature)) {
      return res.status(401).json({ error: "Assinatura inválida" });
    }

    const payload = JSON.parse(rawBody.toString("utf8"));

    // Conforme a doc da AbacatePay: não validamos o payload inteiro com Zod
    // (eles avisam explicitamente que o formato pode evoluir); só lemos
    // os campos que realmente precisamos, com checagens defensivas.
    const event = payload?.event as string | undefined;
    const transparent = payload?.data?.transparent;

    if (event === "transparent.completed" && transparent?.status === "PAID") {
      const checkoutSessionId = transparent.externalId as string | undefined;

      if (!checkoutSessionId) {
        // Não deveria acontecer, já que sempre enviamos externalId na criação,
        // mas registramos e respondemos 200 mesmo assim pra AbacatePay não retentar.
        console.error("Webhook transparent.completed sem externalId", payload);
        return res.status(200).json({ received: true });
      }

      try {
        await checkoutService.confirmPayment(checkoutSessionId);
      } catch (error) {
        console.error("Erro ao confirmar pagamento via webhook", error);
        // Mesmo em erro interno, evitamos devolver 5xx por padrão pra não
        // entrar num loop de retentativa indefinida — ajuste esse comportamento
        // conforme sua estratégia de monitoramento/alertas.
      }
    }

    // Outros eventos (refund, dispute, etc.) podem ser tratados aqui no futuro.
    return res.status(200).json({ received: true });
  }
}

export const checkoutController = new CheckoutController();
