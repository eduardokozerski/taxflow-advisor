const defaultBaseUrl = "http://localhost:3333/api/v1";

const getBaseUrl = () => {
  const envBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  return envBaseUrl && envBaseUrl.length > 0 ? envBaseUrl : defaultBaseUrl;
};

export const apiClient = {
  async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${getBaseUrl()}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {})
      }
    });

    const body = (await response.json()) as { data?: T; errors?: Array<{ message: string }> };

    if (!response.ok) {
      throw new Error(body.errors?.[0]?.message ?? "Erro ao processar requisição");
    }

    if (body.data === undefined) {
      throw new Error("Resposta inválida da API");
    }

    return body.data;
  }
};
