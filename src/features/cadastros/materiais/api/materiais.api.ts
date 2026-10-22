import apiClient from "@/shared/api/client";
import type { ApiResponse, PageResult } from "@/shared/types";
import type {
  MaterialResponse,
  CreateMaterialRequest,
  UpdateMaterialRequest,
  MaterialFilter,
} from "../types";
import { env } from "@/config/env";

let mockMateriais: MaterialResponse[] = [
  {
    id: "m-001",
    codigo: "MAT-1001",
    descricao: "Válvula Esférica Inox 316 2 Polegadas",
    unidadeMedida: { id: "11111111-1111-1111-1111-111111111111", nome: "Unidade", sigla: "UN" },
    tipo: "MATERIA_PRIMA",
  },
  {
    id: "m-002",
    codigo: "MAT-1002",
    descricao: "Chapa de Aço Carbono 1/4x1200x3000mm",
    unidadeMedida: { id: "22222222-2222-2222-2222-222222222222", nome: "Quilograma", sigla: "KG" },
    tipo: "MATERIA_PRIMA",
  },
  {
    id: "m-003",
    codigo: "MAT-1003",
    descricao: "Tubo Industrial Schedule 40 3 Metros",
    unidadeMedida: { id: "33333333-3333-3333-3333-333333333333", nome: "Metro", sigla: "M" },
    tipo: "MATERIA_PRIMA",
  },
  {
    id: "m-004",
    codigo: "MAT-1004",
    descricao: "Óleo Lubrificante Sintético ISO VG 68",
    unidadeMedida: { id: "44444444-4444-4444-4444-444444444444", nome: "Litro", sigla: "L" },
    tipo: "MATERIA_PRIMA",
  },
  {
    id: "m-005",
    codigo: "MAT-1005",
    descricao: "Parafuso Sextavado M12 x 50mm Galvanizado",
    unidadeMedida: { id: "55555555-5555-5555-5555-555555555555", nome: "Caixa", sigla: "CX" },
    tipo: "MATERIA_PRIMA",
  },
  {
    id: "m-006",
    codigo: "MAT-1006",
    descricao: "Eletrodo Revestido AWS E7018 3.25mm",
    unidadeMedida: { id: "22222222-2222-2222-2222-222222222222", nome: "Quilograma", sigla: "KG" },
    tipo: "MATERIA_PRIMA",
  },
  {
    id: "m-007",
    codigo: "MAT-1007",
    descricao: "Gaxeta de Vedação PTFE Expandido 1/2\"",
    unidadeMedida: { id: "33333333-3333-3333-3333-333333333333", nome: "Metro", sigla: "M" },
    tipo: "MATERIA_PRIMA",
  },
];

export const materiaisApi = {
  findAll: async (
    filter: MaterialFilter = {},
    page = 0,
    size = 10
  ): Promise<PageResult<MaterialResponse>> => {
    try {
      const params: Record<string, any> = { page, size };
      if (filter.codigo) params.codigo = filter.codigo;
      if (filter.descricao) params.descricao = filter.descricao;
      if (filter.tipo) params.tipo = filter.tipo;

      const response = await apiClient.get<ApiResponse<PageResult<MaterialResponse>>>(
        "/materiais",
        { params }
      );
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        let filtered = [...mockMateriais];
        if (filter.codigo) {
          filtered = filtered.filter((m) =>
            m.codigo.toLowerCase().includes(filter.codigo!.toLowerCase())
          );
        }
        if (filter.descricao) {
          filtered = filtered.filter((m) =>
            m.descricao.toLowerCase().includes(filter.descricao!.toLowerCase())
          );
        }
        if (filter.tipo) {
          filtered = filtered.filter((m) => m.tipo === filter.tipo);
        }
        const totalElements = filtered.length;
        const totalPages = Math.ceil(totalElements / size) || 1;
        const start = page * size;
        const items = filtered.slice(start, start + size);

        return {
          items,
          page,
          size,
          totalElements,
          totalPages,
        };
      }
      throw error;
    }
  },

  findById: async (id: string): Promise<MaterialResponse> => {
    try {
      const response = await apiClient.get<ApiResponse<MaterialResponse>>(`/materiais/${id}`);
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        const found = mockMateriais.find((m) => m.id === id);
        if (found) return found;
      }
      throw error;
    }
  },

  create: async (data: CreateMaterialRequest): Promise<MaterialResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<MaterialResponse>>("/materiais", data);
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        const newMaterial: MaterialResponse = {
          id: "m-" + Date.now(),
          codigo: data.codigo,
          descricao: data.descricao,
          unidadeMedida: {
            id: data.unidadeMedidaId,
            nome: "Unidade",
            sigla: "UN",
          },
          tipo: data.tipo,
        };
        mockMateriais = [newMaterial, ...mockMateriais];
        return newMaterial;
      }
      throw error;
    }
  },

  update: async (id: string, data: UpdateMaterialRequest): Promise<MaterialResponse> => {
    try {
      const response = await apiClient.put<ApiResponse<MaterialResponse>>(`/materiais/${id}`, data);
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        const index = mockMateriais.findIndex((m) => m.id === id);
        if (index >= 0) {
          mockMateriais[index] = {
            ...mockMateriais[index],
            codigo: data.codigo,
            descricao: data.descricao,
            tipo: data.tipo,
          };
          return mockMateriais[index];
        }
      }
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete<ApiResponse<void>>(`/materiais/${id}`);
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        mockMateriais = mockMateriais.filter((m) => m.id !== id);
        return;
      }
      throw error;
    }
  },
};

