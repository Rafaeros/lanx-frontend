import type { BadgeProps } from "@/shared/components/ui/badge";
import { hojeIso, toIsoDate } from "@/shared/lib/date";

/** Dias de antecedência em que a OP passa a aparecer como "próxima". */
const DIAS_ALERTA = 3;

/** Atrasada (previsão passou) ou próxima do prazo; null = no prazo. Datas ISO comparam como texto. */
export function situacaoPrevisao(previsao: string): { label: string; variant: BadgeProps["variant"] } | null {
  if (previsao < hojeIso()) return { label: "Atrasada", variant: "danger" };
  const limite = new Date();
  limite.setDate(limite.getDate() + DIAS_ALERTA);
  if (previsao <= toIsoDate(limite)) return { label: "Próxima", variant: "warning" };
  return null;
}
