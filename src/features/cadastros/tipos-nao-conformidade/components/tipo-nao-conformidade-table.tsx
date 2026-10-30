import * as React from "react";
import { Edit2, Trash2 } from "lucide-react";
import type { PageResult } from "@/shared/types";
import type { TipoNaoConformidadeResponse } from "../types";
import { DataTable, type Column } from "@/shared/components/data-table";
import { Button } from "@/shared/components/ui/button";
import { PermissionGate } from "@/features/auth/components/permission-gate";

export interface TipoNaoConformidadeTableProps {
  data?: PageResult<TipoNaoConformidadeResponse> | null;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  onEdit: (tipo: TipoNaoConformidadeResponse) => void;
  onDelete: (tipo: TipoNaoConformidadeResponse) => void;
}

export function TipoNaoConformidadeTable({
  data,
  isLoading,
  onPageChange,
  onSizeChange,
  onEdit,
  onDelete,
}: TipoNaoConformidadeTableProps) {
  const columns: Column<TipoNaoConformidadeResponse>[] = React.useMemo(
    () => [
      {
        key: "nome",
        header: "Não conformidade",
        cell: (item) => <span className="font-medium text-foreground">{item.nome}</span>,
      },
      {
        key: "acoes",
        header: "Ações",
        width: "120px",
        align: "right",
        cell: (item) => (
          <div className="flex items-center justify-end gap-1">
            <PermissionGate permission="cadastros.tipos-nao-conformidade:update">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(item)}
                title="Editar tipo de não conformidade"
                aria-label={`Editar ${item.nome}`}
                className="h-8 w-8 p-0 text-muted-foreground hover:bg-primary/10 hover:text-primary"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </PermissionGate>
            <PermissionGate permission="cadastros.tipos-nao-conformidade:delete">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(item)}
                title="Excluir tipo de não conformidade"
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
      emptyMessage="Nenhum tipo de não conformidade encontrado."
    />
  );
}
