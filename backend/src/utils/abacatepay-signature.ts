import crypto from "node:crypto";

// Chave pública fornecida pela própria documentação da AbacatePay para
// validação de HMAC dos webhooks. NÃO é um secret nosso — é fixa e pública,
// por isso pode ficar hardcoded no código (não precisa ir no .env).
// Fonte: https://docs.abacatepay.com/pages/webhooks
const ABACATEPAY_PUBLIC_HMAC_KEY =
  "t9dXRhHHo3yDEj5pVDYz0frf7q6bMKyMRmxxCPIPp3RCplBfXRxqlC6ZpiWmOqj4L63qEaeUOtrCI8P0VMUgo6iIga2ri9ogaHFs0WIIywSMg0q7RmBfybe1E5XJcfC4IW3alNqym0tXoAKkzvfEjZxV6bE0oG2zJrNNYmUCKZyV0KZ3JS8Votf9EAWWYdiDkMkpbMdPggfh1EqHlVkMiTady6jOR3hyzGEHrIz2Ret0xHKMbiqkr9HS1JhNHDX9";

/**
 * Verifica se a assinatura HMAC enviada no header X-Webhook-Signature
 * corresponde ao corpo (raw) recebido. Usa comparação em tempo constante
 * para evitar timing attacks.
 */
export function verifyAbacateSignature(rawBody: string, signatureFromHeader: string): boolean {
  const bodyBuffer = Buffer.from(rawBody, "utf8");

  const expectedSig = crypto
    .createHmac("sha256", ABACATEPAY_PUBLIC_HMAC_KEY)
    .update(bodyBuffer)
    .digest("base64");

  const a = Buffer.from(expectedSig);
  const b = Buffer.from(signatureFromHeader);

  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
