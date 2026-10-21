import apiClient from "@/shared/api/client";
import type { ApiResponse, PageResult } from "@/shared/types";
import type { DepartamentoFilter, DepartamentoRequest, DepartamentoResponse } from "../types";
import { env } from "@/config/env";
import { paginate } from "@/shared/lib/pagination";

let mockDepartamentos: DepartamentoResponse[] = [
  { id: "d-001", nome: "Extrusão" },
  { id: "d-002", nome: "Trefilação" },
  { id: "d-003", nome: "Expedição" },
];

export const departamentosApi = {
  /** GET /departamentos?busca=&page=&size= (ordenado por nome). */
  search: async (
    filter: DepartamentoFilter = {},
    page = 0,
    size = 20
  ): Promise<PageResult<DepartamentoResponse>> => {
    try {
      const params: Record<string, string | number> = { page, size };
      if (filter.busca?.trim()) params.busca = filter.busca.trim();

      const response = await apiClient.get<ApiResponse<PageResult<DepartamentoResponse>>>("/departamentos", {
        params,
      });
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        const busca = (filter.busca ?? "").trim().toLowerCase();
        const filtered = mockDepartamentos
          .filter((d) => !busca || d.nome.toLowerCase().includes(busca))
          .sort((a, b) => a.nome.localeCompare(b.nome));
        return paginate(filtered, page, size);
      }
      throw error;
    }
  },

  /** Lista para selects (até 100 departamentos). */
  findAll: async (): Promise<DepartamentoResponse[]> => {
    const result = await departamentosApi.search({}, 0, 100);
    return result.items || [];
  },

  create: async (data: DepartamentoRequest): Promise<DepartamentoResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<DepartamentoResponse>>("/departamentos", data);
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        const novo: DepartamentoResponse = { id: "d-" + Date.now(), nome: data.nome };
        mockDepartamentos = [novo, ...mockDepartamentos];
        return novo;
      }
      throw error;
    }
  },

  update: async (id: string, data: DepartamentoRequest): Promise<DepartamentoResponse> => {
    try {
      const response = await apiClient.put<ApiResponse<DepartamentoResponse>>(`/departamentos/${id}`, data);
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        mockDepartamentos = mockDepartamentos.map((d) => (d.id === id ? { id, nome: data.nome } : d));
        return { id, nome: data.nome };
      }
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete<ApiResponse<void>>(`/departamentos/${id}`);
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        mockDepartamentos = mockDepartamentos.filter((d) => d.id !== id);
        return;
      }
      throw error;
    }
  },
};
