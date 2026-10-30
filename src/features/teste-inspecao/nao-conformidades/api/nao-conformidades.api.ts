import apiClient from "@/shared/api/client";
import type { ApiResponse, PageResult } from "@/shared/types";
import { env } from "@/config/env";
import { paginate } from "@/shared/lib/pagination";
import { rethrowBlobError, saveBlob, saveBlobResponse } from "@/shared/lib/download";
import { hojeIso } from "@/shared/lib/date";
import type {
  NaoConformidadeAnexo,
  NaoConformidadeFiltro,
  NaoConformidadeIndicadores,
  NaoConformidadeRequest,
  NaoConformidadeResponse,
} from "../types";

const BASE = "/teste-inspecao/operacoes/nao-conformidade";
/** Máximo de registros listados no PDF. */
export const RELATORIO_LIMITE = 1000;

const mockNaoConformidades: NaoConformidadeResponse[] = [
  {
    id: "nc-001",
    tipo: { id: "tnc-001", nome: "Inversão" },
    departamento: { id: "d-001", nome: "Montagem" },
    ordemDeProducao: {
      id: "op-001",
      codigo: "OP-0223707",
      clienteNome: "WITTUR",
      materialCodigo: "WTR215 001 000",
      materialDescricao: "Chicote WTR215",
      quantidade: 800,
      previsao: "2025-01-24",
    },
    operador: null,
    quantidadeNaoConforme: 4,
    dataNaoConformidade: "2025-01-04",
    createdAt: "2025-01-04T10:00:00Z",
  },
];

function params(filtro: NaoConformidadeFiltro): Record<string, string> {
  const p: Record<string, string> = {};
  if (filtro.busca?.trim()) p.busca = filtro.busca.trim();
  if (filtro.dataInicio) p.dataInicio = filtro.dataInicio;
  if (filtro.dataFim) p.dataFim = filtro.dataFim;
  return p;
}

export const naoConformidadesApi = {
  /** GET ?busca=&dataInicio=&dataFim=&page=&size= (mais recentes primeiro). */
  search: async (
    filtro: NaoConformidadeFiltro = {},
    page = 0,
    size = 20
  ): Promise<PageResult<NaoConformidadeResponse>> => {
    try {
      const response = await apiClient.get<ApiResponse<PageResult<NaoConformidadeResponse>>>(BASE, {
        params: { ...params(filtro), page, size },
      });
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        return paginate(mockNaoConformidades, page, size);
      }
      throw error;
    }
  },

  /** GET /indicadores: cards e gráficos do período. */
  indicadores: async (filtro: NaoConformidadeFiltro): Promise<NaoConformidadeIndicadores> => {
    const response = await apiClient.get<ApiResponse<NaoConformidadeIndicadores>>(`${BASE}/indicadores`, {
      params: params(filtro),
    });
    return response.data.data;
  },

  /** Registros do filtro para o relatório em PDF (uma página grande; o Excel traz todos). */
  listarParaRelatorio: (filtro: NaoConformidadeFiltro) => naoConformidadesApi.search(filtro, 0, RELATORIO_LIMITE),

  /** GET /{id}: inclui os anexos. */
  findById: async (id: string): Promise<NaoConformidadeResponse> => {
    const response = await apiClient.get<ApiResponse<NaoConformidadeResponse>>(`${BASE}/${id}`);
    return response.data.data;
  },

  /** POST multipart: parte "request" em JSON (Content-Type application/json) e os arquivos em "files". */
  create: async (data: NaoConformidadeRequest, files: File[]): Promise<NaoConformidadeResponse> => {
    const form = new FormData();
    form.append("request", new Blob([JSON.stringify(data)], { type: "application/json" }));
    files.forEach((file) => form.append("files", file));
    const response = await apiClient.post<ApiResponse<NaoConformidadeResponse>>(BASE, form, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 120000,
    });
    return response.data.data;
  },

  /** PUT /{id}: só os dados; os anexos não mudam. */
  update: async (id: string, data: NaoConformidadeRequest): Promise<NaoConformidadeResponse> => {
    const response = await apiClient.put<ApiResponse<NaoConformidadeResponse>>(`${BASE}/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`${BASE}/${id}`);
  },

  /** GET /{id}/anexos/{anexoId}: baixa o arquivo com o nome original. */
  baixarAnexo: async (naoConformidadeId: string, anexo: NaoConformidadeAnexo): Promise<void> => {
    saveBlob(await naoConformidadesApi.anexoBlob(naoConformidadeId, anexo), anexo.nomeArquivo);
  },

  /**
   * O arquivo do anexo em memória, para exibir na tela (useObjectUrl). Vem pelo apiClient, que manda o
   * token: um <img src> direto no endpoint não manda o Authorization e voltaria 401.
   */
  anexoBlob: async (naoConformidadeId: string, anexo: NaoConformidadeAnexo): Promise<Blob> => {
    const response = await apiClient
      .get<Blob>(`${BASE}/${naoConformidadeId}/anexos/${anexo.id}`, { responseType: "blob", timeout: 120000 })
      .catch(rethrowBlobError);
    // tipo explícito: sem ele o <iframe> pode baixar o PDF em vez de mostrar
    return new Blob([response.data], { type: anexo.contentType });
  },

  /** GET /exportar: planilha (.xlsx) com as NCs do filtro, sem paginação. */
  exportar: async (filtro: NaoConformidadeFiltro): Promise<void> => {
    const response = await apiClient
      .get<Blob>(`${BASE}/exportar`, { params: params(filtro), responseType: "blob", timeout: 120000 })
      .catch(rethrowBlobError);
    saveBlobResponse(response, `nao-conformidades_${hojeIso()}.xlsx`);
  },
};
