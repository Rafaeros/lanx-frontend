/** Rateio (cadastros.rateios) usado nos filtros da análise de pedidos e do IQF: os filtros vão pelo id. */
export interface RateioFiltro {
  id: string;
  nome: string;
}

/** "Rateios: A, B" ou "Todos os rateios" (cabeçalhos, modal e impressão). */
export function rateiosTexto(rateios: RateioFiltro[]): string {
  return rateios.length ? `Rateios: ${rateios.map((r) => r.nome).join(", ")}` : "Todos os rateios";
}

/** Opções do MultiSelect: valor = id, rótulo = nome. */
export function rateioOptions(rateios: RateioFiltro[] | undefined) {
  return (rateios ?? []).map((r) => ({ value: r.id, label: r.nome }));
}
