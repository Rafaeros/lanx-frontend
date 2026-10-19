const toIso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Data de hoje (YYYY-MM-DD, fuso local). */
export const hojeIso = () => toIso(new Date());

export type PresetPeriodo = "mes" | "3m" | "6m" | "12m" | "ano";

export const PRESETS: { id: PresetPeriodo; label: string }[] = [
  { id: "mes", label: "Mês atual" },
  { id: "3m", label: "3 meses" },
  { id: "6m", label: "6 meses" },
  { id: "12m", label: "12 meses" },
  { id: "ano", label: "Ano atual" },
];

/** Período do preset, sempre em meses cheios (o gráfico é mensal). "Nm" = mês atual + N-1 anteriores. */
export function periodoDoPreset(preset: PresetPeriodo, hoje = new Date()): { dataInicio: string; dataFim: string } {
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();
  const fimDoMes = toIso(new Date(ano, mes + 1, 0));
  switch (preset) {
    case "mes":
      return { dataInicio: toIso(new Date(ano, mes, 1)), dataFim: fimDoMes };
    case "3m":
      return { dataInicio: toIso(new Date(ano, mes - 2, 1)), dataFim: fimDoMes };
    case "6m":
      return { dataInicio: toIso(new Date(ano, mes - 5, 1)), dataFim: fimDoMes };
    case "12m":
      return { dataInicio: toIso(new Date(ano, mes - 11, 1)), dataFim: fimDoMes };
    case "ano":
      return { dataInicio: `${ano}-01-01`, dataFim: `${ano}-12-31` };
  }
}

/** Qual preset gera exatamente esse período (para destacar o botão), se algum. */
export function presetDoPeriodo(periodo: { dataInicio: string; dataFim: string }): PresetPeriodo | null {
  const match = PRESETS.find(({ id }) => {
    const p = periodoDoPreset(id);
    return p.dataInicio === periodo.dataInicio && p.dataFim === periodo.dataFim;
  });
  return match?.id ?? null;
}
