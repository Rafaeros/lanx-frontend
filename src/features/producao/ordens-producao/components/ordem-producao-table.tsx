import * as React from "react";
import { Edit2, Trash2 } from "lucide-react";
import type { PageResult } from "@/shared/types";
import type { OrdemProducaoResponse } from "../types";
import { DataTable, type Column } from "@/shared/components/data-table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { PermissionGate } from "@/features/auth/components/permission-gate";
import { formatDateBR, formatNumber } from "@/shared/lib/utils";
import { situacaoPrevisao } from "../lib/previsao";

export interface OrdemProducaoTableProps {
  data?: PageResult<OrdemProducaoResponse> | null;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  onEdit: (ordem: OrdemProducaoResponse) => void;
  onDelete: (ordem: OrdemProducaoResponse) => void;
}

export function OrdemProducaoTable({
  data,
  isLoading,
  onPageChange,
  onSizeChange,
  onEdit,
  onDelete,
}: OrdemProducaoTableProps) {
  const columns: Column<OrdemProducaoResponse>[] = React.useMemo(
    () => [
      {
        key: "codigo",
        header: "OP",
        width: "120px",
        cell: (item) => <span className="font-mono text-sm font-semibold text-primary">{item.codigo}</span>,
      },
      {
        key: "produto",
        header: "Produto",
        cell: (item) =>
          item.material ? (
            <div>
              <div className="font-mono text-xs text-foreground">{item.material.codigo}</div>
              <div className="max-w-[18rem] truncate text-xs text-muted-foreground" title={item.material.descricao}>
                {item.material.descricao}
              </div>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Material excluído</span>
          ),
      },
      {
        key: "cliente",
        hideBelow: "md",
        header: "Cliente",
        cell: (item) => <span className="text-foreground">{item.cliente?.nome}</span>,
      },
      {
        key: "quantidade",
        hideBelow: "sm",
        header: "Quantidade",
        align: "right",
        className: "whitespace-nowrap",
        cell: (item) => (
          <span>
            {formatNumber(item.quantidade, 4)} <span className="text-xs text-muted-foreground">{item.material?.unidadeMedida}</span>
          </span>
        ),
      },
      {
        key: "previsao",
        header: "Previsão",
        className: "whitespace-nowrap",
        cell: (item) => {
          const situacao = situacaoPrevisao(item.previsao);
          return (
            <div className="flex items-center gap-2">
              <span>{formatDateBR(item.previsao)}</span>
              {situacao && <Badge variant={situacao.variant}>{situacao.label}</Badge>}
            </div>
          );
        },
      },
      {
        key: "etapa",
        hideBelow: "lg",
        header: "Etapa atual",
        cell: (item) =>
          item.etapaAtual ? (
            <Badge variant="brand">{item.etapaAtual}</Badge>
          ) : (
            <span className="text-xs text-muted-foreground">Não iniciada</span>
          ),
      },
      {
        key: "acoes",
        header: "Ações",
        width: "120px",
        align: "right",
        cell: (item) => (
          <div className="flex items-center justify-end gap-1">
            <PermissionGate permission="producao.ordens-producao:update">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(item)}
                title="Editar ordem de produção"
                aria-label={`Editar ${item.codigo}`}
                className="h-8 w-8 p-0 text-muted-foreground hover:bg-primary/10 hover:text-primary"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </PermissionGate>
            <PermissionGate permission="producao.ordens-producao:delete">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(item)}
                title="Excluir ordem de produção"
                aria-label={`Excluir ${item.codigo}`}
                className="h-8 w-8 p-0 text-muted-foreground hover:bg-danger/10 hover:text-danger"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </PermissionGate>
          </div>
        ),
      },
    ],
    [onEdit, onDelete]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      onPageChange={onPageChange}
      onSizeChange={onSizeChange}
      emptyMessage="Nenhuma ordem de produção encontrada."
    />
  );
}
