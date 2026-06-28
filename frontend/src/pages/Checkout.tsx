import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createCheckout, getCheckoutStatus } from "../services/checkout";
import { getEditToken } from "../hooks/useEditToken";
import type { CheckoutSession } from "../types/capsule";
import { ApiError } from "../services/api";

const POLLING_INTERVAL_MS = 4000;

export default function Checkout() {
  const { id: capsuleId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // guardamos o id do interval pra poder cancelar no cleanup do effect
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!capsuleId) return;

    let isMounted = true;

    async function bootstrap() {
      try {
        const { checkoutSession } = await createCheckout(capsuleId!);
        if (isMounted) setSession(checkoutSession);

        if (checkoutSession.status === "PAID") {
          navigate(`/capsulas/${capsuleId}/gerenciar`);
          return;
        }

        // Faz polling consultando o status — é o fallback caso o webhook
        // já tenha confirmado o pagamento mas a página ainda não saiba.
        pollingRef.current = setInterval(async () => {
          try {
            const { checkoutSession: updated } = await getCheckoutStatus(capsuleId!);
            if (!isMounted) return;

            setSession(updated);

            if (updated.status === "PAID") {
              stopPolling();
              navigate(`/capsulas/${capsuleId}/gerenciar`);
            }

            if (updated.status === "EXPIRED" || updated.status === "CANCELED") {
              stopPolling();
            }
          } catch {
            // erro de rede pontual no polling não deve travar a tela —
            // só tentamos de novo no próximo intervalo
          }
        }, POLLING_INTERVAL_MS);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof ApiError ? err.message : "Não foi possível gerar o pagamento.");
      }
    }

    bootstrap();

    return () => {
      isMounted = false;
      stopPolling();
    };
  }, [capsuleId, navigate, stopPolling]);

  function handleCopyPix() {
    if (!session?.pixCopyPaste) return;
    navigator.clipboard.writeText(session.pixCopyPaste);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#0b0809] text-[#f3ece7] px-6 py-12 flex items-center justify-center">
        <div className="max-w-md text-center space-y-4">
          <p className="text-red-400 font-medium">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="rounded-full border border-zinc-800 px-6 py-3 text-zinc-300 hover:bg-zinc-800/60"
          >
            Voltar ao início
          </button>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-[#0b0809] text-[#f3ece7] px-6 py-12 flex items-center justify-center">
        <p className="text-[#bcaea6]">Gerando seu PIX...</p>
      </main>
    );
  }

  const amountInReais = (session.amount / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <main className="min-h-screen bg-[#0b0809] text-[#f3ece7] px-6 py-12">
      <div className="mx-auto max-w-md text-center space-y-6">
        <h1 className="text-2xl font-black text-white font-serif">
          Pague com PIX para ativar sua cápsula
        </h1>
        <p className="text-[#bcaea6]">
          Valor: <span className="font-bold text-rose-300">{amountInReais}</span>
        </p>

        {session.status === "PAID" ? (
          <p className="text-emerald-400 font-bold">Pagamento confirmado! Redirecionando...</p>
        ) : session.status === "EXPIRED" ? (
          <p className="text-red-400 font-medium">
            Esse PIX expirou. Recarregue a página para gerar um novo.
          </p>
        ) : (
          <>
            {session.pixQrCode && (
              <img
                src={session.pixQrCode}
                alt="QR Code do PIX"
                className="mx-auto rounded-xl border border-zinc-800"
              />
            )}

            {session.pixCopyPaste && (
              <div className="space-y-2">
                <textarea
                  readOnly
                  value={session.pixCopyPaste}
                  rows={3}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-xs text-zinc-400"
                />
                <button
                  onClick={handleCopyPix}
                  className="rounded-full border border-zinc-800 px-6 py-2 text-sm font-bold text-zinc-300 hover:bg-zinc-800/60"
                >
                  {copied ? "Copiado!" : "Copiar código PIX"}
                </button>
              </div>
            )}

            <p className="text-sm text-zinc-500">
              Aguardando confirmação do pagamento — isso costuma levar só alguns segundos após o PIX ser feito.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
