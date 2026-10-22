import apiClient from "@/shared/api/client";
import type { ApiResponse, PageResult } from "@/shared/types";
import type { RateioFilter, RateioRequest, RateioResponse } from "../types";
import { env } from "@/config/env";
import { paginate } from "@/shared/lib/pagination";

let mockRateios: RateioResponse[] = [
  { id: "r-001", nome: "MATERIA-PRIMA" },
  { id: "r-002", nome: "MATERIAL DE USO E CONSUMO" },
  { id: "r-003", nome: "MATERIAL DE ESCRITÓRIO" },
];

export const rateiosApi = {
  /** GET /rateios?busca=&page=&size= (ordenado por nome). */
  search: async (
    filter: RateioFilter = {},
    page = 0,
    size = 20
  ): Promise<PageResult<RateioResponse>> => {
    try {
      const params: Record<string, string | number> = { page, size };
      if (filter.busca?.trim()) params.busca = filter.busca.trim();

      const response = await apiClient.get<ApiResponse<PageResult<RateioResponse>>>("/rateios", {
        params,
      });
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        const busca = (filter.busca ?? "").trim().toLowerCase();
        const filtered = mockRateios
          .filter((d) => !busca || d.nome.toLowerCase().includes(busca))
          .sort((a, b) => a.nome.localeCompare(b.nome));
        return paginate(filtered, page, size);
      }
      throw error;
    }
  },

  /** Lista para selects (até 100 rateios). */
  findAll: async (): Promise<RateioResponse[]> => {
    const result = await rateiosApi.search({}, 0, 100);
    return result.items || [];
  },

  create: async (data: RateioRequest): Promise<RateioResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<RateioResponse>>("/rateios", data);
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        const novo: RateioResponse = { id: "r-" + Date.now(), nome: data.nome };
        mockRateios = [novo, ...mockRateios];
        return novo;
      }
      throw error;
    }
  },

  update: async (id: string, data: RateioRequest): Promise<RateioResponse> => {
    try {
      const response = await apiClient.put<ApiResponse<RateioResponse>>(`/rateios/${id}`, data);
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        mockRateios = mockRateios.map((d) => (d.id === id ? { id, nome: data.nome } : d));
        return { id, nome: data.nome };
      }
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete<ApiResponse<void>>(`/rateios/${id}`);
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        mockRateios = mockRateios.filter((d) => d.id !== id);
        return;
      }
      throw error;
    }
  },
};
