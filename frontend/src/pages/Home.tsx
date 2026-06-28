import { Link } from "react-router-dom";

const reviews = [
  {
    quote:
      "A página transmite muita confiança. Criei para o aniversário da minha mãe e a família inteira chorou assistindo.",
    author: "Marina S.",
    tag: "Aniversário",
    score: "5.0",
  },
  {
    quote:
      "Surpreendi meu namorado com as nossas fotos antigas e a nossa música favorita. O efeito da cartinha digitando é incrível!",
    author: "Lucas M.",
    tag: "Romântico",
    score: "5.0",
  },
  {
    quote:
      "Simplesmente genial. Muito melhor do que dar um presente clichê de shopping. Entrega na hora e super emocionante.",
    author: "Ana P.",
    tag: "Família",
    score: "4.9",
  },
  {
    quote:
      "O processo de criar é muito rápido. Você faz o Pix, coloca as fotos e o QR Code já sai pronto para imprimir.",
    author: "João R.",
    tag: "Personalizado",
    score: "5.0",
  },
];

const benefits = [
  {
    title: "Inesquecível & Emocionante",
    text: "Não é apenas um link. É uma linha do tempo viva com música de fundo e suas melhores memórias.",
  },
  {
    title: "Prontidão Instantânea",
    text: "Crie em menos de 3 minutos. O QR Code é gerado na hora para você colocar em um cartão físico.",
  },
  {
    title: "Economia Inteligente",
    text: "Um presente de valor emocional gigante que custa muito menos do que uma cesta física.",
  },
];

