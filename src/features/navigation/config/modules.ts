import {
  BadgeCheck,
  Cable,
  ChartColumn,
  ClipboardCheck,
  ClipboardList,
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
    cadastros: ["cadastros.fornecedores", "cadastros.compradores", "cadastros.materiais", "cadastros.rateios"],
    sections: [
      {
        kind: "operacoes",
        items: [
          {
            id: "compras.analise-pedidos",
            label: "Análise de pedidos",
            to: "/compras/analise-pedidos",
            icon: ChartColumn,
            featureKey: "compras.analise-pedidos",
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
    status: "available",
    featureKey: "producao",
    cadastros: ["cadastros.operadores", "cadastros.materiais", "cadastros.unidade-medida"],
    sections: [
      {
        kind: "operacoes",
        items: [
          {
            id: "producao.ordens-producao",
            label: "Ordens de produção",
            to: "/producao/ordens-de-producao",
            icon: ClipboardCheck,
            featureKey: "producao.ordens-producao",
          },
          {
            id: "producao.comunizado",
            label: "Comunizado",
            to: "/producao/comunizado",
            icon: Cable,
            featureKey: "producao.comunizado",
          },
        ],
      },
    ],
  },
  {
    id: "comercial",
    label: "Comercial",
    description: "Clientes, carteira de pedidos e vendas",
    icon: Handshake,
    status: "available",
    featureKey: "comercial",
    cadastros: ["cadastros.clientes", "cadastros.materiais"],
    sections: [
      {
        kind: "relatorios",
        items: [
          {
            id: "comercial.carteira",
            label: "Carteira de pedidos",
            to: "/comercial/carteira",
            icon: ClipboardList,
            featureKey: "comercial.carteira",
          },
        ],
      },
    ],
  },
  {
    id: "qualidade",
    label: "Qualidade",
    description: "IQF de fornecedores e não conformidades",
    icon: BadgeCheck,
    status: "available",
    featureKey: "qualidade",
    sections: [
      {
        kind: "relatorios",
        items: [
          {
            id: "qualidade.iqf",
            label: "IQF de fornecedores",
            to: "/qualidade/iqf",
            icon: Gauge,
            featureKey: "qualidade.iqf",
          },
        ],
      },
    ],
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
    cadastros: ["cadastros.departamentos"],
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
