const reviews = [
  {
    quote:
      "Fez o presente parecer uma experiencia de marca. O efeito de revelacao e o carinho visual venderam sozinho.",
    author: "Marina, presenteou no aniversario",
    score: "5.0",
  },
  {
    quote:
      "A parte mais forte foi ver a pessoa abrindo a capsula e lendo a carta no tempo certo. Muito emocional.",
    author: "Lucas, criou para o Dia dos Namorados",
    score: "5.0",
  },
  {
    quote:
      "Parece um produto premium de verdade. A pagina passa confianca antes mesmo da compra.",
    author: "Ana, usou em uma surpresa de familia",
    score: "4.9",
  },
];

const showcases = [
  {
    title: "Envelope digital",
    text: "O visitante entende o valor do produto antes de ver qualquer checkout.",
  },
  {
    title: "Carta viva",
    text: "A mensagem aparece como experiencia, nao como texto comum.",
  },
  {
    title: "Linha do tempo",
    text: "Fotos antigas e legendas constroem o efeito nostalgia que vende.",
  },
];

const gallery = [
  {
    title: "Pagina de abertura",
    caption: "Hero cinematografico com prova social acima da dobra.",
  },
  {
    title: "Fluxo da capsula",
    caption: "Formulario com dados essenciais, sem friccao desnecessaria.",
  },
  {
    title: "Checkout guiado",
    caption: "Pagamento claro, simples e pronto para integrar gateway.",
  },
];

function App() {
  return (
    <main className="min-h-screen bg-aurabox-radial text-paper">
      <section className="relative overflow-hidden px-6 py-6 sm:px-10 lg:px-12">
        <div className="absolute inset-0 opacity-60">
          <div className="absolute left-1/2 top-[-10rem] h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-ember/20 blur-3xl animate-floatSlow" />
          <div className="absolute bottom-[-8rem] right-[-4rem] h-[22rem] w-[22rem] rounded-full bg-gold/12 blur-3xl" />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col gap-8">
          <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.5em] text-mist">
                AuraBox
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Presentes que parecem campanha de marca.
              </h1>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-gold">
              Produto premium para viralizar
            </div>
          </header>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="max-w-2xl animate-reveal">
              <p className="text-xs uppercase tracking-[0.5em] text-gold">
                Capta atencao, prova valor e converte em capsula
              </p>
              <h2 className="mt-5 text-5xl font-semibold leading-none tracking-tight sm:text-6xl lg:text-7xl">
                O cliente chega, ve a prova social e so depois cria a capsula.
              </h2>
              <p className="mt-6 max-w-xl text-sm leading-7 text-white/72 sm:text-base">
                A pagina foi pensada para vender primeiro a ideia, depois a
                emocao e por ultimo o checkout. Reviews fortes, demonstracoes
                visuais, fotos do produto e um fluxo sem pressa para aumentar
                conversao.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button className="rounded-full bg-paper px-6 py-3 text-sm font-semibold text-ink transition hover:bg-gold">
                  Criar minha capsula
                </button>
                <button className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-paper transition hover:border-gold/40 hover:bg-white/10">
                  Ver demonstracao
                </button>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {showcases.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-glow backdrop-blur-sm"
                  >
                    <p className="text-sm font-medium text-paper">
                      {item.title}
                    </p>
                    <p className="mt-2 text-xs leading-6 text-white/62">
                      {item.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[2rem] border border-gold/20 bg-white/5 blur-sm" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0e0e12]/90 p-5 shadow-glow backdrop-blur-xl sm:p-6">
                <div className="grid gap-4 sm:grid-cols-[1.05fr_0.95fr]">
                  <div className="rounded-[1.6rem] border border-white/10 bg-[#121218] p-4">
                    <p className="text-xs uppercase tracking-[0.4em] text-gold">
                      Demo visual
                    </p>
                    <div className="mt-4 space-y-3">
                      <div className="h-28 rounded-2xl bg-gradient-to-br from-white/15 to-ember/20" />
                      <div className="h-16 rounded-2xl bg-gradient-to-r from-gold/20 to-white/10" />
                    </div>
                  </div>
                  <div className="flex flex-col justify-between rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.4em] text-mist">
                        Fluxo
                      </p>
                      <h3 className="mt-3 text-2xl font-semibold">
                        1. Landing
                      </h3>
                      <h3 className="mt-1 text-2xl font-semibold text-white/85">
                        2. Criar capsula
                      </h3>
                      <h3 className="mt-1 text-2xl font-semibold text-white/70">
                        3. Checkout
                      </h3>
                    </div>
                    <p className="mt-6 text-xs leading-6 text-white/58">
                      O CTA principal aparece depois da percepcao de valor, nao
                      antes.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 text-sm text-white/75">
                  <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                    <span>Audio suave</span>
                    <span className="text-gold">quando a capsula abre</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                    <span>Mobile first</span>
                    <span className="text-gold">alto contraste</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.45em] text-gold">
                    Reviews
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold">
                    O que clientes estao dizendo
                  </h3>
                </div>
                <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/70">
                  4.9/5 media
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#101015]">
                <div className="flex gap-4 overflow-x-auto p-4 snap-x snap-mandatory">
                  {reviews.map((review) => (
                    <article
                      key={review.author}
                      className="min-w-[280px] snap-start rounded-[1.2rem] border border-white/10 bg-white/5 p-5"
                    >
                      <p className="text-xs uppercase tracking-[0.4em] text-gold">
                        {review.score}
                      </p>
                      <p className="mt-4 text-sm leading-7 text-white/80">
                        {review.quote}
                      </p>
                      <p className="mt-4 text-xs uppercase tracking-[0.3em] text-mist">
                        {review.author}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </article>

            <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.45em] text-gold">
                Fotos e demonstracoes
              </p>
              <h3 className="mt-2 text-2xl font-semibold">
                Como o produto se apresenta
              </h3>
              <div className="mt-6 grid gap-4">
                {gallery.map((item, index) => (
                  <div
                    key={item.title}
                    className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-[#101015] p-4 sm:grid-cols-[0.9fr_1.1fr]"
                  >
                    <div className="flex min-h-36 items-end rounded-[1rem] bg-gradient-to-br from-gold/25 via-white/10 to-ember/20 p-4 text-xs uppercase tracking-[0.35em] text-white/70">
                      Foto {String(index + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-paper">
                        {item.title}
                      </p>
                      <p className="mt-2 text-xs leading-6 text-white/62">
                        {item.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-sm lg:grid-cols-3">
            {[
              [
                "1. Criar capsula",
                "Formulario guiado com nome, data, musica e fotos.",
              ],
              ["2. Revisar", "Resumo visual antes de seguir para o pagamento."],
              [
                "3. Checkout",
                "Pagamento simples e pronto para integrar gateway.",
              ],
            ].map(([title, description]) => (
              <article
                key={title}
                className="rounded-[1.35rem] border border-white/10 bg-black/15 p-5"
              >
                <p className="text-sm font-medium text-paper">{title}</p>
                <p className="mt-2 text-xs leading-6 text-white/62">
                  {description}
                </p>
              </article>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}

export default App;
