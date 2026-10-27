// --- Produção: Ordens de produção ---
export interface OrdemProducaoClienteResumo {
  id: string;
  nome: string;
}

export interface OrdemProducaoMaterialResumo {
  id: string;
  codigo: string;
  descricao: string;
  /** Sigla da unidade de medida do material. */
  unidadeMedida: string;
}

export interface OrdemProducaoResponse {
  id: string;
  codigo: string;
  cliente: OrdemProducaoClienteResumo;
  /** Ausente se o material foi excluído do cadastro depois da OP. */
  material?: OrdemProducaoMaterialResumo | null;
  quantidade: number;
  /** yyyy-MM-dd */
  previsao: string;
  /** Ausente enquanto a OP não foi iniciada. */
  etapaAtual?: string | null;
}

/** Corpo de POST e PUT em /producao/operacoes/ordens-de-producao. */
export interface OrdemProducaoRequest {
  codigo: string;
  clienteId: string;
  materialId: string;
  quantidade: number;
  previsao: string;
  etapaAtual: string | null;
}

export interface OrdemProducaoFilter {
  busca?: string;
}
