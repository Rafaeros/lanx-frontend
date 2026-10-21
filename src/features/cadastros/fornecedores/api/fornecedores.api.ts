import apiClient from "@/shared/api/client";
import type { ApiResponse, PageResult } from "@/shared/types";
import type {
  FornecedorResponse,
  CreateFornecedorRequest,
  UpdateFornecedorRequest,
  FornecedorFilter,
  PaisResponse,
} from "../types";
import { env } from "@/config/env";
import { paginate } from "@/shared/lib/pagination";

const BRASIL = { id: "p-br", nome: "Brasil", codigoIso2: "BR" };
const ALEMANHA = { id: "p-de", nome: "Alemanha", codigoIso2: "DE" };

const MOCK_PAISES: PaisResponse[] = [
  { ...ALEMANHA, codigoIso3: "DEU" },
  { ...BRASIL, codigoIso3: "BRA" },
];

let mockFornecedores: FornecedorResponse[] = [
  { id: "f-001", nome: "Aço Tubos Tubulares SA", pais: BRASIL },
  { id: "f-002", nome: "Valvtech Componentes Ltda", pais: BRASIL },
  { id: "f-003", nome: "Metalúrgica Gerdau do Brasil", pais: BRASIL },
  { id: "f-004", nome: "Bosch Rexroth AG", pais: ALEMANHA },
  { id: "f-005", nome: "Distribuidora Sem País", pais: null },
];

function paisMock(paisId: string | null) {
  const pais = MOCK_PAISES.find((p) => p.id === paisId);
  return pais ? { id: pais.id, nome: pais.nome, codigoIso2: pais.codigoIso2 } : null;
}

export const fornecedoresApi = {
  /** GET /fornecedores?busca=&page=&size= (ordenado por nome). */
  findAll: async (
    filter: FornecedorFilter = {},
    page = 0,
    size = 20
  ): Promise<PageResult<FornecedorResponse>> => {
    try {
      const params: Record<string, string | number> = { page, size };
      if (filter.busca?.trim()) params.busca = filter.busca.trim();

      const response = await apiClient.get<ApiResponse<PageResult<FornecedorResponse>>>("/fornecedores", {
        params,
      });
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        const busca = (filter.busca ?? "").trim().toLowerCase();
        const filtered = mockFornecedores
          .filter((f) => !busca || f.nome.toLowerCase().includes(busca))
          .sort((a, b) => a.nome.localeCompare(b.nome));
        return paginate(filtered, page, size);
      }
      throw error;
    }
  },

  create: async (data: CreateFornecedorRequest): Promise<FornecedorResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<FornecedorResponse>>("/fornecedores", data);
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        const novo: FornecedorResponse = { id: "f-" + Date.now(), nome: data.nome, pais: paisMock(data.paisId) };
        mockFornecedores = [novo, ...mockFornecedores];
        return novo;
      }
      throw error;
    }
  },

  update: async (id: string, data: UpdateFornecedorRequest): Promise<FornecedorResponse> => {
    try {
      const response = await apiClient.put<ApiResponse<FornecedorResponse>>(`/fornecedores/${id}`, data);
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        const index = mockFornecedores.findIndex((f) => f.id === id);
        if (index >= 0) {
          mockFornecedores[index] = { id, nome: data.nome, pais: paisMock(data.paisId) };
          return mockFornecedores[index];
        }
      }
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete<ApiResponse<void>>(`/fornecedores/${id}`);
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        mockFornecedores = mockFornecedores.filter((f) => f.id !== id);
        return;
      }
      throw error;
    }
  },

  /** GET /paises: lista completa ordenada por nome, para o select do formulário. */
  findPaises: async (): Promise<PaisResponse[]> => {
    try {
      const response = await apiClient.get<ApiResponse<PaisResponse[]>>("/paises");
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) return MOCK_PAISES;
      throw error;
    }
  },
};
