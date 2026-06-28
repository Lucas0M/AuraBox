/**
 * Converte um título em slug (ex: "Para Você, Amor!" -> "para-voce-amor")
 */
export default function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove caracteres especiais
    .replace(/\s+/g, "-") // espaços -> hífen
    .replace(/-+/g, "-") // colapsa hífens repetidos
    .replace(/^-|-$/g, ""); // remove hífen nas pontas
}
