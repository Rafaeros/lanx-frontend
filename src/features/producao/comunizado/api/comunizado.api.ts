import apiClient from "@/shared/api/client";
import { rethrowBlobError, saveBlobResponse } from "@/shared/lib/download";
import type { ComunizadoFormData } from "../lib/schema";

export interface GerarComunizadoParams {
  arquivo: File;
  dados: ComunizadoFormData;
}

export const comunizadoApi = {
  /**
   * POST /producao/operacoes/comunizado (multipart): envia a IT e os campos
   * preenchidos; baixa a planilha no layout do comunizado. Devolve o nome do arquivo.
   */
  gerar: async ({ arquivo, dados }: GerarComunizadoParams): Promise<string> => {
    const form = new FormData();
    form.append("arquivo", arquivo);
    // só manda o que foi preenchido: vazio = usa o da IT ou sai em branco
    Object.entries(dados).forEach(([campo, valor]) => {
      if (typeof valor === "string" && valor.trim()) form.append(campo, valor.trim());
    });

    const response = await apiClient
      .post<Blob>("/producao/operacoes/comunizado", form, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob",
        timeout: 120000,
      })
      .catch(rethrowBlobError);

    const fallback = `Comunizado ${dados.realizadoEm}.xlsx`;
    saveBlobResponse(response, fallback);
    return decodeURIComponent(
      /filename\*=UTF-8''([^;]+)/i.exec(String(response.headers["content-disposition"] ?? ""))?.[1] ?? fallback
    );
  },
};
