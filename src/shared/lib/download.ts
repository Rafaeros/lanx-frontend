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
  const name = filenameFrom(response.headers["content-disposition"] as string | undefined, fallbackName);
  const url = URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
