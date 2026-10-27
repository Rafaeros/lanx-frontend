import apiClient from "@/shared/api/client";
import type { ApiResponse, PageResult } from "@/shared/types";
import type { ClienteFilter, ClienteRequest, ClienteResponse } from "../types";
import { env } from "@/config/env";
import { paginate } from "@/shared/lib/pagination";

let mockClientes: ClienteResponse[] = [
  { id: "c-001", nome: "CLIENTE EXEMPLO LTDA", cnpj: "11222333000181" },
  { id: "c-002", nome: "MONTADORA SUL S.A.", cnpj: null },
];

export const clientesApi = {
  /** GET /clientes?busca=&page=&size= (ordenado por nome; busca pelo nome ou pelos dígitos do CNPJ). */
  search: async (
    filter: ClienteFilter = {},
    page = 0,
    size = 20
  ): Promise<PageResult<ClienteResponse>> => {
    try {
      const params: Record<string, string | number> = { page, size };
      if (filter.busca?.trim()) params.busca = filter.busca.trim();

      const response = await apiClient.get<ApiResponse<PageResult<ClienteResponse>>>("/clientes", {
        params,
      });
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        const busca = (filter.busca ?? "").trim().toLowerCase();
        const filtered = mockClientes
          .filter((c) => !busca || c.nome.toLowerCase().includes(busca) || (c.cnpj ?? "").includes(busca))
          .sort((a, b) => a.nome.localeCompare(b.nome));
        return paginate(filtered, page, size);
      }
      throw error;
    }
  },

  /** Lista para selects (até 200 clientes). */
  findAll: async (): Promise<ClienteResponse[]> => {
    const result = await clientesApi.search({}, 0, 200);
    return result.items || [];
  },

  create: async (data: ClienteRequest): Promise<ClienteResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<ClienteResponse>>("/clientes", data);
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        const novo: ClienteResponse = { id: "c-" + Date.now(), ...data };
        mockClientes = [novo, ...mockClientes];
        return novo;
      }
      throw error;
    }
  },

  update: async (id: string, data: ClienteRequest): Promise<ClienteResponse> => {
    try {
      const response = await apiClient.put<ApiResponse<ClienteResponse>>(`/clientes/${id}`, data);
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        mockClientes = mockClientes.map((c) => (c.id === id ? { id, ...data } : c));
        return { id, ...data };
      }
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete<ApiResponse<void>>(`/clientes/${id}`);
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        mockClientes = mockClientes.filter((c) => c.id !== id);
        return;
      }
      throw error;
    }
  },
};
