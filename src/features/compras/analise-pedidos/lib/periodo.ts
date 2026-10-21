import { toIsoDate as toIso } from "@/shared/lib/date";

/** Primeiro e último dia do mês corrente (YYYY-MM-DD, fuso local). */
export function mesAtual(): { inicio: string; fim: string } {
  const now = new Date();
  return {
    inicio: toIso(new Date(now.getFullYear(), now.getMonth(), 1)),
    fim: toIso(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
  };
}
