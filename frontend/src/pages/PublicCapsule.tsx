import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicCapsule } from "../services/capsule";
import type { Capsule } from "../types/capsule";
import { ApiError } from "../services/api";

export default function PublicCapsule() {
  const { slug } = useParams<{ slug: string }>();
  const [capsule, setCapsule] = useState<Capsule | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    getPublicCapsule(slug)
      .then(({ capsule }) => setCapsule(capsule))
      .catch((err) => {
        setError(
          err instanceof ApiError && err.status === 404
            ? "Esta cápsula não existe ou ainda não foi paga."
            : "Não foi possível carregar a cápsula."
        );
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#0b0809] text-[#f3ece7] flex items-center justify-center">
        <p className="text-[#bcaea6]">Carregando...</p>
      </main>
    );
  }

  if (error || !capsule) {
    return (
      <main className="min-h-screen bg-[#0b0809] text-[#f3ece7] flex items-center justify-center px-6">
        <p className="text-red-400 text-center">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0809] text-[#f3ece7] px-6 py-16">
      <div className="mx-auto max-w-2xl space-y-10 text-center">
        <div className="space-y-2">
          {capsule.occasion && (
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
              {capsule.occasion}
            </span>
          )}
          <h1 className="text-4xl font-black text-white font-serif">{capsule.title}</h1>
          {capsule.recipientName && (
            <p className="text-[#bcaea6]">Para {capsule.recipientName}</p>
          )}
        </div>

        {capsule.songUrl && (
          <a
            href={capsule.songUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-full border border-rose-900/40 bg-rose-950/20 px-6 py-3 text-sm font-bold text-rose-300 hover:bg-rose-950/40"
          >
            🎵 Ouvir nossa música
          </a>
        )}

        {capsule.timelineItems.length > 0 && (
          <div className="space-y-6 text-left">
            {capsule.timelineItems.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-zinc-900 bg-zinc-950/40 overflow-hidden"
              >
                <img src={item.imageUrl} alt={item.caption} className="w-full" />
                <p className="p-4 text-[#d5c9c1]">{item.caption}</p>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-2xl bg-[#fffcf9] p-6 text-left shadow-xl">
          <p className="whitespace-pre-wrap font-serif text-zinc-900 leading-relaxed">
            {capsule.letter}
          </p>
        </div>
      </div>
    </main>
  );
}
