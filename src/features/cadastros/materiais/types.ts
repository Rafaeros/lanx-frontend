import type { UnidadeMedidaSummaryResponse } from "@/features/cadastros/unidade-medida/types";

// --- Cadastros: Materiais ---
export interface MaterialResponse {
  id: string;
  codigo: string;
  descricao: string;
  unidadeMedida: UnidadeMedidaSummaryResponse;
}

export interface CreateMaterialRequest {
  codigo: string;
  descricao: string;
  unidadeMedidaId: string;
}

export interface UpdateMaterialRequest {
  codigo: string;
  descricao: string;
  unidadeMedidaId: string;
}

export interface MaterialFilter {
  codigo?: string;
  descricao?: string;
  page?: number;
  size?: number;
}
