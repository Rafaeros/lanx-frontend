import { Badge } from "@/shared/components/ui/badge";
import type { TipoMaterial } from "../types";
import { tipoMaterialLabel } from "../lib/tipo-material";

export function TipoMaterialBadge({ tipo }: { tipo?: TipoMaterial | null }) {
  return (
    <Badge variant={tipo === "PRODUTO_ACABADO" ? "brand" : "secondary"} className="whitespace-nowrap">
      {tipoMaterialLabel(tipo)}
    </Badge>
  );
}
