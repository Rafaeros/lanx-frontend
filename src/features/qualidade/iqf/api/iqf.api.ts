import apiClient from "@/shared/api/client";
import type { ApiResponse } from "@/shared/types";
import type {
  ClassificacaoIqfResponse,
  IqfFiltro,
  IqfFornecedorResponse,
  IqfMesResponse,
  IqfResponse,
} from "../types";
import { env } from "@/config/env";
import { rethrowBlobError, saveBlobResponse } from "@/shared/lib/download";
import type { RateioFiltro } from "@/features/compras/shared/rateios";

/** Mesma regra do backend (domain.ClassificacaoIqf), usada apenas no fallback mock. */
function classificar(percentual: number | null): ClassificacaoIqfResponse | null {
  if (percentual == null) return null;
  if (percentual >= 84) return { faixa: "A", cor: "VERDE" };
  if (percentual >= 75) return { faixa: "B", cor: "AMARELO" };
  return { faixa: "C", cor: "VERMELHO" };
}

function percentual(noPrazo: number, avaliadas: number): number | null {
  return avaliadas === 0 ? null : Math.round((noPrazo * 10000) / avaliadas) / 100;
}

const MOCK_FORNECEDORES: [string, string, number, number][] = [
  ["mock-fornecedor-1", "Aço Tubos Tubulares SA", 18, 1],
  ["mock-fornecedor-2", "Valvtech Componentes Ltda", 9, 3],
  ["mock-fornecedor-3", "Metalúrgica Gerdau do Brasil", 6, 4],
  ["mock-fornecedor-4", "Parafusos Brasil Ltda", 0, 0],
];

const MOCK_RATEIOS: RateioFiltro[] = [
  { id: "r-001", nome: "MATERIA-PRIMA" },
  { id: "r-002", nome: "MATERIAL DE USO E CONSUMO" },
  { id: "r-003", nome: "MATERIAL DE ESCRITÓRIO" },
  { id: "r-004", nome: "FERRAMENTAS" },
];

/** Todos os meses ("YYYY-MM") entre as duas datas, inclusive. */
function mesesEntre(dataInicio: string, dataFim: string): string[] {
  const [ai, mi] = dataInicio.split("-").map(Number);
  const [af, mf] = dataFim.split("-").map(Number);
  const meses: string[] = [];
  for (let a = ai, m = mi; a < af || (a === af && m <= mf); m === 12 ? ((m = 1), a++) : m++) {
    meses.push(`${a}-${String(m).padStart(2, "0")}`);
  }
  return meses;
}

function mockIqf({ dataInicio, dataFim, rateios, toleranciaDias }: IqfFiltro): IqfResponse {
  const fornecedores: IqfFornecedorResponse[] = MOCK_FORNECEDORES.map(([fornecedorId, fornecedor, noPrazo, atrasadas]) => {
    const p = percentual(noPrazo, noPrazo + atrasadas);
    return {
      fornecedorId,
      fornecedor,
      entregasAvaliadas: noPrazo + atrasadas,
      entregasNoPrazo: noPrazo,
      entregasAtrasadas: atrasadas,
      percentualNoPrazo: p,
      classificacao: classificar(p),
      atingiuMeta: p == null ? null : p >= 85,
    };
  });
  const noPrazo = fornecedores.reduce((acc, f) => acc + f.entregasNoPrazo, 0);
  const atrasadas = fornecedores.reduce((acc, f) => acc + f.entregasAtrasadas, 0);
  const geral = percentual(noPrazo, noPrazo + atrasadas);
  return {
    dataInicio,
    dataFim,
    entregasAvaliadas: noPrazo + atrasadas,
    entregasNoPrazo: noPrazo,
    entregasAtrasadas: atrasadas,
    percentualNoPrazo: geral,
    classificacao: classificar(geral),
    fornecedores,
    rateios: MOCK_RATEIOS.filter((r) => rateios.includes(r.id)),
    toleranciaDias,
    meses: mesesEntre(dataInicio, dataFim).map((mes, i): IqfMesResponse => {
      const avaliadas = 6 + ((i * 7) % 5);
      const noPrazo = Math.max(0, avaliadas - ((i * 3) % 4));
      const p = percentual(noPrazo, avaliadas);
      return {
        mes,
        entregasAvaliadas: avaliadas,
        entregasNoPrazo: noPrazo,
        entregasAtrasadas: avaliadas - noPrazo,
        percentualNoPrazo: p,
        classificacao: classificar(p),
        atingiuMeta: p == null ? null : p >= 97,
      };
    }),
    metaMensal: 97,
  };
}

/** rateios=id1&rateios=id2 (sem colchetes), que é o que o Spring entende como lista. */
function params({ dataInicio, dataFim, rateios, toleranciaDias }: IqfFiltro) {
  const search = new URLSearchParams({ dataInicio, dataFim, toleranciaDias: String(toleranciaDias) });
  rateios.forEach((r) => search.append("rateios", r));
  return search;
}

export const iqfApi = {
  /** GET /qualidade/relatorios/iqf: IQF de prazo geral e por fornecedor, pelas entregas previstas no período. */
  consultar: async (filtro: IqfFiltro): Promise<IqfResponse> => {
    try {
      const response = await apiClient.get<ApiResponse<IqfResponse>>("/qualidade/relatorios/iqf", {
        params: params(filtro),
      });
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) return mockIqf(filtro);
      throw error;
    }
  },

  /** GET /qualidade/relatorios/iqf/fornecedores/{id}: o mesmo cálculo só com as entregas do fornecedor. */
  consultarFornecedor: async (fornecedorId: string, filtro: IqfFiltro): Promise<IqfResponse> => {
    try {
      const response = await apiClient.get<ApiResponse<IqfResponse>>(
        `/qualidade/relatorios/iqf/fornecedores/${encodeURIComponent(fornecedorId)}`,
        { params: params(filtro) }
      );
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) {
        const geral = mockIqf(filtro);
        return {
          ...geral,
          metaMensal: 85,
          meses: geral.meses.map((m) => ({ ...m, atingiuMeta: m.percentualNoPrazo == null ? null : m.percentualNoPrazo >= 85 })),
          fornecedores: geral.fornecedores.filter((f) => f.fornecedorId === fornecedorId),
        };
      }
      throw error;
    }
  },

  /** GET /qualidade/relatorios/iqf/rateios: rateios (id e nome) dos itens importados, para o filtro. */
  rateios: async (): Promise<RateioFiltro[]> => {
    try {
      const response = await apiClient.get<ApiResponse<RateioFiltro[]>>("/qualidade/relatorios/iqf/rateios");
      return response.data.data;
    } catch (error) {
      if (env.VITE_ENABLE_MOCK_FALLBACK) return MOCK_RATEIOS;
      throw error;
    }
  },

  /** GET /qualidade/relatorios/iqf/exportar: baixa a planilha (.xlsx) com o gráfico mensal. */
  exportar: async (filtro: IqfFiltro): Promise<void> => {
    const response = await apiClient
      .get<Blob>("/qualidade/relatorios/iqf/exportar", {
        params: params(filtro),
        responseType: "blob",
        timeout: 120000,
      })
      .catch(rethrowBlobError);
    saveBlobResponse(response, `iqf-fornecedores_${filtro.dataInicio}_${filtro.dataFim}.xlsx`);
  },
};
