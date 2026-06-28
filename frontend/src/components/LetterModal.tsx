import { useEffect } from "react";
import { createPortal } from "react-dom";

interface LetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  letter: string;
}

/**
 * Modal de carta expandida — fundo com blur (backdrop-blur), fecha ao
 * clicar fora ou apertar Esc. Usa portal pra renderizar no topo da árvore
 * do DOM, evitando problemas de z-index/overflow de containers pais.
 */
export default function LetterModal({ isOpen, onClose, letter }: LetterModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    // trava o scroll da página por trás enquanto o modal está aberto
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-[#fffcf9] p-8 shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900/5 text-zinc-500 hover:bg-zinc-900/10 hover:text-zinc-900 transition"
        >
          ✕
        </button>

        <p className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-zinc-900 pr-8">
          {letter}
        </p>
      </div>
    </div>,
    document.body
  );
}
