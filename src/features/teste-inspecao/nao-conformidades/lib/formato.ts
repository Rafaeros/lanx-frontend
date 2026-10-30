import type { NaoConformidadeGrupo } from "../types";

export { formatMes } from "@/shared/lib/date";

/** 12.5 → "12,5%"; ausente → "-". */
export function formatPercentual(valor?: number | null): string {
  if (valor == null) return "-";
  return `${valor.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`;
}

export const formatQuantidade = (valor?: number | null) =>
  (valor ?? 0).toLocaleString("pt-BR", { maximumFractionDigits: 4 });

/**
 * Os `limite - 1` maiores e o restante somado em "Outros" (o gráfico não cabe com dezenas de barras).
 * O % acumulado é refeito na nova ordem.
 */
export function comOutros(grupos: NaoConformidadeGrupo[], limite: number, total: number): NaoConformidadeGrupo[] {
  if (grupos.length <= limite) return grupos;
  const maiores = grupos.slice(0, limite - 1);
  const resto = grupos.slice(limite - 1);
  const quantidade = resto.reduce((s, g) => s + g.quantidade, 0);
  return [
    ...maiores,
    {
      nome: `Outros (${resto.length})`,
      registros: resto.reduce((s, g) => s + g.registros, 0),
      quantidade,
      percentual: total > 0 ? (quantidade / total) * 100 : null,
      percentualAcumulado: total > 0 ? 100 : null,
    },
  ];
}

export const truncar = (texto: string, max: number) => (texto.length > max ? `${texto.slice(0, max - 1)}…` : texto);
