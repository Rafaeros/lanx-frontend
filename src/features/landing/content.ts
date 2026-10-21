import { Cable, ChartColumn, Download, Gauge, KeyRound, ShieldCheck, Truck, type LucideIcon } from "lucide-react";

/**
 * Textos da landing. Tudo o que fala da empresa fica aqui, para ser revisado num lugar só.
 * Só entra o que o próprio sistema comprova (IT de cabos, fornecedores nacionais e
 * importados, metas do IQF, integração com o ERP). Histórico, números e endereço da
 * empresa devem vir da LANX antes de entrar aqui.
 */
export const HERO = {
  eyebrow: "LANX Cables · Sistema de gestão",
  title: "Do pedido de compra ao corte do cabo,",
  highlight: "tudo conectado.",
  description:
    "O LANX reúne compras, qualidade de fornecedores e produção em um só lugar, com os dados do ERP e as permissões de cada equipe.",
};

export const ABOUT = {
  title: "Uma operação feita de cabos",
  description:
    "Cada produto da LANX Cables nasce de uma instrução técnica, com modelo, bitola e cor definidos, e depende de materiais comprados de fornecedores no Brasil e no exterior. O sistema foi construído em volta dessa rotina.",
  pillars: [
    {
      icon: Cable,
      title: "Produção guiada pela IT",
      text: "A instrução técnica vira a planilha de comunizado: cabos agrupados por modelo, bitola e cor, prontos para o corte.",
    },
    {
      icon: Gauge,
      title: "Fornecedores medidos",
      text: "O IQF acompanha as entregas no prazo de cada fornecedor, com meta de 97% no mês e 85% por fornecedor.",
    },
    {
      icon: ShieldCheck,
      title: "Acesso sob controle",
      text: "Perfis definem o que cada pessoa vê e faz, tela por tela e ação por ação.",
    },
  ] satisfies { icon: LucideIcon; title: string; text: string }[],
};

export interface JourneyStep {
  icon: LucideIcon;
  kicker: string;
  title: string;
  text: string;
  points: string[];
}

export const JOURNEY: JourneyStep[] = [
  {
    icon: Download,
    kicker: "01 · Compras",
    title: "Os pedidos chegam do ERP",
    text: "Requisições e pedidos de compra são importados mês a mês e ficam disponíveis para consulta, filtro e exportação.",
    points: ["Importação por período", "Situação pendente, parcial ou atendida", "Exportação em planilha"],
  },
  {
    icon: ChartColumn,
    kicker: "02 · Análise",
    title: "Cada entrega vira indicador",
    text: "A análise de pedidos mostra valores, saldos e lead time da emissão do pedido até a entrega.",
    points: ["Valor total e itens por situação", "Lead time médio", "Detalhes de cada pedido"],
  },
  {
    icon: Truck,
    kicker: "03 · Fornecedores",
    title: "Prazo medido, fornecedor classificado",
    text: "O IQF compara a previsão com a entrega real e classifica cada fornecedor nas faixas A, B e C.",
    points: ["Tolerância de atraso configurável", "Visão mensal e por fornecedor", "Relatório em PDF e Excel"],
  },
  {
    icon: Cable,
    kicker: "04 · Produção",
    title: "Da IT à ordem de corte",
    text: "O comunizado lê a instrução técnica e gera a planilha de corte no layout da fábrica, sem redigitação.",
    points: ["Lê todas as abas de cabos", "Organiza por modelo, bitola e cor", "Layout A4 pronto para imprimir"],
  },
  {
    icon: KeyRound,
    kicker: "05 · Acesso",
    title: "Cada equipe no seu lugar",
    text: "Usuários recebem perfis com permissões por funcionalidade: ler, criar, editar, excluir, importar, exportar.",
    points: ["Perfis reutilizáveis", "Botões aparecem conforme a permissão", "Primeiro acesso com senha forte"],
  },
];
