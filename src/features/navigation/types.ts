import type { LucideIcon } from "lucide-react";

export type ModuleId =
  | "compras"
  | "producao"
  | "comercial"
  | "qualidade"
  | "teste-inspecao"
  | "estoque"
  | "financeiro"
  | "administracao";

/** "available": já tem telas; "soon": aparece na navegação, mas ainda está por vir. */
export type AvailabilityStatus = "available" | "soon";

export type SectionKind = "cadastros" | "acesso" | "operacoes" | "relatorios";

export interface NavItem {
  id: string;
  label: string;
  to: string;
  icon: LucideIcon;
  /** Chave da funcionalidade no catálogo do backend. Sem chave = qualquer usuário autenticado. */
  featureKey?: string;
  status?: AvailabilityStatus;
}

export interface NavSection {
  kind: SectionKind;
  items: NavItem[];
}

export interface ModuleDefinition {
  id: ModuleId;
  label: string;
  description: string;
  icon: LucideIcon;
  status: AvailabilityStatus;
  /** Quando definido, o módulo só aparece se o backend liberar essa funcionalidade ao usuário. */
  featureKey?: string;
  /** Ids do catálogo de cadastros (config/cadastros.ts) que aparecem neste módulo, nessa ordem. */
  cadastros?: string[];
  sections: NavSection[];
}
