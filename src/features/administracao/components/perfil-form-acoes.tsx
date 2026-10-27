import { Button } from "@/shared/components/ui/button";

export interface PerfilFormAcoesProps {
  readOnly?: boolean;
  editando: boolean;
  marcadas: number;
  isLoading?: boolean;
  onCancel: () => void;
}

/** Barra fixa no rodapé da tela: os botões ficam sempre à mão, mesmo no meio da matriz. */
export function PerfilFormAcoes({ readOnly, editando, marcadas, isLoading, onCancel }: PerfilFormAcoesProps) {
  return (
    <div className="sticky bottom-3 z-20 flex flex-col gap-3 rounded-xl border border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        <span className="font-semibold tabular-nums text-foreground">{marcadas}</span>{" "}
        {marcadas === 1 ? "permissão marcada" : "permissões marcadas"}
      </p>
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="flex-1 sm:flex-none">
          {readOnly ? "Voltar" : "Cancelar"}
        </Button>
        {!readOnly && (
          <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1 sm:flex-none">
            {editando ? "Salvar alterações" : "Criar perfil"}
          </Button>
        )}
      </div>
    </div>
  );
}
