import {
  ChartColumn,
  Factory,
  Gauge,
  Handshake,
  KeyRound,
  ShieldCheck,
  ShoppingCart,
  UserCog,
  Wallet,
  Warehouse,
} from "lucide-react";
import type { ModuleDefinition } from "../types";

/**
 * Registro dos módulos do sistema. A ordem aqui é a ordem do seletor de módulos.
 * Para liberar um módulo: mude `status` para "available" e declare suas seções.
 */
export const MODULES: ModuleDefinition[] = [
  {
    id: "compras",
    label: "Compras",
    description: "Requisições, pedidos e fornecedores",
    icon: ShoppingCart,
    status: "available",
    featureKey: "compras",
    sections: [
      {
        kind: "relatorios",
        items: [
          {
            id: "compras.analise-pedidos",
            label: "Análise de pedidos",
            to: "/compras/analise-pedidos",
            icon: ChartColumn,
            featureKey: "compras.analise-pedidos",
          },
          {
            id: "compras.iqf",
            label: "IQF de fornecedores",
            to: "/compras/iqf",
            icon: Gauge,
            featureKey: "compras.iqf",
          },
        ],
      },
    ],
  },
  {
    id: "producao",
    label: "Produção",
    description: "Ordens, apontamentos e roteiros",
    icon: Factory,
    status: "soon",
    sections: [],
  },
  {
    id: "comercial",
    label: "Comercial",
    description: "Clientes, orçamentos e vendas",
    icon: Handshake,
    status: "soon",
    sections: [],
  },
  {
    id: "estoque",
    label: "Estoque",
    description: "Saldos, movimentações e inventário",
    icon: Warehouse,
    status: "soon",
    sections: [],
  },
  {
    id: "financeiro",
    label: "Financeiro",
    description: "Contas a pagar e a receber",
    icon: Wallet,
    status: "soon",
    sections: [],
  },
  {
    id: "administracao",
    label: "Administração",
    description: "Usuários, perfis e permissões",
    icon: ShieldCheck,
    status: "available",
    featureKey: "administracao",
    sections: [
      {
        kind: "acesso",
        items: [
          {
            id: "administracao.usuarios",
            label: "Usuários",
            to: "/administracao/usuarios",
            icon: UserCog,
            featureKey: "administracao.usuarios",
          },
          {
            id: "administracao.permissoes",
            label: "Perfis e permissões",
            to: "/administracao/perfis",
            icon: KeyRound,
            featureKey: "administracao.permissoes",
          },
        ],
      },
    ],
  },
];

/** Variável CSS com a cor do módulo (definida em app.css). */
export function moduleAccentVar(id: ModuleDefinition["id"]): string {
  return `var(--module-${id})`;
}

export const DEFAULT_MODULE_ID = MODULES.find((m) => m.status === "available")?.id ?? MODULES[0].id;
