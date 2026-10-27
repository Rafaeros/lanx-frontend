import { hojeIso } from "@/shared/lib/date";
import { normalizeSearch } from "@/shared/lib/utils";
import type { CarteiraItemResponse, MaterialPendenteResponse } from "../types";

export type SituacaoFiltro = "todos" | "atrasados" | "falta-material";

export const SITUACOES: { id: SituacaoFiltro; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "atrasados", label: "Atrasados" },
  { id: "falta-material", label: "Falta de material" },
];

/** Filtro local (não vai ao ERP): cliente, OP, produto, pedido do cliente ou negociação. */
export function filtrarCarteira(
  itens: CarteiraItemResponse[],
  busca: string,
  situacao: SituacaoFiltro
): CarteiraItemResponse[] {
  const termo = normalizeSearch(busca.trim());
  return itens.filter((item) => {
    if (situacao === "atrasados" && !item.atrasado) return false;
    if (situacao === "falta-material" && item.materiaisPendentes.length === 0) return false;
    if (!termo) return true;
    return [item.cliente, item.ordem, item.codigo, item.descricao, item.pedidoCliente, item.negociacao?.toString()]
      .some((campo) => campo && normalizeSearch(campo).includes(termo));
  });
}

/** Material que chega depois da entrega do pedido, ou com previsão já vencida (mesma regra da planilha). */
export function materialEmRisco(material: MaterialPendenteResponse, item: CarteiraItemResponse): boolean {
  if (!material.previsao) return false;
  return material.previsao < hojeIso() || (!!item.previsao && material.previsao > item.previsao);
}

/** "27/10/2026, 14:32" a partir de um instante ISO. */
export function formatDataHora(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

/** "3 materiais" / "1 material". */
export function materiaisTexto(quantidade: number): string {
  return `${quantidade} ${quantidade === 1 ? "material" : "materiais"}`;
}

export interface CarteiraPorCliente {
  cliente: string;
  valorTotal: number;
  valorAtrasado: number;
  valorEmDia: number;
  itens: number;
  atrasados: number;
  /** Quantos clientes a linha junta (> 1 só em "Outros"). */
  clientes: number;
}

/**
 * Valor pendente agrupado por cliente, do maior para o menor, separando o que já passou da previsão.
 * Acima de `limite` clientes, o restante vira uma linha "Outros" para o gráfico continuar legível.
 */
export function agruparPorCliente(itens: CarteiraItemResponse[], limite = 15): CarteiraPorCliente[] {
  const grupos = new Map<string, CarteiraPorCliente>();
  for (const item of itens) {
    const cliente = item.cliente?.trim() || "Sem cliente";
    const grupo = grupos.get(cliente) ?? {
      cliente,
      valorTotal: 0,
      valorAtrasado: 0,
      valorEmDia: 0,
      itens: 0,
      atrasados: 0,
      clientes: 1,
    };
    const valor = item.valorTotal ?? 0;
    grupo.valorTotal += valor;
    grupo.itens += 1;
    if (item.atrasado) {
      grupo.valorAtrasado += valor;
      grupo.atrasados += 1;
    } else {
      grupo.valorEmDia += valor;
    }
    grupos.set(cliente, grupo);
  }

  const ordenados = [...grupos.values()].sort((a, b) => b.valorTotal - a.valorTotal);
  if (ordenados.length <= limite) return ordenados;

  const resto = ordenados.slice(limite - 1);
  const outros = resto.reduce<CarteiraPorCliente>(
    (acc, g) => ({
      ...acc,
      valorTotal: acc.valorTotal + g.valorTotal,
      valorAtrasado: acc.valorAtrasado + g.valorAtrasado,
      valorEmDia: acc.valorEmDia + g.valorEmDia,
      itens: acc.itens + g.itens,
      atrasados: acc.atrasados + g.atrasados,
    }),
    { cliente: `Outros (${resto.length} clientes)`, valorTotal: 0, valorAtrasado: 0, valorEmDia: 0, itens: 0, atrasados: 0, clientes: resto.length }
  );
  return [...ordenados.slice(0, limite - 1), outros];
}
