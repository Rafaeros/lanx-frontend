export const soDigitos = (texto: string) => texto.replace(/\D/g, "");

/** "11222333000181" → "11.222.333/0001-81"; enquanto incompleto, mascara só o que já foi digitado. */
export function formatCnpj(valor?: string | null): string {
  const d = soDigitos(valor ?? "").slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}
