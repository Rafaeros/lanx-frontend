import apiClient from "@/shared/api/client";
import type {
  ApiResponse,
  PageResult,
  UnidadeMedidaFilter,
  UnidadeMedidaRequest,
  UnidadeMedidaResponse,
} from "@/shared/api/schema";
import { env } from "@/config/env";
import { paginate } from "@/shared/lib/pagination";

let mockUnidades: UnidadeMedidaResponse[] = [
  { id: "11111111-1111-1111-1111-111111111111", nome: "Unidade", sigla: "UN" },
  { id: "22222222-2222-2222-2222-222222222222", nome: "Quilograma", sigla: "KG" },
  { id: "33333333-3333-3333-3333-333333333333", nome: "Metro", sigla: "M" },
  { id: "44444444-4444-4444-4444-444444444444", nome: "Litro", sigla: "L" },
  { id: "55555555-5555-5555-5555-555555555555", nome: "Caixa", sigla: "CX" },
];

export const unidadeMedidaApi = {
  /** Busca paginada (GET /unidade-medida?busca=&page=&size=). */
  search: async (
    filter: UnidadeMedidaFilter = {},
    page = 0,
    size = 20
  ): Promise<PageResult<UnidadeMedidaResponse>> => {
    try {
      const response = await apiClient.get<ApiResponse<PageResult<UnidadeMedidaResponse>>>(
        "/unidade-medida",
        { params: { busca: filter.busca ?? "", page, size } }
      );
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        const busca = (filter.busca ?? "").toLowerCase();
        const filtered = mockUnidades.filter(
          (u) => u.nome.toLowerCase().includes(busca) || u.sigla.toLowerCase().includes(busca)
        );
        return paginate(filtered, page, size);
      }
      throw error;
    }
  },

  /** Lista para selects (até 100 unidades). */
  findAll: async (): Promise<UnidadeMedidaResponse[]> => {
    const result = await unidadeMedidaApi.search({}, 0, 100);
    return result.items || [];
  },

  /** POST /unidade-medida devolve apenas o id criado. */
  create: async (data: UnidadeMedidaRequest): Promise<{ id: string }> => {
    try {
      const response = await apiClient.post<ApiResponse<{ id: string }>>("/unidade-medida", data);
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        const id = crypto.randomUUID();
        mockUnidades = [{ id, ...data }, ...mockUnidades];
        return { id };
      }
      throw error;
    }
  },

  update: async (id: string, data: UnidadeMedidaRequest): Promise<void> => {
    try {
      await apiClient.put<ApiResponse<void>>(`/unidade-medida/${id}`, data);
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        mockUnidades = mockUnidades.map((u) => (u.id === id ? { ...u, ...data } : u));
        return;
      }
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete<ApiResponse<void>>(`/unidade-medida/${id}`);
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        mockUnidades = mockUnidades.filter((u) => u.id !== id);
        return;
      }
      throw error;
    }
  },
};
