import apiClient from "@/shared/api/client";
import type { ApiResponse, PageResult } from "@/shared/types";
import type { ContagemNaoLidas, Notificacao } from "../types";

const BASE = "/notificacoes";

/** Endpoint SSE: o servidor empurra um evento "notificacao" a cada notificação nova do usuário logado. */
export const NOTIFICACOES_STREAM_PATH = `${BASE}/stream`;
export const NOTIFICACAO_EVENTO = "notificacao";

/** Sempre as notificações do usuário logado: o backend filtra pelo token. */
export const notificacoesApi = {
  /** GET ?somenteNaoLidas=&page=&size= (mais recentes primeiro). */
  listar: async (somenteNaoLidas = false, page = 0, size = 20): Promise<PageResult<Notificacao>> => {
    const response = await apiClient.get<ApiResponse<PageResult<Notificacao>>>(BASE, {
      params: { somenteNaoLidas, page, size },
    });
    return response.data.data;
  },

  /** GET /nao-lidas/contagem: o número do sino. */
  contarNaoLidas: async (): Promise<ContagemNaoLidas> => {
    const response = await apiClient.get<ApiResponse<ContagemNaoLidas>>(`${BASE}/nao-lidas/contagem`);
    return response.data.data;
  },

  /** PATCH /{id}/lida */
  marcarComoLida: async (id: string): Promise<void> => {
    await apiClient.patch(`${BASE}/${id}/lida`);
  },

  /** PATCH /lidas: todas as do usuário. */
  marcarTodasComoLidas: async (): Promise<void> => {
    await apiClient.patch(`${BASE}/lidas`);
  },
};
