import * as React from "react";
import { PackageCheck, PackageX } from "lucide-react";
import type { CarteiraItemResponse } from "../types";
import type { PageResult } from "@/shared/types";
import { DataTable, type Column } from "@/shared/components/data-table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { formatCurrency, formatDateBR, formatNumber } from "@/shared/lib/utils";
import { materiaisTexto } from "../lib/carteira";

export interface CarteiraTableProps {
  data?: PageResult<CarteiraItemResponse> | null;
  emptyMessage: string;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  /** Abre a lista de materiais pendentes do pedido. */
  onVerMateriais: (item: CarteiraItemResponse) => void;
}

export function CarteiraTable({ data, emptyMessage, onPageChange, onSizeChange, onVerMateriais }: CarteiraTableProps) {
  const columns: Column<CarteiraItemResponse>[] = React.useMemo(
    () => [
      {
        key: "previsao",
        header: "Previsão",
        className: "whitespace-nowrap",
        cell: (i) => (
          <div className="space-y-1">
            <span className={`tabular-nums ${i.atrasado ? "font-semibold text-danger" : "text-foreground"}`}>
              {formatDateBR(i.previsao)}
            </span>
            {i.atrasado && (
              <div>
                <Badge variant="danger">Atrasado</Badge>
              </div>
            )}
          </div>
        ),
      },
      {
        key: "pedido",
        header: "Pedido",
        className: "whitespace-nowrap",
        cell: (i) => (
          <div>
            <p className="font-medium tabular-nums text-foreground">{i.negociacao ?? "-"}</p>
            {i.pedidoCliente && <p className="text-xs text-muted-foreground">Cliente: {i.pedidoCliente}</p>}
          </div>
        ),
      },
      {
        key: "op",
        header: "OP",
        className: "whitespace-nowrap font-medium tabular-nums",
        cell: (i) => i.ordem || <span className="text-muted-foreground">-</span>,
      },
      {
        key: "cliente",
        header: "Cliente",
        hideBelow: "md",
        cell: (i) => <div className="max-w-[16rem] truncate" title={i.cliente}>{i.cliente || "-"}</div>,
      },
      {
        key: "produto",
        header: "Produto",
        cell: (i) => (
          <div className="max-w-[14rem] sm:max-w-[20rem]">
            <p className="font-medium text-foreground">{i.codigo || "-"}</p>
            <p className="truncate text-xs text-muted-foreground" title={i.descricao}>
              {i.descricao}
            </p>
            {/* colunas Cliente/Valor ficam ocultas em telas menores: resumo aqui */}
            {i.cliente && <p className="mt-0.5 truncate text-xs text-foreground md:hidden">{i.cliente}</p>}
            <p className="text-xs font-medium tabular-nums text-foreground lg:hidden">{formatCurrency(i.valorTotal)}</p>
          </div>
        ),
      },
      {
        key: "tipo",
        header: "Tipo",
        hideBelow: "xl",
        className: "whitespace-nowrap",
        cell: (i) => i.tipoServico || "-",
      },
      {
        key: "pendente",
        header: "Pendente",
        hideBelow: "lg",
        align: "right",
        className: "tabular-nums",
        cell: (i) => formatNumber(i.pendente, 4),
      },
      {
        key: "valor",
        header: "Valor total",
        hideBelow: "lg",
        align: "right",
        className: "whitespace-nowrap tabular-nums",
        cell: (i) => formatCurrency(i.valorTotal),
      },
      {
        key: "etapa",
        header: "Etapa atual",
        hideBelow: "sm",
        cell: (i) =>
          i.etapaAtual ? <Badge variant="brand">{i.etapaAtual}</Badge> : <span className="text-xs text-muted-foreground">-</span>,
      },
      {
        key: "materiais",
        header: "Materiais",
        align: "right",
        cell: (i) =>
          i.materiaisPendentes.length === 0 ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
              <PackageCheck className="h-3.5 w-3.5" /> Completo
            </span>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onVerMateriais(i)}
              title="Ver materiais pendentes desta OP"
              className="h-8 gap-1 whitespace-nowrap px-2 text-warning hover:bg-warning/10 hover:text-warning"
            >
              <PackageX className="h-4 w-4" />
              {materiaisTexto(i.materiaisPendentes.length)}
            </Button>
          ),
      },
    ],
    [onVerMateriais]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      emptyMessage={emptyMessage}
      onPageChange={onPageChange}
      onSizeChange={onSizeChange}
      getRowKey={(i, index) => `${i.negociacao ?? "sem"}-${i.ordem ?? ""}-${i.codigo ?? ""}-${index}`}
    />
  );
}
