import { useEffect, useState, FormEvent } from "react";
import { useParams } from "react-router-dom";
import {
  getCapsuleForManagement,
  addTimelineItem,
  uploadSong,
  removeSong,
  updateCapsule,
} from "../services/capsule";
import { getEditToken } from "../hooks/useEditToken";
import type { Capsule } from "../types/capsule";
import { ApiError } from "../services/api";
import AudioPlayer from "../components/AudioPlayer";
import CapsuleQrCode from "../components/CapsuleQrCode";

export default function ManageCapsule() {
  const { id: capsuleId } = useParams<{ id: string }>();
  const [capsule, setCapsule] = useState<Capsule | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [songMode, setSongMode] = useState<"link" | "upload">("link");
  const [songUrlInput, setSongUrlInput] = useState("");
  const [songFile, setSongFile] = useState<File | null>(null);
  const [isSavingSong, setIsSavingSong] = useState(false);
  const [songError, setSongError] = useState<string | null>(null);

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

  async function handleSaveSong(e: FormEvent) {
    e.preventDefault();
    if (!capsuleId || !editToken) return;

    setIsSavingSong(true);
    setSongError(null);

    try {
      if (songMode === "upload" && songFile) {
        await uploadSong(capsuleId, editToken, songFile);
        setSongFile(null);
      } else if (songMode === "link" && songUrlInput) {
        await updateCapsule(capsuleId, editToken, { songUrl: songUrlInput });
        setSongUrlInput("");
      }
      await loadCapsule();
    } catch (err) {
      setSongError(
        err instanceof ApiError ? err.message : "Não foi possível salvar a música."
      );
    } finally {
      setIsSavingSong(false);
    }
  }

  async function handleRemoveSong() {
    if (!capsuleId || !editToken) return;
    setIsSavingSong(true);
    try {
      await removeSong(capsuleId, editToken);
      await loadCapsule();
    } catch (err) {
      setSongError(
        err instanceof ApiError ? err.message : "Não foi possível remover a música."
      );
    } finally {
      setIsSavingSong(false);
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
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-4">
            <div>
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

            <div>
              <p className="text-sm text-[#bcaea6] mb-2">
                Ou escaneie o QR Code para abrir direto no celular:
              </p>
              <CapsuleQrCode url={publicUrl} />
            </div>
          </div>
        )}

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white font-serif">Música</h2>

          {capsule.songFileUrl ? (
            <div className="space-y-3">
              <AudioPlayer src={capsule.songFileUrl} />
              <button
                onClick={handleRemoveSong}
                disabled={isSavingSong}
                className="text-sm text-red-400 hover:underline disabled:opacity-50"
              >
                Remover música
              </button>
            </div>
          ) : capsule.songUrl ? (
            <div className="space-y-3">
              <p className="text-sm text-[#bcaea6] break-all">{capsule.songUrl}</p>
              <button
                onClick={handleRemoveSong}
                disabled={isSavingSong}
                className="text-sm text-red-400 hover:underline disabled:opacity-50"
              >
                Remover música
              </button>
            </div>
          ) : (
            <p className="text-sm text-zinc-500">Nenhuma música adicionada ainda.</p>
          )}

          <form
            onSubmit={handleSaveSong}
            className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"
          >
            <div className="flex gap-4 text-sm">
              <label className="flex items-center gap-2 text-[#bcaea6]">
                <input
                  type="radio"
                  name="songMode"
                  checked={songMode === "link"}
                  onChange={() => setSongMode("link")}
                />
                Link (Spotify/YouTube)
              </label>
              <label className="flex items-center gap-2 text-[#bcaea6]">
                <input
                  type="radio"
                  name="songMode"
                  checked={songMode === "upload"}
                  onChange={() => setSongMode("upload")}
                />
                Enviar mp3 próprio
              </label>
            </div>

            {songMode === "link" ? (
              <input
                type="url"
                placeholder="https://open.spotify.com/track/..."
                value={songUrlInput}
                onChange={(e) => setSongUrlInput(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-white placeholder:text-zinc-600 focus:border-rose-600 focus:outline-none"
              />
            ) : (
              <input
                type="file"
                accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg"
                onChange={(e) => setSongFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-zinc-400"
              />
            )}

            {songError && <p className="text-sm text-red-400">{songError}</p>}

            <button
              type="submit"
              disabled={
                isSavingSong ||
                (songMode === "link" ? !songUrlInput : !songFile)
              }
              className="rounded-full bg-rose-600 px-6 py-2 text-sm font-bold text-white hover:bg-rose-500 disabled:opacity-50"
            >
              {isSavingSong ? "Salvando..." : "Salvar música"}
            </button>
          </form>
        </section>

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
