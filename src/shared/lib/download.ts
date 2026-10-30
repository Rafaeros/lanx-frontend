import type { AxiosResponse } from "axios";

/** Nome do arquivo do Content-Disposition (filename* UTF-8 tem prioridade). */
function filenameFrom(disposition: string | undefined, fallback: string): string {
  if (!disposition) return fallback;
  const utf8 = /filename\*=UTF-8''([^;]+)/i.exec(disposition);
  if (utf8) return decodeURIComponent(utf8[1]);
  const plain = /filename="?([^";]+)"?/i.exec(disposition);
  return plain ? plain[1] : fallback;
}

/** Salva no navegador um arquivo recebido como blob (responseType: "blob"). */
export function saveBlobResponse(response: AxiosResponse<Blob>, fallbackName: string): void {
  saveBlob(response.data, filenameFrom(response.headers["content-disposition"] as string | undefined, fallbackName));
}

/** Salva um blob que já está em memória (ex.: anexo aberto no visualizador) com o nome dado. */
export function saveBlob(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Em requisições com `responseType: "blob"`, o corpo de erro do backend
 * ({ status, message }) chega como Blob e getApiErrorMessage não consegue lê-lo.
 * Converte esse corpo de volta para JSON e relança o mesmo erro.
 */
export async function rethrowBlobError(error: unknown): Promise<never> {
  const data = (error as { response?: { data?: unknown } })?.response?.data;
  if (data instanceof Blob) {
    try {
      (error as { response: { data: unknown } }).response.data = JSON.parse(await data.text());
    } catch {
      // corpo não é JSON: mantém o erro como veio
    }
  }
  throw error;
}
