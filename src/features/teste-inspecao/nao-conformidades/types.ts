// --- Teste e Inspeção: Não conformidades ---
export interface NaoConformidadeResumo {
  id: string;
  nome: string;
}

/** O que a NC mostra da OP (as colunas da planilha da qualidade). */
export interface NaoConformidadeOrdemResumo {
  id: string;
  codigo: string;
  clienteNome?: string | null;
  materialCodigo?: string | null;
  materialDescricao?: string | null;
  quantidade: number;
  /** yyyy-MM-dd: data de entrega da OP. */
  previsao: string;
}

export interface NaoConformidadeAnexo {
  id: string;
  nomeArquivo: string;
  contentType: string;
  tamanhoBytes: number;
  createdAt: string;
}

export interface NaoConformidadeResponse {
  id: string;
  /** Relacionamentos ficam nulos se forem excluídos do cadastro depois da NC. */
  tipo?: NaoConformidadeResumo | null;
  departamento?: NaoConformidadeResumo | null;
  ordemDeProducao?: NaoConformidadeOrdemResumo | null;
  /** Opcional. */
  operador?: NaoConformidadeResumo | null;
  quantidadeNaoConforme: number;
  /** yyyy-MM-dd */
  dataNaoConformidade: string;
  createdAt: string;
  /** Só no detalhe (GET /{id}); ausente na listagem. */
  anexos?: NaoConformidadeAnexo[] | null;
}

/** Parte "request" do POST multipart e corpo do PUT. */
export interface NaoConformidadeRequest {
  tipoNaoConformidadeId: string;
  departamentoId: string;
  ordemDeProducaoId: string;
  operadorId: string | null;
  quantidadeNaoConforme: number;
  dataNaoConformidade: string;
}

/** Período pela data da NC; datas vazias = sem limite. */
export interface NaoConformidadeFiltro {
  busca?: string;
  dataInicio?: string;
  dataFim?: string;
}

/** Fatia de um agrupamento (departamento, tipo ou cliente), do maior para o menor. */
export interface NaoConformidadeGrupo {
  nome: string;
  registros: number;
  quantidade: number;
  /** % da quantidade não conforme total do período. */
  percentual: number | null;
  /** % acumulado até este grupo (Pareto). */
  percentualAcumulado: number | null;
}

export interface NaoConformidadeMes {
  /** "2026-09" */
  mes: string;
  registros: number;
  quantidade: number;
}

/** GET /indicadores: totais e agrupamentos do período (pela data da NC). */
export interface NaoConformidadeIndicadores {
  dataInicio?: string | null;
  dataFim?: string | null;
  registros: number;
  quantidadeNaoConforme: number;
  opsAfetadas: number;
  /** Soma das quantidades das OPs afetadas (cada OP uma vez). */
  quantidadeOps: number;
  /** quantidadeNaoConforme / quantidadeOps em %; ausente sem OPs. */
  percentualNaoConforme?: number | null;
  porDepartamento: NaoConformidadeGrupo[];
  porTipo: NaoConformidadeGrupo[];
  porCliente: NaoConformidadeGrupo[];
  meses: NaoConformidadeMes[];
}
