import * as React from "react";
import { Info } from "lucide-react";
import type { AnalisePedidoResponse } from "../types";
import type { PageResult } from "@/shared/types";
import { DataTable, type Column } from "@/shared/components/data-table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { formatCurrency, formatDateBR, formatNumber } from "@/shared/lib/utils";
import { SITUACAO_BADGE, SITUACAO_LABELS, situacaoDe } from "../lib/situacao";

export interface AnalisePedidosTableProps {
  data?: PageResult<AnalisePedidoResponse> | null;
  isLoading?: boolean;
  emptyMessage: string;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  onDetails: (pedido: AnalisePedidoResponse) => void;
}

export function AnalisePedidosTable({
  data,
  isLoading,
  emptyMessage,
  onPageChange,
  onSizeChange,
  onDetails,
}: AnalisePedidosTableProps) {
  const columns: Column<AnalisePedidoResponse>[] = React.useMemo(
    () => [
      {
        key: "pedido",
        header: "Pedido / RC",
        className: "whitespace-nowrap",
        cell: (p) => (
          <div>
            <div className="font-semibold text-foreground">{p.pedidoDeCompra}</div>
            <div className="text-xs text-muted-foreground">{p.requisicaoDeCompra || "Sem RC"}</div>
          </div>
        ),
      },
      {
        key: "emissao",
        hideBelow: "md",
        header: "Emissão",
        className: "whitespace-nowrap",
        cell: (p) => (
          <div>
            <div>{formatDateBR(p.dataEmissaoPc)}</div>
            <div className="text-xs text-muted-foreground">
              {p.dataEntregaPc ? `Entregue ${formatDateBR(p.dataEntregaPc)}` : `Prev. ${formatDateBR(p.dataPrevisaoEntregaPc)}`}
            </div>
          </div>
        ),
      },
      {
        key: "fornecedor",
        header: "Fornecedor",
        cell: (p) => (
          <div className="max-w-[12rem]">
            <div className="font-medium text-foreground">{p.fornecedor?.nome || "-"}</div>
            <div className="text-xs text-muted-foreground">{p.comprador}</div>
          </div>
        ),
      },
      {
        key: "item",
        hideBelow: "lg",
        header: "Item",
        cell: (p) => (
          <div>
            <div className="font-mono text-xs text-primary">{p.material?.codigo}</div>
            <div className="max-w-[15rem] truncate text-xs text-muted-foreground" title={p.material?.descricao}>
              {p.material?.descricao}
            </div>
          </div>
        ),
      },
      {
        key: "quantidade",
        hideBelow: "xl",
        header: "Atend. / Solic.",
        align: "right",
        className: "whitespace-nowrap",
        cell: (p) => (
          <span className="tabular-nums">
            {formatNumber(p.quantidadeAtendida)} / {formatNumber(p.quantidadeSolicitada)}{" "}
            <span className="text-xs text-muted-foreground">{p.unidadeMedida?.sigla}</span>
          </span>
        ),
      },
      {
        key: "situacao",
        header: "Situação",
        align: "center",
        cell: (p) => {
          const situacao = situacaoDe(p);
          return (
            <div className="flex flex-col items-center gap-0.5">
              <Badge variant={SITUACAO_BADGE[situacao]}>{SITUACAO_LABELS[situacao]}</Badge>
              {situacao !== "ATENDIDO" && (p.saldo ?? 0) > 0 && (
                <span className="whitespace-nowrap text-[11px] text-muted-foreground">
                  saldo {formatNumber(p.saldo)} {p.unidadeMedida?.sigla}
                </span>
              )}
            </div>
          );
        },
      },
      {
        key: "valor",
        hideBelow: "sm",
        header: "Valor total",
        align: "right",
        className: "whitespace-nowrap",
        cell: (p) => <span className="font-semibold tabular-nums">{formatCurrency(p.valorTotal)}</span>,
      },
      {
        key: "acoes",
        header: "",
        align: "right",
        width: "48px",
        className: "pl-0 pr-2",
        cell: (p) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDetails(p)}
            title="Ver detalhes"
            aria-label={`Ver detalhes do pedido ${p.pedidoDeCompra ?? ""}`}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
          >
            <Info className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [onDetails]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      onPageChange={onPageChange}
      onSizeChange={onSizeChange}
      emptyMessage={emptyMessage}
      getRowKey={(p, idx) => p.id ?? `${p.pedidoDeCompra}-${p.material?.codigo}-${idx}`}
    />
  );
}
