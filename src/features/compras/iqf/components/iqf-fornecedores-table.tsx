import * as React from "react";
import { Check, Eye, X } from "lucide-react";
import type { IqfFornecedorResponse } from "../types";
import type { PageResult } from "@/shared/types";
import { DataTable, type Column } from "@/shared/components/data-table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { FAIXA_BADGE, FAIXA_LABELS, FAIXA_TONE, META_FORNECEDOR, formatPercentual } from "../lib/classificacao";

export interface IqfFornecedoresTableProps {
  data?: PageResult<IqfFornecedorResponse> | null;
  isLoading?: boolean;
  emptyMessage: string;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  /** Abre o IQF mês a mês do fornecedor. */
  onView: (fornecedor: IqfFornecedorResponse) => void;
}

export function IqfFornecedoresTable({
  data,
  isLoading,
  emptyMessage,
  onPageChange,
  onSizeChange,
  onView,
}: IqfFornecedoresTableProps) {
  const columns: Column<IqfFornecedorResponse>[] = React.useMemo(
    () => [
      {
        key: "fornecedor",
        header: "Fornecedor",
        cell: (f) => <div className="max-w-[18rem] font-medium text-foreground">{f.fornecedor || "-"}</div>,
      },
      {
        key: "avaliadas",
        hideBelow: "md",
        header: "Avaliadas",
        align: "right",
        className: "tabular-nums",
        cell: (f) => f.entregasAvaliadas,
      },
      {
        key: "noPrazo",
        hideBelow: "lg",
        header: "No prazo",
        align: "right",
        className: "tabular-nums text-success",
        cell: (f) => f.entregasNoPrazo,
      },
      {
        key: "atrasadas",
        hideBelow: "lg",
        header: "Atrasadas",
        align: "right",
        className: "tabular-nums",
        cell: (f) => <span className={f.entregasAtrasadas > 0 ? "text-danger" : undefined}>{f.entregasAtrasadas}</span>,
      },
      {
        key: "iqf",
        header: "IQF",
        width: "14rem",
        cell: (f) => {
          const faixa = f.classificacao?.faixa;
          if (f.percentualNoPrazo == null || !faixa) {
            return <span className="text-xs text-muted-foreground">Sem entregas avaliadas</span>;
          }
          return (
            <div className="flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted" aria-hidden>
                <div
                  className={`h-full rounded-full ${FAIXA_TONE[faixa].bar}`}
                  style={{ width: `${Math.min(100, Math.max(0, f.percentualNoPrazo))}%` }}
                />
              </div>
              <span className={`w-16 text-right font-semibold tabular-nums ${FAIXA_TONE[faixa].text}`}>
                {formatPercentual(f.percentualNoPrazo)}
              </span>
            </div>
          );
        },
      },
      {
        key: "meta",
        hideBelow: "sm",
        header: `Meta ${META_FORNECEDOR}%`,
        className: "whitespace-nowrap",
        cell: (f) =>
          f.atingiuMeta == null ? (
            <span className="text-xs text-muted-foreground">-</span>
          ) : f.atingiuMeta ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
              <Check className="h-3.5 w-3.5" /> Atingida
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-danger">
              <X className="h-3.5 w-3.5" /> Abaixo
            </span>
          ),
      },
      {
        key: "classificacao",
        header: "Classificação",
        className: "whitespace-nowrap",
        cell: (f) =>
          f.classificacao ? (
            <Badge variant={FAIXA_BADGE[f.classificacao.faixa]}>{FAIXA_LABELS[f.classificacao.faixa]}</Badge>
          ) : (
            <Badge variant="secondary">Não avaliado</Badge>
          ),
      },
      {
        key: "acoes",
        header: "Ações",
        width: "80px",
        align: "right",
        cell: (f) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(f)}
            title="Ver IQF mês a mês deste fornecedor"
            aria-label={`Ver IQF mês a mês de ${f.fornecedor}`}
            className="h-8 w-8 p-0 text-muted-foreground hover:bg-primary/10 hover:text-primary"
          >
            <Eye className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [onView]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      emptyMessage={emptyMessage}
      onPageChange={onPageChange}
      onSizeChange={onSizeChange}
      getRowKey={(f) => f.fornecedorId}
    />
  );
}
