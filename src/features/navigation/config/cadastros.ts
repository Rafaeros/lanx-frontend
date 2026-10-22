import { Building2, HardHat, Package, Ruler, ShoppingBag, Split, Truck } from "lucide-react";
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
  ],
};
