/** Date → "YYYY-MM-DD" no fuso local (o formato de <input type="date"> e dos filtros da API). */
export const toIsoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Hoje em "YYYY-MM-DD" (fuso local). */
export const hojeIso = () => toIsoDate(new Date());
