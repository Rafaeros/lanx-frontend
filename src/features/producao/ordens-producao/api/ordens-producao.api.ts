import apiClient from "@/shared/api/client";
import type { ApiResponse, PageResult } from "@/shared/types";
import type { OrdemProducaoFilter, OrdemProducaoRequest, OrdemProducaoResponse } from "../types";
import { env } from "@/config/env";
import { paginate } from "@/shared/lib/pagination";

const BASE = "/producao/operacoes/ordens-de-producao";

let mockOrdens: OrdemProducaoResponse[] = [
  {
    id: "op-001",
    codigo: "OP-0001",
    cliente: { id: "c-001", nome: "CLIENTE EXEMPLO LTDA" },
    material: { id: "m-pa-1", codigo: "KHN321", descricao: "Chicote elétrico KHN321", unidadeMedida: "PÇ" },
    quantidade: 74,
    previsao: "2026-11-10",
    etapaAtual: "Corte",
  },
];

export const ordensProducaoApi = {
  /** GET ?busca=&page=&size= (previsão mais próxima primeiro). */
  search: async (
    filter: OrdemProducaoFilter = {},
    page = 0,
    size = 20
  ): Promise<PageResult<OrdemProducaoResponse>> => {
    try {
      const params: Record<string, string | number> = { page, size };
      if (filter.busca?.trim()) params.busca = filter.busca.trim();

      const response = await apiClient.get<ApiResponse<PageResult<OrdemProducaoResponse>>>(BASE, { params });
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        const busca = (filter.busca ?? "").trim().toLowerCase();
        const filtered = mockOrdens
          .filter(
            (o) =>
              !busca ||
              `${o.codigo} ${o.cliente.nome} ${o.material?.codigo ?? ""} ${o.material?.descricao ?? ""}`
                .toLowerCase()
                .includes(busca)
          )
          .sort((a, b) => a.previsao.localeCompare(b.previsao));
        return paginate(filtered, page, size);
      }
      throw error;
    }
  },

  /** Lista para selects (ex.: comunizado), até 200 OPs. */
  findAll: async (): Promise<OrdemProducaoResponse[]> => {
    const result = await ordensProducaoApi.search({}, 0, 200);
    return result.items || [];
  },

  create: async (data: OrdemProducaoRequest): Promise<OrdemProducaoResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<OrdemProducaoResponse>>(BASE, data);
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        const nova: OrdemProducaoResponse = {
          id: "op-" + Date.now(),
          codigo: data.codigo,
          cliente: { id: data.clienteId, nome: "Cliente (mock)" },
          material: null,
          quantidade: data.quantidade,
          previsao: data.previsao,
          etapaAtual: data.etapaAtual,
        };
        mockOrdens = [nova, ...mockOrdens];
        return nova;
      }
      throw error;
    }
  },

  update: async (id: string, data: OrdemProducaoRequest): Promise<OrdemProducaoResponse> => {
    try {
      const response = await apiClient.put<ApiResponse<OrdemProducaoResponse>>(`${BASE}/${id}`, data);
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        mockOrdens = mockOrdens.map((o) =>
          o.id === id
            ? { ...o, codigo: data.codigo, quantidade: data.quantidade, previsao: data.previsao, etapaAtual: data.etapaAtual }
            : o
        );
        return mockOrdens.find((o) => o.id === id)!;
      }
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete<ApiResponse<void>>(`${BASE}/${id}`);
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        mockOrdens = mockOrdens.filter((o) => o.id !== id);
        return;
      }
      throw error;
    }
  },
};
