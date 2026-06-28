const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(message: string, public status: number, public details?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown; // objeto comum — fazemos o JSON.stringify aqui dentro
  editToken?: string; // quando presente, vai no header Authorization
}

/**
 * Wrapper de fetch que já lida com:
 * - prefixar a URL base do backend
 * - serializar o body como JSON automaticamente (exceto FormData, usado no upload)
 * - extrair mensagens de erro do formato { error: string } que o backend retorna
 * - anexar o editToken como Bearer token, quando fornecido
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, editToken, headers, ...rest } = options;

  const isFormData = body instanceof FormData;

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(editToken ? { Authorization: `Bearer ${editToken}` } : {}),
      ...headers,
    },
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  // 204 No Content não tem corpo pra parsear
  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data?.error ?? "Erro ao comunicar com o servidor", response.status, data?.details);
  }

  return data as T;
}
