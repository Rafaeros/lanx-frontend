import * as React from "react";
import { Edit2, Trash2 } from "lucide-react";
import type { PageResult } from "@/shared/types";
import type { UnidadeMedidaResponse } from "../types";
import { DataTable, type Column } from "@/shared/components/data-table";
import { Button } from "@/shared/components/ui/button";
import { PermissionGate } from "@/features/auth/components/permission-gate";

export interface UnidadeMedidaTableProps {
  data?: PageResult<UnidadeMedidaResponse> | null;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  onEdit: (unidade: UnidadeMedidaResponse) => void;
  onDelete: (unidade: UnidadeMedidaResponse) => void;
}

export function UnidadeMedidaTable({
  data,
  isLoading,
  onPageChange,
  onSizeChange,
  onEdit,
  onDelete,
}: UnidadeMedidaTableProps) {
  const columns: Column<UnidadeMedidaResponse>[] = React.useMemo(
    () => [
      {
        key: "sigla",
        header: "Sigla",
        width: "140px",
        cell: (item) => (
          <span className="rounded-md border border-primary/15 bg-primary/5 px-2.5 py-1 font-mono text-xs font-semibold text-primary">
            {item.sigla.toUpperCase()}
          </span>
        ),
      },
      {
        key: "nome",
        header: "Nome",
        cell: (item) => <span className="font-medium text-foreground">{item.nome}</span>,
      },
      {
        key: "acoes",
        header: "Ações",
        width: "120px",
        align: "right",
        cell: (item) => (
          <div className="flex items-center justify-end gap-1">
            <PermissionGate permission="cadastros.unidade-medida:update">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(item)}
                title="Editar unidade"
                aria-label={`Editar ${item.nome}`}
                className="h-8 w-8 p-0 text-muted-foreground hover:bg-primary/10 hover:text-primary"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </PermissionGate>
            <PermissionGate permission="cadastros.unidade-medida:delete">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(item)}
                title="Excluir unidade"
                aria-label={`Excluir ${item.nome}`}
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
      emptyMessage="Nenhuma unidade de medida encontrada."
    />
  );
}
