import { UserRoundCheck } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";

/** Célula de tabela do vínculo com usuário do LANX: o username ou "Sem vínculo". */
export function UsuarioVinculoBadge({ usuario }: { usuario?: { username: string } | null }) {
  if (!usuario) {
    return <Badge variant="secondary">Sem vínculo</Badge>;
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-foreground">
      <UserRoundCheck className="h-4 w-4 text-success" aria-hidden="true" />
      {usuario.username}
    </span>
  );
}
