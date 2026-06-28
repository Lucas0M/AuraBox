import { env } from "../config/env";

const ABACATEPAY_BASE_URL = "https://api.abacatepay.com/v2";

interface CreatePixChargeInput {
  amount: number; // em centavos
  description: string;
  externalId: string; // usamos o id do nosso CheckoutSession aqui
  expiresIn?: number; // segundos até a expiração do PIX
  metadata?: Record<string, unknown>;
}

interface AbacatePixCharge {
  id: string;
  amount: number;
  status: "PENDING" | "EXPIRED" | "CANCELLED" | "PAID" | "REFUNDED" | string;
  devMode: boolean;
  brCode: string;
  brCodeBase64: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

interface AbacatePayEnvelope<T> {
  data: T | null;
  success: boolean;
  error: string | null;
}

class AbacatePayError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "AbacatePayError";
  }
}

async function abacatepayFetch<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${ABACATEPAY_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.ABACATEPAY_API_KEY}`,
      ...init.headers,
    },
  });

  const body = (await response.json()) as AbacatePayEnvelope<T>;

  if (!response.ok || !body.success || !body.data) {
    throw new AbacatePayError(
      body.error ?? `Erro ao chamar AbacatePay (status ${response.status})`,
      response.status
    );
  }

  return body.data;
}

/**
 * Cria uma cobrança PIX via Checkout Transparente.
 * O usuário paga sem saber sair do nosso site (QR code + copia-e-cola).
 */
export async function createPixCharge(
  input: CreatePixChargeInput
): Promise<AbacatePixCharge> {
  return abacatepayFetch<AbacatePixCharge>("/transparents/create", {
    method: "POST",
    body: JSON.stringify({
      method: "PIX",
      data: {
        amount: input.amount,
        description: input.description,
        externalId: input.externalId,
        expiresIn: input.expiresIn,
        metadata: input.metadata,
      },
    }),
  });
}

export { AbacatePayError };
