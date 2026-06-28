import { apiFetch } from "./api";
import type { Capsule, CreateCapsuleInput, TimelineItem } from "../types/capsule";

export async function createCapsule(input: CreateCapsuleInput) {
  return apiFetch<{ capsule: Capsule; editToken: string; warning: string }>("/capsules", {
    method: "POST",
    body: input,
  });
}

export async function getPublicCapsule(slug: string) {
  return apiFetch<{ capsule: Capsule }>(`/capsules/public/${slug}`);
}

export async function getCapsuleForManagement(id: string, editToken: string) {
  return apiFetch<{ capsule: Capsule }>(`/capsules/${id}/manage`, { editToken });
}

export async function updateCapsule(
  id: string,
  editToken: string,
  input: Partial<CreateCapsuleInput>
) {
  return apiFetch<{ capsule: Capsule }>(`/capsules/${id}`, {
    method: "PATCH",
    editToken,
    body: input,
  });
}

export async function deleteCapsule(id: string, editToken: string) {
  return apiFetch<void>(`/capsules/${id}`, { method: "DELETE", editToken });
}

/**
 * Upload de imagem da timeline. Usa FormData (multipart), não JSON —
 * por isso não passamos Content-Type manualmente, o browser define o
 * boundary correto automaticamente.
 */
export async function addTimelineItem(
  capsuleId: string,
  editToken: string,
  file: File,
  caption: string
) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("caption", caption);

  return apiFetch<{ item: TimelineItem }>(`/capsules/${capsuleId}/timeline-items`, {
    method: "POST",
    editToken,
    body: formData,
  });
}

export async function removeTimelineItem(capsuleId: string, itemId: string, editToken: string) {
  return apiFetch<void>(`/capsules/${capsuleId}/timeline-items/${itemId}`, {
    method: "DELETE",
    editToken,
  });
}

/**
 * Upload de arquivo de áudio próprio (mp3/wav/ogg). Substitui qualquer
 * songUrl (Spotify/YouTube) que a cápsula já tivesse — são exclusivos.
 */
export async function uploadSong(capsuleId: string, editToken: string, file: File) {
  const formData = new FormData();
  formData.append("audio", file);

  return apiFetch<{ capsule: Capsule }>(`/capsules/${capsuleId}/song`, {
    method: "POST",
    editToken,
    body: formData,
  });
}

export async function removeSong(capsuleId: string, editToken: string) {
  return apiFetch<{ capsule: Capsule }>(`/capsules/${capsuleId}/song`, {
    method: "DELETE",
    editToken,
  });
}
