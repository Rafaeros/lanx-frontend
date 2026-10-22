import * as React from "react";
import { Edit2, Trash2, UserRoundCheck } from "lucide-react";
import type { PageResult } from "@/shared/types";
import type { CompradorResponse } from "../types";
import { DataTable, type Column } from "@/shared/components/data-table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { PermissionGate } from "@/features/auth/components/permission-gate";

export interface CompradorTableProps {
  data?: PageResult<CompradorResponse> | null;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  onEdit: (comprador: CompradorResponse) => void;
  onDelete: (comprador: CompradorResponse) => void;
}

export function CompradorTable({ data, isLoading, onPageChange, onSizeChange, onEdit, onDelete }: CompradorTableProps) {
  const columns: Column<CompradorResponse>[] = React.useMemo(
    () => [
      {
        key: "nome",
        header: "Comprador (ERP)",
        cell: (item) => <span className="font-medium text-foreground">{item.nome}</span>,
      },
      {
        key: "usuario",
        hideBelow: "sm",
        header: "Usuário do LANX",
        width: "240px",
        cell: (item) =>
          item.usuario ? (
            <span className="inline-flex items-center gap-1.5 text-sm text-foreground">
              <UserRoundCheck className="h-4 w-4 text-success" aria-hidden="true" />
              {item.usuario.username}
            </span>
          ) : (
            <Badge variant="secondary">Sem vínculo</Badge>
          ),
      },
      {
        key: "acoes",
        header: "Ações",
        width: "120px",
        align: "right",
        cell: (item) => (
          <div className="flex items-center justify-end gap-1">
            <PermissionGate permission="cadastros.compradores:update">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(item)}
                title="Editar comprador"
                aria-label={`Editar ${item.nome}`}
                className="h-8 w-8 p-0 text-muted-foreground hover:bg-primary/10 hover:text-primary"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </PermissionGate>
            <PermissionGate permission="cadastros.compradores:delete">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(item)}
                title="Excluir comprador"
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
      emptyMessage="Nenhum comprador encontrado."
    />
  );
}
