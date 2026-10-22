import apiClient from "@/shared/api/client";
import type { ApiResponse, PageResult } from "@/shared/types";
import type { CompradorFilter, CompradorRequest, CompradorResponse } from "../types";
import { env } from "@/config/env";
import { paginate } from "@/shared/lib/pagination";

let mockCompradores: CompradorResponse[] = [
  { id: "c-001", nome: "MARIANA SILVA", usuario: null },
  { id: "c-002", nome: "RAFAEL COSTA", usuario: null },
];

export const compradoresApi = {
  /** GET /compradores?busca=&page=&size= (ordenado por nome). */
  search: async (filter: CompradorFilter = {}, page = 0, size = 20): Promise<PageResult<CompradorResponse>> => {
    try {
      const params: Record<string, string | number> = { page, size };
      if (filter.busca?.trim()) params.busca = filter.busca.trim();

      const response = await apiClient.get<ApiResponse<PageResult<CompradorResponse>>>("/compradores", { params });
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        const busca = (filter.busca ?? "").trim().toLowerCase();
        const filtered = mockCompradores
          .filter((c) => !busca || c.nome.toLowerCase().includes(busca))
          .sort((a, b) => a.nome.localeCompare(b.nome));
        return paginate(filtered, page, size);
      }
      throw error;
    }
  },

  create: async (data: CompradorRequest): Promise<CompradorResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<CompradorResponse>>("/compradores", data);
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        const novo: CompradorResponse = { id: "c-" + Date.now(), nome: data.nome, usuario: null };
        mockCompradores = [novo, ...mockCompradores];
        return novo;
      }
      throw error;
    }
  },

  update: async (id: string, data: CompradorRequest): Promise<CompradorResponse> => {
    try {
      const response = await apiClient.put<ApiResponse<CompradorResponse>>(`/compradores/${id}`, data);
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        const atualizado: CompradorResponse = {
          id,
          nome: data.nome,
          usuario: data.userId ? { id: data.userId, username: data.userId } : null,
        };
        mockCompradores = mockCompradores.map((c) => (c.id === id ? atualizado : c));
        return atualizado;
      }
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete<ApiResponse<void>>(`/compradores/${id}`);
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        mockCompradores = mockCompradores.filter((c) => c.id !== id);
        return;
      }
      throw error;
    }
  },
};
