import * as React from "react";
import { Edit2, Trash2 } from "lucide-react";
import type { PageResult } from "@/shared/types";
import type { OperadorResponse } from "../types";
import { DataTable, type Column } from "@/shared/components/data-table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { PermissionGate } from "@/features/auth/components/permission-gate";

export interface OperadorTableProps {
  data?: PageResult<OperadorResponse> | null;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  onEdit: (operador: OperadorResponse) => void;
  onDelete: (operador: OperadorResponse) => void;
}

export function OperadorTable({ data, isLoading, onPageChange, onSizeChange, onEdit, onDelete }: OperadorTableProps) {
  const columns: Column<OperadorResponse>[] = React.useMemo(
    () => [
      {
        key: "nome",
        header: "Operador",
        cell: (item) => <span className="font-medium text-foreground">{item.nome}</span>,
      },
      {
        key: "departamento",
        hideBelow: "sm",
        header: "Departamento",
        width: "240px",
        cell: (item) =>
          item.departamento ? (
            <Badge variant="secondary">{item.departamento.nome}</Badge>
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          ),
      },
      {
        key: "acoes",
        header: "Ações",
        width: "120px",
        align: "right",
        cell: (item) => (
          <div className="flex items-center justify-end gap-1">
            <PermissionGate permission="cadastros.operadores:update">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(item)}
                title="Editar operador"
                aria-label={`Editar ${item.nome}`}
                className="h-8 w-8 p-0 text-muted-foreground hover:bg-primary/10 hover:text-primary"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </PermissionGate>
            <PermissionGate permission="cadastros.operadores:delete">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(item)}
                title="Excluir operador"
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
      emptyMessage="Nenhum operador encontrado."
    />
  );
}
