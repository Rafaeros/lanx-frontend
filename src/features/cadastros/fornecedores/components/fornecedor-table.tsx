import * as React from "react";
import type { FornecedorResponse } from "../types";
import type { PageResult } from "@/shared/types";
import { DataTable, type Column } from "@/shared/components/data-table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { PermissionGate } from "@/features/auth/components/permission-gate";
import { Eye, Edit2, Trash2 } from "lucide-react";

export interface FornecedorTableProps {
  data?: PageResult<FornecedorResponse> | null;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  onView: (fornecedor: FornecedorResponse) => void;
  onEdit: (fornecedor: FornecedorResponse) => void;
  onDelete: (fornecedor: FornecedorResponse) => void;
}

export function FornecedorTable({
  data,
  isLoading,
  onPageChange,
  onSizeChange,
  onView,
  onEdit,
  onDelete,
}: FornecedorTableProps) {
  const columns: Column<FornecedorResponse>[] = React.useMemo(
    () => [
      {
        key: "nome",
        header: "Fornecedor",
        cell: (item) => <div className="font-medium text-foreground pr-4">{item.nome}</div>,
      },
      {
        key: "pais",
        hideBelow: "sm",
        header: "País",
        width: "220px",
        cell: (item) =>
          item.pais ? (
            <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap">
              <Badge variant="secondary" className="font-mono">
                {item.pais.codigoIso2}
              </Badge>
              <span className="text-xs text-muted-foreground">{item.pais.nome}</span>
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          ),
      },
      {
        key: "acoes",
        header: "Ações",
        width: "140px",
        align: "right",
        cell: (item) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(item)}
              title="Visualizar detalhes do fornecedor"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-info hover:bg-info/10"
              aria-label="Visualizar fornecedor"
            >
              <Eye className="h-4 w-4" />
            </Button>

            <PermissionGate permission="cadastros.fornecedores:update">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(item)}
                title="Editar fornecedor"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                aria-label="Editar fornecedor"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </PermissionGate>

            <PermissionGate permission="cadastros.fornecedores:delete">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(item)}
                title="Excluir fornecedor"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-danger hover:bg-danger/10"
                aria-label="Excluir fornecedor"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </PermissionGate>
          </div>
        ),
      },
    ],
    [onView, onEdit, onDelete]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      onPageChange={onPageChange}
      onSizeChange={onSizeChange}
      emptyMessage="Nenhum fornecedor encontrado com os filtros aplicados."
    />
  );
}
