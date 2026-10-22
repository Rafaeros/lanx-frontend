import type { UnidadeMedidaSummaryResponse } from "@/features/cadastros/unidade-medida/types";

// --- Cadastros: Materiais ---
/** Espelha o enum TipoMaterial do backend. */
export type TipoMaterial = "MATERIA_PRIMA" | "PRODUTO_ACABADO";

export interface MaterialResponse {
  id: string;
  codigo: string;
  descricao: string;
  unidadeMedida: UnidadeMedidaSummaryResponse;
  tipo: TipoMaterial;
}

export interface CreateMaterialRequest {
  codigo: string;
  descricao: string;
  unidadeMedidaId: string;
  tipo: TipoMaterial;
}

export interface UpdateMaterialRequest {
  codigo: string;
  descricao: string;
  unidadeMedidaId: string;
  tipo: TipoMaterial;
}

export interface MaterialFilter {
  codigo?: string;
  descricao?: string;
  /** Ausente = todos os tipos. */
  tipo?: TipoMaterial | "";
  page?: number;
  size?: number;
}
