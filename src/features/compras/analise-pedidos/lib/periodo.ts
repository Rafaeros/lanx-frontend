const toIso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Primeiro e último dia do mês corrente (YYYY-MM-DD, fuso local). */
export function mesAtual(): { inicio: string; fim: string } {
  const now = new Date();
  return {
    inicio: toIso(new Date(now.getFullYear(), now.getMonth(), 1)),
    fim: toIso(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
  };
}
