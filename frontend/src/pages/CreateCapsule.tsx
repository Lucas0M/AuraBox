import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createCapsule } from "../services/capsule";
import { saveEditToken } from "../hooks/useEditToken";
import { ApiError } from "../services/api";

export default function CreateCapsule() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [occasion, setOccasion] = useState("");
  const [songUrl, setSongUrl] = useState("");
  const [letter, setLetter] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { capsule, editToken } = await createCapsule({
        title,
        recipientName: recipientName || undefined,
        occasion: occasion || undefined,
        songUrl: songUrl || undefined,
        letter,
      });

      // Guarda o editToken AGORA — é a única vez que o backend o envia.
      // Sem isso, o usuário perde a capacidade de editar/pagar essa cápsula.
      saveEditToken(capsule.id, editToken);

      navigate(`/capsulas/${capsule.id}/checkout`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Algo deu errado ao criar sua cápsula. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0809] text-[#f3ece7] px-6 py-12">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-black text-white font-serif mb-2">
          Crie sua cápsula
        </h1>
        <p className="text-[#bcaea6] mb-8">
          Preencha os detalhes abaixo. Você poderá adicionar fotos depois do pagamento.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-bold text-rose-300 mb-1">
              Título da cápsula *
            </label>
            <input
              id="title"
              required
              maxLength={120}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Para minha namorada"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-white placeholder:text-zinc-600 focus:border-rose-600 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="recipientName" className="block text-sm font-bold text-rose-300 mb-1">
              Nome de quem vai receber
            </label>
            <input
              id="recipientName"
              maxLength={120}
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Ex: Maria"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-white placeholder:text-zinc-600 focus:border-rose-600 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="occasion" className="block text-sm font-bold text-rose-300 mb-1">
              Ocasião
            </label>
            <input
              id="occasion"
              maxLength={120}
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              placeholder="Ex: Aniversário de namoro"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-white placeholder:text-zinc-600 focus:border-rose-600 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="songUrl" className="block text-sm font-bold text-rose-300 mb-1">
              Link da música (Spotify ou YouTube)
            </label>
            <input
              id="songUrl"
              type="url"
              value={songUrl}
              onChange={(e) => setSongUrl(e.target.value)}
              placeholder="https://open.spotify.com/track/..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-white placeholder:text-zinc-600 focus:border-rose-600 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="letter" className="block text-sm font-bold text-rose-300 mb-1">
              Sua carta *
            </label>
            <textarea
              id="letter"
              required
              maxLength={5000}
              rows={6}
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
              placeholder="Escreva o que você quer dizer..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-white placeholder:text-zinc-600 focus:border-rose-600 focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-gradient-to-r from-rose-600 to-rose-500 px-10 py-4 text-lg font-bold text-white shadow-lg shadow-rose-600/30 transition hover:from-rose-500 hover:to-rose-400 disabled:opacity-50"
          >
            {isSubmitting ? "Criando..." : "Continuar para o pagamento"}
          </button>
        </form>
      </div>
    </main>
  );
}
