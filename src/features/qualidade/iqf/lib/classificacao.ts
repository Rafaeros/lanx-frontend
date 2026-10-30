import type { FaixaIqf } from "../types";
import type { BadgeProps } from "@/shared/components/ui/badge";

export const FAIXA_LABELS: Record<FaixaIqf, string> = {
  A: "A · Qualificado",
  B: "B · Em atenção",
  C: "C · Crítico",
};

export const FAIXA_BADGE: Record<FaixaIqf, BadgeProps["variant"]> = {
  A: "success",
  B: "warning",
  C: "danger",
};

/** Cor de texto/barra por faixa, nos tokens do tema. */
export const FAIXA_TONE: Record<FaixaIqf, { text: string; bar: string }> = {
  A: { text: "text-success", bar: "bg-success" },
  B: { text: "text-warning", bar: "bg-warning" },
  C: { text: "text-danger", bar: "bg-danger" },
};

export const FAIXA_CRITERIO = "A ≥ 84% · B ≥ 75% · C < 75% das entregas no prazo";

/** Metas do IQF de prazo (as mesmas do backend: domain.MetaIqf). */
export const META_GERAL = 97;
export const META_FORNECEDOR = 85;

/** Tolerância de atraso: padrão e limite (domain.AvaliacaoPrazo). */
export const TOLERANCIA_PADRAO = 1;
export const TOLERANCIA_MAXIMA = 30;

export const diasTexto = (n: number) => `${n} ${n === 1 ? "dia" : "dias"}`;

/** Regra de contagem (domain.AvaliacaoPrazo) com a tolerância escolhida no filtro. */
export function regraPrazo(toleranciaDias: number): string {
  const tolerancia =
    toleranciaDias === 0
      ? "Entrega depois da previsão já conta como atraso."
      : `Entrega até ${diasTexto(toleranciaDias)} após a previsão conta como no prazo.`;
  return `${tolerancia} Previsões depois de hoje só entram no cálculo quando a data chegar.`;
}

export function formatPercentual(value?: number | null): string {
  if (value == null) return "-";
  return `${new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 2 }).format(value)}%`;
}

/** Mês por extenso/abreviado: vive em shared, reexportado para quem já importa daqui. */
export { formatMes } from "@/shared/lib/date";

/** "2026-09-30" → "30/09/2026". */
export function formatData(iso: string): string {
  const [a, m, d] = iso.split("-");
  return d && m && a ? `${d}/${m}/${a}` : iso;
}

/**
 * Cor de texto de um mês: pela meta (IQF geral) ou pela faixa A/B/C (fornecedor).
 * Mês sem avaliação fica neutro.
 */
export function tomDoMes(
  mes: { atingiuMeta?: boolean | null; classificacao?: { faixa: FaixaIqf } | null },
  porMeta: boolean
): string {
  if (porMeta) {
    if (mes.atingiuMeta == null) return "text-muted-foreground";
    return mes.atingiuMeta ? "text-success" : "text-danger";
  }
  return mes.classificacao ? FAIXA_TONE[mes.classificacao.faixa].text : "text-muted-foreground";
}
