import { Package, Ruler, Truck } from "lucide-react";
import type { NavSection } from "../types";

/** Cadastros compartilhados: aparecem em todos os módulos, sempre como primeira seção. */
export const SHARED_CADASTROS: NavSection = {
  kind: "cadastros",
  items: [
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
  ],
};
