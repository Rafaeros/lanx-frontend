import { Briefcase, Building2, HardHat, Package, Ruler, ShoppingBag, Split, Truck } from "lucide-react";
import type { NavItem, NavSection } from "../types";

/**
 * Catálogo dos cadastros (dados mestres). Cada tela existe uma vez só, em /cadastros/...; cada
 * módulo escolhe quais mostra na seção Cadastros (ModuleDefinition.cadastros).
 */
export const CADASTROS: NavItem[] = [
  {
    id: "cadastros.materiais",
    label: "Materiais",
    to: "/cadastros/materiais",
    icon: Package,
    featureKey: "cadastros.materiais",
  },
  {
    id: "cadastros.unidade-medida",
    label: "Unidades de medida",
    to: "/cadastros/unidades-medida",
    icon: Ruler,
    featureKey: "cadastros.unidade-medida",
  },
  {
    id: "cadastros.fornecedores",
    label: "Fornecedores",
    to: "/cadastros/fornecedores",
    icon: Truck,
    featureKey: "cadastros.fornecedores",
  },
  {
    id: "cadastros.departamentos",
    label: "Departamentos",
    to: "/cadastros/departamentos",
    icon: Building2,
    featureKey: "cadastros.departamentos",
  },
  {
    id: "cadastros.operadores",
    label: "Operadores",
    to: "/cadastros/operadores",
    icon: HardHat,
    featureKey: "cadastros.operadores",
  },
  {
    id: "cadastros.compradores",
    label: "Compradores",
    to: "/cadastros/compradores",
    icon: ShoppingBag,
    featureKey: "cadastros.compradores",
  },
  {
    id: "cadastros.rateios",
    label: "Rateios",
    to: "/cadastros/rateios",
    icon: Split,
    featureKey: "cadastros.rateios",
  },
  {
    id: "cadastros.clientes",
    label: "Clientes",
    to: "/cadastros/clientes",
    icon: Briefcase,
    featureKey: "cadastros.clientes",
  },
];

/** Seção Cadastros de um módulo, na ordem em que o módulo lista os ids. */
export function cadastrosDoModulo(ids: readonly string[] = []): NavSection {
  return {
    kind: "cadastros",
    items: ids.map((id) => CADASTROS.find((item) => item.id === id)).filter((item): item is NavItem => !!item),
  };
}
