import apiClient from "@/shared/api/client";
import type { ApiResponse, PageResult } from "@/shared/types";
import type { TipoNaoConformidadeFilter, TipoNaoConformidadeRequest, TipoNaoConformidadeResponse } from "../types";
import { env } from "@/config/env";
import { paginate } from "@/shared/lib/pagination";

let mockTipos: TipoNaoConformidadeResponse[] = [
  { id: "tnc-001", nome: "Inversão" },
  { id: "tnc-002", nome: "Termo s/ retrair" },
  { id: "tnc-003", nome: "Conector errado" },
];

export const tiposNaoConformidadeApi = {
  /** GET /tipos-nao-conformidade?busca=&page=&size= (ordenado por nome). */
  search: async (
    filter: TipoNaoConformidadeFilter = {},
    page = 0,
    size = 20
  ): Promise<PageResult<TipoNaoConformidadeResponse>> => {
    try {
      const params: Record<string, string | number> = { page, size };
      if (filter.busca?.trim()) params.busca = filter.busca.trim();

      const response = await apiClient.get<ApiResponse<PageResult<TipoNaoConformidadeResponse>>>("/tipos-nao-conformidade", {
        params,
      });
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        const busca = (filter.busca ?? "").trim().toLowerCase();
        const filtered = mockTipos
          .filter((d) => !busca || d.nome.toLowerCase().includes(busca))
          .sort((a, b) => a.nome.localeCompare(b.nome));
        return paginate(filtered, page, size);
      }
      throw error;
    }
  },

  /** Lista para selects (até 200 tipos). */
  findAll: async (): Promise<TipoNaoConformidadeResponse[]> => {
    const result = await tiposNaoConformidadeApi.search({}, 0, 200);
    return result.items || [];
  },

  create: async (data: TipoNaoConformidadeRequest): Promise<TipoNaoConformidadeResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<TipoNaoConformidadeResponse>>("/tipos-nao-conformidade", data);
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        const novo: TipoNaoConformidadeResponse = { id: "tnc-" + Date.now(), nome: data.nome };
        mockTipos = [novo, ...mockTipos];
        return novo;
      }
      throw error;
    }
  },

  update: async (id: string, data: TipoNaoConformidadeRequest): Promise<TipoNaoConformidadeResponse> => {
    try {
      const response = await apiClient.put<ApiResponse<TipoNaoConformidadeResponse>>(`/tipos-nao-conformidade/${id}`, data);
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        mockTipos = mockTipos.map((d) => (d.id === id ? { id, nome: data.nome } : d));
        return { id, nome: data.nome };
      }
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete<ApiResponse<void>>(`/tipos-nao-conformidade/${id}`);
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        mockTipos = mockTipos.filter((d) => d.id !== id);
        return;
      }
      throw error;
    }
  },
};
