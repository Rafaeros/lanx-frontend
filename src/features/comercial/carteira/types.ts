/** Período da consulta (datas "YYYY-MM-DD"): é o único filtro enviado ao ERP. */
export interface CarteiraFiltro {
  dataInicio: string;
  dataFim: string;
}

export interface MaterialPendenteResponse {
  codigo?: string;
  descricao?: string;
  quantidadePendente?: number;
  unidadeMedida?: string;
  previsao?: string;
}

export interface CarteiraItemResponse {
  negociacao?: number;
  pedidoCliente?: string;
  /** Código da OP. */
  ordem?: string;
  tipoServico?: string;
  cliente?: string;
  codigo?: string;
  descricao?: string;
  previsao?: string;
  pendente?: number;
  valorTotal?: number;
  etapaAtual?: string;
  /** Previsão de entrega anterior a hoje. */
  atrasado: boolean;
  materiaisPendentes: MaterialPendenteResponse[];
}

export interface CarteiraResumo {
  itens: number;
  valorTotal: number;
  atrasados: number;
  comMaterialPendente: number;
}

export interface CarteiraResponse {
  dataInicio: string;
  dataFim: string;
  /** Quando os dados saíram do ERP (ISO). Pode ser de uma consulta recente, em cache no backend. */
  consultadoEm: string;
  resumo: CarteiraResumo;
  itens: CarteiraItemResponse[];
}
