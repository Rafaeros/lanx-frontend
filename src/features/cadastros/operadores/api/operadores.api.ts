import apiClient from "@/shared/api/client";
import type { ApiResponse, PageResult } from "@/shared/types";
import type { OperadorFilter, OperadorRequest, OperadorResponse } from "../types";
import { env } from "@/config/env";
import { paginate } from "@/shared/lib/pagination";

const EXTRUSAO = { id: "d-001", nome: "Extrusão" };
const TREFILACAO = { id: "d-002", nome: "Trefilação" };

let mockOperadores: OperadorResponse[] = [
  { id: "o-001", nome: "Carlos Pereira", departamento: EXTRUSAO },
  { id: "o-002", nome: "Fernanda Souza", departamento: TREFILACAO },
  { id: "o-003", nome: "Marcos Lima", departamento: null },
];

function departamentoMock(departamentoId: string | null) {
  return [EXTRUSAO, TREFILACAO].find((d) => d.id === departamentoId) ?? null;
}

export const operadoresApi = {
  /** GET /operadores?busca=&page=&size= (ordenado por nome). */
  search: async (filter: OperadorFilter = {}, page = 0, size = 20): Promise<PageResult<OperadorResponse>> => {
    try {
      const params: Record<string, string | number> = { page, size };
      if (filter.busca?.trim()) params.busca = filter.busca.trim();

      const response = await apiClient.get<ApiResponse<PageResult<OperadorResponse>>>("/operadores", { params });
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        const busca = (filter.busca ?? "").trim().toLowerCase();
        const filtered = mockOperadores
          .filter((o) => !busca || o.nome.toLowerCase().includes(busca))
          .sort((a, b) => a.nome.localeCompare(b.nome));
        return paginate(filtered, page, size);
      }
      throw error;
    }
  },

  create: async (data: OperadorRequest): Promise<OperadorResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<OperadorResponse>>("/operadores", data);
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        const novo: OperadorResponse = {
          id: "o-" + Date.now(),
          nome: data.nome,
          departamento: departamentoMock(data.departamentoId),
          usuario: data.userId ? { id: data.userId, username: data.userId } : null,
        };
        mockOperadores = [novo, ...mockOperadores];
        return novo;
      }
      throw error;
    }
  },

  update: async (id: string, data: OperadorRequest): Promise<OperadorResponse> => {
    try {
      const response = await apiClient.put<ApiResponse<OperadorResponse>>(`/operadores/${id}`, data);
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        const atualizado: OperadorResponse = {
          id,
          nome: data.nome,
          departamento: departamentoMock(data.departamentoId),
          usuario: data.userId ? { id: data.userId, username: data.userId } : null,
        };
        mockOperadores = mockOperadores.map((o) => (o.id === id ? atualizado : o));
        return atualizado;
      }
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete<ApiResponse<void>>(`/operadores/${id}`);
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        mockOperadores = mockOperadores.filter((o) => o.id !== id);
        return;
      }
      throw error;
    }
  },
};
