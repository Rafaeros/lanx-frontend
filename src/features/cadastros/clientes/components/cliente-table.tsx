import * as React from "react";
import { Edit2, Trash2 } from "lucide-react";
import type { PageResult } from "@/shared/types";
import type { ClienteResponse } from "../types";
import { DataTable, type Column } from "@/shared/components/data-table";
import { Button } from "@/shared/components/ui/button";
import { PermissionGate } from "@/features/auth/components/permission-gate";
import { formatCnpj } from "../lib/cnpj";

export interface ClienteTableProps {
  data?: PageResult<ClienteResponse> | null;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  onEdit: (cliente: ClienteResponse) => void;
  onDelete: (cliente: ClienteResponse) => void;
}

export function ClienteTable({
  data,
  isLoading,
  onPageChange,
  onSizeChange,
  onEdit,
  onDelete,
}: ClienteTableProps) {
  const columns: Column<ClienteResponse>[] = React.useMemo(
    () => [
      {
        key: "nome",
        header: "Cliente",
        cell: (item) => <span className="font-medium text-foreground">{item.nome}</span>,
      },
      {
        key: "cnpj",
        hideBelow: "sm",
        header: "CNPJ",
        width: "200px",
        cell: (item) =>
          item.cnpj ? (
            <span className="font-mono text-xs text-muted-foreground">{formatCnpj(item.cnpj)}</span>
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
            <PermissionGate permission="cadastros.clientes:update">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(item)}
                title="Editar cliente"
                aria-label={`Editar ${item.nome}`}
                className="h-8 w-8 p-0 text-muted-foreground hover:bg-primary/10 hover:text-primary"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </PermissionGate>
            <PermissionGate permission="cadastros.clientes:delete">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(item)}
                title="Excluir cliente"
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
      emptyMessage="Nenhum cliente encontrado."
    />
  );
}
