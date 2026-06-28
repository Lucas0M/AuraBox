import { useEffect, useState, FormEvent } from "react";
import { useParams } from "react-router-dom";
import { getCapsuleForManagement, addTimelineItem } from "../services/capsule";
import { getEditToken } from "../hooks/useEditToken";
import type { Capsule } from "../types/capsule";
import { ApiError } from "../services/api";

export default function ManageCapsule() {
  const { id: capsuleId } = useParams<{ id: string }>();
  const [capsule, setCapsule] = useState<Capsule | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const editToken = capsuleId ? getEditToken(capsuleId) : null;

  async function loadCapsule() {
    if (!capsuleId || !editToken) return;
    try {
      const { capsule } = await getCapsuleForManagement(capsuleId, editToken);
      setCapsule(capsule);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível carregar a cápsula."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCapsule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capsuleId]);

  async function handleAddPhoto(e: FormEvent) {
    e.preventDefault();
    if (!file || !caption || !capsuleId || !editToken) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      await addTimelineItem(capsuleId, editToken, file, caption);
      setFile(null);
      setCaption("");
      await loadCapsule(); // recarrega pra mostrar a foto recém-adicionada
    } catch (err) {
      setUploadError(
        err instanceof ApiError ? err.message : "Não foi possível enviar a imagem."
      );
    } finally {
      setIsUploading(false);
    }
  }

  if (!editToken) {
    return (
      <main className="min-h-screen bg-[#0b0809] text-[#f3ece7] flex items-center justify-center px-6">
        <p className="text-red-400 text-center max-w-md">
          Não encontramos sua credencial de acesso a essa cápsula neste navegador.
          Você precisa estar no mesmo dispositivo/navegador usado na criação.
        </p>
      </main>
    );
  }

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

  const publicUrl = `${window.location.origin}/c/${capsule.slug}`;

  return (
    <main className="min-h-screen bg-[#0b0809] text-[#f3ece7] px-6 py-12">
      <div className="mx-auto max-w-xl space-y-8">
        <div>
          <h1 className="text-3xl font-black text-white font-serif mb-1">{capsule.title}</h1>
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
              capsule.status === "ACTIVE"
                ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/40"
                : "bg-amber-950/40 text-amber-400 border border-amber-900/40"
            }`}
          >
            {capsule.status === "ACTIVE" ? "Ativa" : capsule.status}
          </span>
        </div>

        {capsule.status === "ACTIVE" && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <p className="text-sm text-[#bcaea6] mb-2">Link público da sua cápsula:</p>
            <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="text-rose-400 font-bold break-all hover:underline"
            >
              {publicUrl}
            </a>
          </div>
        )}

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white font-serif">Fotos da linha do tempo</h2>

          <div className="grid grid-cols-2 gap-4">
            {capsule.timelineItems.map((item) => (
              <div key={item.id} className="rounded-lg overflow-hidden border border-zinc-800">
                <img src={item.imageUrl} alt={item.caption} className="w-full aspect-square object-cover" />
                <p className="p-2 text-xs text-[#bcaea6] truncate">{item.caption}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddPhoto} className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-zinc-400"
            />
            <input
              type="text"
              placeholder="Legenda da foto"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={280}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-white placeholder:text-zinc-600 focus:border-rose-600 focus:outline-none"
            />
            {uploadError && <p className="text-sm text-red-400">{uploadError}</p>}
            <button
              type="submit"
              disabled={!file || !caption || isUploading}
              className="rounded-full bg-rose-600 px-6 py-2 text-sm font-bold text-white hover:bg-rose-500 disabled:opacity-50"
            >
              {isUploading ? "Enviando..." : "Adicionar foto"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
