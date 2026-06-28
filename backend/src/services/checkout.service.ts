import { prisma } from "../lib/prisma";
import { createPixCharge } from "../lib/abacatepay";
import { sendManageLinkEmail } from "./email.service";
import { env } from "../config/env";
import type { CheckoutSession } from "@prisma/client";

// Preço fixo da cápsula. Coloquei aqui como constante por simplicidade do MVP;
// se um dia você tiver planos diferentes, isso deve virar um campo de produto no banco.
const CAPSULE_PRICE_IN_CENTS = 2990; // R$ 29,90

// PIX expira em 1h por padrão — dá tempo da pessoa terminar de pagar sem
// deixar cobranças "zumbis" abertas por dias.
const PIX_EXPIRATION_SECONDS = 60 * 60;

// Lock em memória por capsuleId: serializa chamadas concorrentes de
// createForCapsule() para a MESMA cápsula, evitando que duas requisições
// quase simultâneas (ex: o React StrictMode disparando o efeito duas
// vezes em desenvolvimento, ou um duplo clique do usuário) cheguem a
// chamar a AbacatePay e escrever no banco em paralelo. Funciona porque
// o Node executa o código JS de forma single-threaded — não é um lock
// distribuído (não protege contra múltiplas instâncias do servidor em
// produção), mas resolve o caso real de concorrência dentro de um
// processo, que é a origem de todos os bugs P2025/P2002 que já vimos.
const inFlightRequests = new Map<string, Promise<CheckoutSession>>();

export class CheckoutService {
  /**
   * Cria uma cobrança PIX para a cápsula e abre o CheckoutSession correspondente.
   * Se já existir uma sessão PENDING ainda válida (não expirada), reaproveita
   * o mesmo QR code em vez de gerar um PIX novo a cada clique no botão de pagar.
   */
  async createForCapsule(capsuleId: string): Promise<CheckoutSession> {
    // Se já existe uma chamada em andamento para essa mesma cápsula,
    // aguarda ela terminar e retorna o mesmo resultado, em vez de
    // disparar uma segunda chamada concorrente.
    const existing = inFlightRequests.get(capsuleId);
    if (existing) {
      return existing;
    }

    const promise = this.doCreateForCapsule(capsuleId).finally(() => {
      inFlightRequests.delete(capsuleId);
    });

    inFlightRequests.set(capsuleId, promise);
    return promise;
  }

  private async doCreateForCapsule(capsuleId: string) {
    const capsule = await prisma.capsule.findUnique({
      where: { id: capsuleId },
      include: { checkoutSession: true },
    });

    if (!capsule) {
      throw new CheckoutError("Cápsula não encontrada", 404);
    }

    if (capsule.status === "ACTIVE") {
      throw new CheckoutError("Esta cápsula já está paga e ativa", 409);
    }

    if (
      capsule.checkoutSession &&
      capsule.checkoutSession.status === "PENDING" &&
      capsule.checkoutSession.expiresAt &&
      capsule.checkoutSession.expiresAt > new Date()
    ) {
      // Reaproveita a sessão pendente (ainda válida) em vez de gerar
      // um novo PIX a cada clique no botão de pagar
      return capsule.checkoutSession;
    }

    if (capsule.checkoutSession && capsule.checkoutSession.status === "PENDING") {
      // Sessão antiga expirou (ou nunca teve expiresAt definido por falha anterior) —
      // removemos pra não deixar lixo no banco antes de criar a nova.
      await prisma.checkoutSession.deleteMany({ where: { id: capsule.checkoutSession.id } });
    }

    // Graças ao lock acima, não há mais concorrência real chegando aqui
    // para o mesmo capsuleId — mas mantemos o create simples e direto,
    // já que o cenário de corrida foi eliminado na entrada do método.
    const session = await prisma.checkoutSession.create({
      data: {
        capsuleId,
        provider: "abacatepay",
        status: "PENDING",
        amount: CAPSULE_PRICE_IN_CENTS,
        currency: "BRL",
      },
    });

    try {
      const charge = await createPixCharge({
        amount: CAPSULE_PRICE_IN_CENTS,
        description: `Cápsula do Tempo: ${capsule.title}`,
        externalId: session.id,
        expiresIn: PIX_EXPIRATION_SECONDS,
        metadata: { capsuleId },
      });

      const updatedSession = await prisma.checkoutSession.update({
        where: { id: session.id },
        data: {
          providerChargeId: charge.id,
          pixQrCode: charge.brCodeBase64,
          pixCopyPaste: charge.brCode,
          expiresAt: new Date(charge.expiresAt),
        },
      });

      await prisma.capsule.update({
        where: { id: capsuleId },
        data: { status: "PENDING_PAYMENT" },
      });

      return updatedSession;
    } catch (error) {
      // Loga o erro ORIGINAL (provavelmente da AbacatePay) antes de
      // qualquer outra coisa — sem isso, um erro no delete abaixo mascara
      // a causa raiz real, que é o que importa pra debugar.
      console.error("Falha ao criar cobrança PIX na AbacatePay:", error);

      // Se a AbacatePay falhar, não deixamos uma sessão "fantasma" no banco.
      await prisma.checkoutSession.deleteMany({ where: { id: session.id } });

      throw error;
    }
  }

  async findByCapsuleId(capsuleId: string) {
    return prisma.checkoutSession.findUnique({ where: { capsuleId } });
  }

  /**
   * Chamado pelo webhook quando a AbacatePay confirma o pagamento.
   * Idempotente: se a sessão já estiver PAID, não faz nada (evita
   * processar o mesmo evento duas vezes em caso de retentativa do webhook).
   */
  async confirmPayment(checkoutSessionId: string) {
    const session = await prisma.checkoutSession.findUnique({
      where: { id: checkoutSessionId },
    });

    if (!session) {
      throw new CheckoutError("CheckoutSession não encontrada para o externalId recebido", 404);
    }

    if (session.status === "PAID") {
      return session; // já processado, idempotência
    }

    const [updatedSession, updatedCapsule] = await prisma.$transaction([
      prisma.checkoutSession.update({
        where: { id: checkoutSessionId },
        data: { status: "PAID", paidAt: new Date() },
      }),
      prisma.capsule.update({
        where: { id: session.capsuleId },
        data: { status: "ACTIVE" },
      }),
    ]);

    // Dispara o e-mail de recovery (link de gerenciamento), só se o
    // criador informou um e-mail na criação. Não usamos await aqui de
    // forma bloqueante no fluxo principal — disparamos e seguimos, já
    // que uma falha de e-mail não deve impedir a confirmação do pagamento
    // (que já está persistida nesse ponto). O próprio sendManageLinkEmail
    // já loga internamente qualquer erro, sem lançar.
    if (updatedCapsule.creatorEmail) {
      const manageUrl = `${env.FRONTEND_URL}/capsulas/${updatedCapsule.id}/gerenciar`;
      void sendManageLinkEmail({
        to: updatedCapsule.creatorEmail,
        capsuleTitle: updatedCapsule.title,
        manageUrl,
      });
    }

    return updatedSession;
  }
}

export class CheckoutError extends Error {
  constructor(message: string, public status: number = 400) {
    super(message);
    this.name = "CheckoutError";
  }
}

export const checkoutService = new CheckoutService();