const demos = [
  {
    title: "Envelope Digital Premium",
    text: "O presenteado escaneia o QR Code e dá de cara com um envelope selado. A curiosidade e expectativa começam no primeiro segundo.",
  },
  {
    title: "Linha do Tempo Fluida",
    text: "Suas fotos antigas organizadas de forma cinematográfica com legendas personalizadas que contam a história de vocês.",
  },
  {
    title: "A 'Carta Viva'",
    text: "A sua declaração não fica apenas estática. Ela se digita sozinha na tela no ritmo da música de fundo escolhida.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0809] text-[#f3ece7] font-sans antialiased selection:bg-rose-600 selection:text-white relative">
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute left-1/2 top-[-15%] h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-gradient-to-b from-rose-900/25 to-amber-900/10 blur-[130px]" />
        <div className="absolute right-[-10%] top-[25%] h-[450px] w-[450px] rounded-full bg-rose-800/15 blur-[110px]" />
        <div className="absolute left-[-5%] bottom-[15%] h-[400px] w-[400px] rounded-full bg-amber-900/10 blur-[100px]" />
      </div>

      <section className="relative mx-auto max-w-6xl px-6 py-12 sm:px-8 lg:px-12 z-10">
        <header className="flex items-center justify-between border-b border-zinc-800/50 pb-8">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black tracking-tight text-white font-serif italic">
              Aura
              <span className="text-rose-500 font-sans not-italic font-black">Box</span>
            </span>
          </div>
          <div className="text-sm font-medium tracking-wide text-rose-300 font-serif italic">
            Guarde seus melhores momentos
          </div>
        </header>

        <div className="mt-20 grid gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
          <div className="flex flex-col space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose-400">
              💝 O PRESENTE MAIS EMOCIONANTE DO ANO
            </span>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.15] font-serif">
              Transforme memórias em um presente digital{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-200 to-amber-300">
                mágico.
              </span>
            </h1>
            <p className="max-w-xl text-xl leading-relaxed text-[#d5c9c1]">
              Crie uma cápsula do tempo exclusiva com suas fotos antigas, música
              de fundo e uma mensagem interativa. Gere um QR Code instantâneo
              para emocionar quem você ama de um jeito único.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/criar"
                className="rounded-full bg-gradient-to-r from-rose-600 to-rose-500 px-10 py-4 text-lg font-bold text-white shadow-lg shadow-rose-600/30 transition hover:from-rose-500 hover:to-rose-400 hover:scale-[1.02] active:scale-[0.98]"
              >
                Criar Minha Cápsula
              </Link>
              <button className="rounded-full border border-zinc-800 bg-zinc-900/30 px-10 py-4 text-lg font-bold text-zinc-300 shadow-sm transition hover:bg-zinc-800/60 hover:text-white">
                Ver Exemplo Ao Vivo
              </button>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-3 pt-8 border-t border-zinc-800/60">
              {benefits.map((item) => (
                <div key={item.title} className="flex flex-col space-y-2">
                  <h4 className="text-lg font-bold text-white font-serif">{item.title}</h4>
                  <p className="text-base leading-relaxed text-[#bcaea6]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative justify-self-center lg:justify-self-end w-full max-w-[360px]">
            <div
              className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-rose-500/20 to-transparent blur-2xl animate-pulse"
              style={{ animationDuration: "4s" }}
            />

            <div className="relative rounded-[2.5rem] border-4 border-[#1f1618] bg-[#0f0b0c] p-4 shadow-2xl shadow-black/80">
              <div className="mx-auto mb-4 h-4 w-24 rounded-full bg-[#1c1416]" />

              <div className="rounded-[1.8rem] bg-[#140e10] p-5 border border-zinc-900 space-y-5">
                <div className="text-center space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-rose-400 font-extrabold">
                    Cápsula Ativa 🔒
                  </span>
                  <h3 className="text-xl font-bold text-white font-serif italic">
                    Nossas Memórias 🤍
                  </h3>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-[#1d1416] p-3 border border-rose-950/40">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-8 w-8 animate-spin rounded-full bg-gradient-to-tr from-rose-500 via-[#140e10] to-amber-400 border border-rose-900/50"
                      style={{ animationDuration: "5s" }}
                    />
                    <div>
                      <p className="text-xs font-bold text-rose-100">Sua Música Favorita.mp3</p>
                      <p className="text-[10px] text-zinc-500">Trilha Sonora Ativa</p>
                    </div>
                  </div>
                  <span className="text-xs text-rose-400 font-bold animate-pulse">● Tocado</span>
                </div>

                <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/40 overflow-hidden">
                  <div className="aspect-[4/3] bg-gradient-to-b from-[#24171a] to-[#140e10] flex flex-col items-center justify-center text-rose-900/60 text-xs font-bold">
                    <span className="text-xl mb-1">📸</span>
                    <span className="text-zinc-600">[ Sua Foto Antiga Aqui ]</span>
                  </div>
                  <div className="p-3 bg-[#0d090a]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                      Viagem Marcante • 2022
                    </span>
                    <p className="text-xs text-[#c7b9b1] mt-0.5">
                      "O dia em que prometemos nunca esquecer esse momento..."
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-[#fffcf9] p-4 shadow-xl border border-amber-900/10">
                  <p className="text-sm font-serif leading-relaxed text-zinc-900 font-medium">
                    Queria usar esse espaço para te dizer o quanto você é
                    essencial na minha vida...
                    <span className="inline-block w-1.5 h-3 bg-rose-600 ml-0.5 animate-pulse" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-40 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
              COMO FUNCIONA A EXPERIÊNCIA
            </span>
            <h2 className="text-3xl font-black text-white sm:text-4xl font-serif">
              Por que o presenteado fica tão impactado?
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {demos.map((demo) => (
              <div
                key={demo.title}
                className="rounded-2xl border border-zinc-900 bg-gradient-to-b from-zinc-900/30 to-transparent p-6 space-y-3 transition hover:border-rose-950/50"
              >
                <div className="h-1 w-10 rounded-full bg-gradient-to-r from-rose-500 to-amber-400" />
                <h3 className="text-xl font-bold text-white font-serif">{demo.title}</h3>
                <p className="text-lg leading-relaxed text-[#bcaea6]">{demo.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-40 rounded-3xl border border-zinc-900 bg-gradient-to-b from-rose-950/10 to-transparent p-8 backdrop-blur-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
                PROVA SOCIAL REAL
              </span>
              <h3 className="text-3xl font-black text-white sm:text-4xl font-serif">
                Histórias de quem já emocionou
              </h3>
            </div>
            <p className="max-w-md text-lg text-[#bcaea6]">
              Veja o feedback de quem trocou presentes genéricos por uma
              experiência digital que transborda sentimento.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reviews.map((review) => (
              <div
                key={review.author}
                className="flex flex-col justify-between rounded-2xl border border-zinc-900 bg-[#120d0f]/60 p-6 space-y-5 shadow-xl transition hover:scale-[1.01] hover:border-rose-950/40"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-rose-400">⭐ {review.score}</span>
                    <span className="rounded-full bg-rose-950/40 px-2.5 py-0.5 text-xs font-bold text-rose-300 border border-rose-900/30">
                      {review.tag}
                    </span>
                  </div>
                  <p className="text-base leading-relaxed text-[#d5c9c1] font-medium italic">
                    "{review.quote}"
                  </p>
                </div>
                <p className="text-base font-bold text-white border-t border-zinc-800/60 pt-3 font-serif">
                  {review.author}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-40 rounded-3xl bg-gradient-to-r from-rose-950/60 via-[#170e10] to-zinc-950 p-8 border border-rose-900/20 text-center sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
              PRODUÇÃO IMEDIATA
            </span>
            <h3 className="text-4xl font-black text-white sm:text-5xl font-serif">
              Crie uma surpresa inesquecível hoje mesmo.
            </h3>
            <p className="text-lg leading-relaxed text-[#d5c9c1] max-w-xl mx-auto">
              Não deixe datas importantes passarem em branco. Comece a montar
              sua cápsula agora, faça o download do QR Code e veja a reação de
              quem você ama se transformar em emoção pura.
            </p>
            <div className="pt-2">
              <Link
                to="/criar"
                className="inline-block rounded-full bg-gradient-to-r from-rose-600 to-rose-500 px-10 py-4 text-lg font-bold text-white shadow-xl shadow-rose-600/20 transition hover:from-rose-500 hover:to-rose-400 hover:scale-[1.02]"
              >
                Começar Agora
              </Link>
            </div>
          </div>
        </section>

        <footer className="mt-24 text-center text-sm font-medium text-zinc-600 tracking-wider">
          &copy; {new Date().getFullYear()} AuraBox. Feito com carinho.
        </footer>
      </section>
    </main>
  );
}
