import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { formatDateBR, formatNumber } from "@/shared/lib/utils";
import { useNaoConformidadeQuery } from "../hooks/use-nao-conformidades";
import { AnexosGaleria } from "./anexos-galeria";

export interface NaoConformidadeDetalheProps {
  id: string;
}

function Campo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="truncate text-sm text-foreground">{children || "-"}</dd>
    </div>
  );
}

/** Dados da NC e da OP, com os anexos em miniaturas (clique para visualizar). */
export function NaoConformidadeDetalhe({ id }: NaoConformidadeDetalheProps) {
  const { data: nc, isLoading, isError, error } = useNaoConformidadeQuery(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (isError || !nc) {
    return (
      <p className="py-6 text-center text-sm text-danger">
        {getApiErrorMessage(error, "Não foi possível carregar a não conformidade.")}
      </p>
    );
  }

  const op = nc.ordemDeProducao;
  const anexos = nc.anexos ?? [];

  return (
    <div className="space-y-5">
      <dl className="grid gap-x-4 gap-y-3 sm:grid-cols-3">
        <Campo label="Não conformidade">{nc.tipo?.nome}</Campo>
        <Campo label="Qtd não conforme">{formatNumber(nc.quantidadeNaoConforme, 4)}</Campo>
        <Campo label="Data">{formatDateBR(nc.dataNaoConformidade)}</Campo>
        <Campo label="Departamento">{nc.departamento?.nome}</Campo>
        <Campo label="Operador">{nc.operador?.nome}</Campo>
      </dl>

      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ordem de produção</h3>
        <dl className="grid gap-x-4 gap-y-3 rounded-xl border border-border p-3 sm:grid-cols-3">
          <Campo label="OP">{op?.codigo}</Campo>
          <Campo label="Descrição">
            {op?.materialCodigo && (
              <span title={op.materialDescricao ?? ""}>
                {op.materialCodigo}
                {op.materialDescricao && <span className="text-muted-foreground"> · {op.materialDescricao}</span>}
              </span>
            )}
          </Campo>
          <Campo label="Cliente">{op?.clienteNome}</Campo>
          <Campo label="Data entrega">{op && formatDateBR(op.previsao)}</Campo>
          <Campo label="Qtd OP">{op && formatNumber(op.quantidade, 4)}</Campo>
        </dl>
      </section>

      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Anexos ({anexos.length})
        </h3>
        <AnexosGaleria naoConformidadeId={nc.id} anexos={anexos} />
      </section>
    </div>
  );
}
