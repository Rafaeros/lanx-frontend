import type { TipoMaterial } from "../types";

/** Rótulos dos tipos (espelha o enum TipoMaterial e o check ck_materiais_tipo do backend). */
export const TIPOS_MATERIAL: { value: TipoMaterial; label: string; description: string }[] = [
  { value: "MATERIA_PRIMA", label: "Matéria-prima", description: "Comprado e consumido na produção" },
  { value: "PRODUTO_ACABADO", label: "Produto acabado", description: "Produzido e vendido ao cliente" },
];

export function tipoMaterialLabel(tipo: TipoMaterial | null | undefined): string {
  return TIPOS_MATERIAL.find((t) => t.value === tipo)?.label ?? "Matéria-prima";
}
