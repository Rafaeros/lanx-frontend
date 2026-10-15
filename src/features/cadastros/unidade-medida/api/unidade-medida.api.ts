import apiClient from "@/shared/api/client";
import type {
  ApiResponse,
  PageResult,
  UnidadeMedidaResponse,
} from "@/shared/api/schema";
import { env } from "@/config/env";

const MOCK_UNIDADES: UnidadeMedidaResponse[] = [
  { id: "11111111-1111-1111-1111-111111111111", nome: "Unidade", sigla: "UN" },
  { id: "22222222-2222-2222-2222-222222222222", nome: "Quilograma", sigla: "KG" },
  { id: "33333333-3333-3333-3333-333333333333", nome: "Metro", sigla: "M" },
  { id: "44444444-4444-4444-4444-444444444444", nome: "Litro", sigla: "L" },
  { id: "55555555-5555-5555-5555-555555555555", nome: "Caixa", sigla: "CX" },
];

export const unidadeMedidaApi = {
  findAll: async (): Promise<UnidadeMedidaResponse[]> => {
    try {
      const response = await apiClient.get<ApiResponse<PageResult<UnidadeMedidaResponse>>>(
        "/unidade-medida",
        { params: { busca: "", size: 100 } }
      );
      return response.data.data.items || [];
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        return MOCK_UNIDADES;
      }
      throw error;
    }
  },
};
