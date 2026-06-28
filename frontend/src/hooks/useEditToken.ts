const STORAGE_KEY_PREFIX = "aurabox:editToken:";

/**
 * O editToken é a única credencial que prova que alguém é "dono" de uma
 * cápsula (não há login). Guardamos no localStorage, indexado pelo
 * capsuleId, pra sobreviver a refresh de página e fechamento do navegador.
 */
export function saveEditToken(capsuleId: string, editToken: string) {
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${capsuleId}`, editToken);
}

export function getEditToken(capsuleId: string): string | null {
  return localStorage.getItem(`${STORAGE_KEY_PREFIX}${capsuleId}`);
}

export function removeEditToken(capsuleId: string) {
  localStorage.removeItem(`${STORAGE_KEY_PREFIX}${capsuleId}`);
}
