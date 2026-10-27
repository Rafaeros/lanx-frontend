import { Search, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Segmented } from "@/shared/components/ui/segmented";
import { cn } from "@/shared/lib/utils";
import { SITUACOES, type SituacaoFiltro } from "../lib/carteira";

export interface CarteiraFiltrosTabelaProps {
  busca: string;
  onBuscaChange: (busca: string) => void;
  situacao: SituacaoFiltro;
  onSituacaoChange: (situacao: SituacaoFiltro) => void;
  /** Quantos itens do período caem em cada situação. */
  contagens: Record<SituacaoFiltro, number>;
  onLimpar: () => void;
}

/** Filtros da tabela: trabalham sobre os dados já carregados, sem consultar o ERP de novo. */
export function CarteiraFiltrosTabela({
  busca,
  onBuscaChange,
  situacao,
  onSituacaoChange,
  contagens,
  onLimpar,
}: CarteiraFiltrosTabelaProps) {
  const temFiltro = !!busca || situacao !== "todos";

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="min-w-0 flex-1">
        <Input
          aria-label="Buscar na carteira"
          placeholder="Buscar cliente, OP, produto ou pedido"
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
          className="h-9"
        />
      </div>
      <div className="flex items-center gap-2">
        <Segmented<SituacaoFiltro>
          label="Situação"
          value={situacao}
          onChange={onSituacaoChange}
          stretch
          className="w-full lg:w-auto"
          options={SITUACOES.map((s) => ({
            id: s.id,
            label: (
              <>
                {s.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[10px] font-semibold tabular-nums",
                    situacao === s.id ? "bg-white/20" : "bg-muted text-muted-foreground"
                  )}
                >
                  {contagens[s.id]}
                </span>
              </>
            ),
          }))}
        />
        {temFiltro && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onLimpar}
            className="h-9 shrink-0 text-muted-foreground"
            title="Limpar busca e situação"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Limpar</span>
          </Button>
        )}
      </div>
    </div>
  );
}
