import apiClient from "@/shared/api/client";
import type { ApiResponse } from "@/shared/types";
import { env } from "@/config/env";
import { rethrowBlobError, saveBlobResponse } from "@/shared/lib/download";
import type { CarteiraFiltro, CarteiraItemResponse, CarteiraResponse } from "../types";

/** O backend consulta o ERP na hora (um ano leva ~1,5 min): bem acima dos 30 s padrão do client. */
const TIMEOUT_ERP = 6 * 60 * 1000;

const MOCK_ITENS: CarteiraItemResponse[] = [
  {
    negociacao: 5335,
    pedidoCliente: "409489",
    ordem: "OP-0008362",
    tipoServico: "Protótipo",
    cliente: "IND. DE IMPLEMENTOS AGRICOLAS VENCE TUDO",
    codigo: "VTD096 000 000",
    descricao: "CHICOTE EXTENSÃO TRANSP AUTO PAMPEANA 36000 S",
    previsao: "2026-10-20",
    pendente: 1,
    valorTotal: 141.96,
    etapaAtual: "MONTAGEM GERAL",
    atrasado: true,
    materiaisPendentes: [
      { codigo: "CNMAT04CZ", descricao: "CONECTOR MACHO AT PM 4 VIAS - CZ", quantidadePendente: 1, unidadeMedida: "un", previsao: "2026-11-23" },
    ],
  },
  {
    negociacao: 5343,
    pedidoCliente: "542",
    ordem: "OP-0008365",
    tipoServico: "Venda",
    cliente: "MANP TECNOLOGIA LTDA - AGRONYX",
    codigo: "AGX014 001 000",
    descricao: "CHICOTE MONITORAMENTO PARA 7 LINHAS(M1347)",
    previsao: "2026-11-27",
    pendente: 3,
    valorTotal: 1685.25,
    etapaAtual: "CORTE",
    atrasado: false,
    materiaisPendentes: [
      { codigo: "BACKCPC37MC01", descricao: "PRESILHA PARA CONECTOR 37V CPC", quantidadePendente: 1, unidadeMedida: "un" },
      { codigo: "CFR0035PR", descricao: "CABO FLEXÍVEL 0,35 MM² PRETO", quantidadePendente: 120, unidadeMedida: "m", previsao: "2026-11-10" },
    ],
  },
  {
    negociacao: 5350,
    pedidoCliente: "PC-7781",
    ordem: "OP-0008370",
    tipoServico: "Venda",
    cliente: "AGRO MÁQUINAS DO SUL LTDA",
    codigo: "AMS003 002 000",
    descricao: "CHICOTE PAINEL PRINCIPAL",
    previsao: "2026-12-04",
    pendente: 10,
    valorTotal: 4320,
    etapaAtual: "CRIMPAGEM",
    atrasado: false,
    materiaisPendentes: [],
  },
];

function mockCarteira({ dataInicio, dataFim }: CarteiraFiltro): CarteiraResponse {
  return {
    dataInicio,
    dataFim,
    consultadoEm: new Date().toISOString(),
    resumo: {
      itens: MOCK_ITENS.length,
      valorTotal: MOCK_ITENS.reduce((acc, i) => acc + (i.valorTotal ?? 0), 0),
      atrasados: MOCK_ITENS.filter((i) => i.atrasado).length,
      comMaterialPendente: MOCK_ITENS.filter((i) => i.materiaisPendentes.length > 0).length,
    },
    itens: MOCK_ITENS,
  };
}

export const carteiraApi = {
  /**
   * GET /comercial/relatorios/carteira: pedidos pendentes do período com a etapa da OP e os materiais
   * que faltam. `atualizar` ignora o cache de 10 min do backend e consulta o ERP de novo.
   */
  consultar: async (filtro: CarteiraFiltro, atualizar = false, signal?: AbortSignal): Promise<CarteiraResponse> => {
    try {
      const response = await apiClient.get<ApiResponse<CarteiraResponse>>("/comercial/relatorios/carteira", {
        params: { ...filtro, ...(atualizar ? { atualizar: true } : {}) },
        timeout: TIMEOUT_ERP,
        signal,
      });
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK && !signal?.aborted) return mockCarteira(filtro);
      throw error;
    }
  },

  /** GET /comercial/relatorios/carteira/exportar: planilha (.xlsx); reaproveita a consulta recente do backend. */
  exportar: async (filtro: CarteiraFiltro): Promise<void> => {
    const response = await apiClient
      .get<Blob>("/comercial/relatorios/carteira/exportar", {
        params: filtro,
        responseType: "blob",
        timeout: TIMEOUT_ERP,
      })
      .catch(rethrowBlobError);
    saveBlobResponse(response, `carteira-pedidos_${filtro.dataInicio}_${filtro.dataFim}.xlsx`);
  },
};
