/** Date → "YYYY-MM-DD" no fuso local (o formato de <input type="date"> e dos filtros da API). */
export const toIsoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Hoje em "YYYY-MM-DD" (fuso local). */
export const hojeIso = () => toIsoDate(new Date());

const MESES_CURTOS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const MESES_LONGOS = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

const TEMPO_RELATIVO = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
const UNIDADES_RELATIVAS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

/** ISO → "agora", "há 5 minutos", "ontem", "há 3 dias"... */
export function formatRelativo(iso: string, agora: Date = new Date()): string {
  const segundos = Math.round((new Date(iso).getTime() - agora.getTime()) / 1000);
  for (const [unidade, tamanho] of UNIDADES_RELATIVAS) {
    if (Math.abs(segundos) >= tamanho) return TEMPO_RELATIVO.format(Math.round(segundos / tamanho), unidade);
  }
  return "agora";
}

/** "2026-09" → "set/26" (short) ou "setembro de 2026" (long). */
export function formatMes(mes: string, estilo: "short" | "long" = "short"): string {
  const [ano, m] = mes.split("-").map(Number);
  if (!ano || !m) return mes;
  return estilo === "short" ? `${MESES_CURTOS[m - 1]}/${String(ano).slice(2)}` : `${MESES_LONGOS[m - 1]} de ${ano}`;
}
