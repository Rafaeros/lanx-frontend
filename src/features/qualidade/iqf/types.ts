import type { RateioFiltro } from "@/features/compras/shared/rateios";

// --- Compras: IQF (Índice de Qualidade de Fornecedores, critério prazo) ---
export type FaixaIqf = "A" | "B" | "C";

/** A/VERDE (>= 84%), B/AMARELO (>= 75%), C/VERMELHO. */
export interface ClassificacaoIqfResponse {
  faixa: FaixaIqf;
  cor: "VERDE" | "AMARELO" | "VERMELHO";
}

/** `percentualNoPrazo` e `classificacao` vêm ausentes quando não há entregas avaliadas. */
export interface IqfFornecedorResponse {
  fornecedorId: string;
  fornecedor: string;
  entregasAvaliadas: number;
  entregasNoPrazo: number;
  entregasAtrasadas: number;
  percentualNoPrazo?: number | null;
  classificacao?: ClassificacaoIqfResponse | null;
  /** Percentual >= meta por fornecedor (85%); ausente quando nada foi avaliado. */
  atingiuMeta?: boolean | null;
}

/** IQF de um mês ("2026-09"). Sem entregas avaliadas, percentual e classificação vêm ausentes. */
export interface IqfMesResponse {
  mes: string;
  entregasAvaliadas: number;
  entregasNoPrazo: number;
  entregasAtrasadas: number;
  percentualNoPrazo?: number | null;
  classificacao?: ClassificacaoIqfResponse | null;
  /** Percentual >= meta mensal (97%); ausente quando nada foi avaliado. */
  atingiuMeta?: boolean | null;
}

/** Filtros do IQF: período da previsão de entrega + rateios (vazio = todos) + tolerância de atraso. */
export interface IqfFiltro {
  dataInicio: string;
  dataFim: string;
  /** Ids dos rateios (cadastros.rateios). */
  rateios: string[];
  /** Dias após a previsão que ainda contam como no prazo (0 a 30; padrão 1). */
  toleranciaDias: number;
}

/** GET /qualidade/relatorios/iqf: período pela previsão de entrega do PC. `meses` traz todo mês do período. */
export interface IqfResponse {
  dataInicio: string;
  dataFim: string;
  /** Rateios filtrados, por nome (vazio = todos). */
  rateios: RateioFiltro[];
  toleranciaDias: number;
  entregasAvaliadas: number;
  entregasNoPrazo: number;
  entregasAtrasadas: number;
  percentualNoPrazo?: number | null;
  classificacao?: ClassificacaoIqfResponse | null;
  fornecedores: IqfFornecedorResponse[];
  meses: IqfMesResponse[];
  /** Meta dos meses: 97 no IQF geral, 85 na consulta de um fornecedor. */
  metaMensal: number;
}
