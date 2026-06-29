import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicCapsule } from "../services/capsule";
import type { Capsule } from "../types/capsule";
import { ApiError } from "../services/api";
import MusicPlayer from "../components/MusicPlayer";
import AudioPlayer from "../components/AudioPlayer";
import PhotoCarousel from "../components/PhotoCarousel";
import LetterModal from "../components/LetterModal";

export default function PublicCapsule() {
  const { slug } = useParams<{ slug: string }>();
  const [capsule, setCapsule] = useState<Capsule | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLetterOpen, setIsLetterOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;

    getPublicCapsule(slug)
      .then(({ capsule }) => setCapsule(capsule))
      .catch((err) => {
        setError(
          err instanceof ApiError && err.status === 404
            ? "Esta cápsula não existe ou ainda não foi paga."
            : "Não foi possível carregar a cápsula.",
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
          <h1 className="text-4xl font-black text-white font-serif">
            {capsule.title}
          </h1>
          {capsule.recipientName && (
            <p className="text-[#bcaea6]">Para {capsule.recipientName}</p>
          )}
        </div>

        {capsule.songFileUrl ? (
          <div className="max-w-sm mx-auto">
            <AudioPlayer src={capsule.songFileUrl} autoPlayOnFirstInteraction />
          </div>
        ) : capsule.songUrl ? (
          <div className="max-w-sm mx-auto">
            <MusicPlayer songUrl={capsule.songUrl} />
          </div>
        ) : null}

        {capsule.timelineItems.length > 0 && (
          <PhotoCarousel items={capsule.timelineItems} />
        )}

        <div className="space-y-4">
          <div
            onClick={() => setIsLetterOpen(true)}
            className="cursor-pointer rounded-2xl bg-[#fffcf9] p-6 text-left shadow-xl transition hover:shadow-2xl hover:scale-[1.005]"
          >
            <p className="whitespace-pre-wrap font-serif text-zinc-900 leading-relaxed line-clamp-4">
              {capsule.letter}
            </p>
          </div>

          <button
            onClick={() => setIsLetterOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-rose-900/40 bg-rose-950/20 px-6 py-2.5 text-sm font-bold text-rose-300 hover:bg-rose-950/40 transition"
          >
            Expandir
            <span aria-hidden>↗</span>
          </button>
        </div>

        <LetterModal
          isOpen={isLetterOpen}
          onClose={() => setIsLetterOpen(false)}
          letter={capsule.letter}
        />
      </div>
    </main>
  );
}
