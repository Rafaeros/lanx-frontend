import * as React from "react";
import type { MaterialResponse, PageResult } from "@/shared/api/schema";
import { DataTable, type Column } from "@/shared/components/data-table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { PermissionGate } from "@/features/auth/components/permission-gate";
import { Eye, Edit2, Trash2 } from "lucide-react";

export interface MaterialTableProps {
  data?: PageResult<MaterialResponse> | null;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  onView: (material: MaterialResponse) => void;
  onEdit: (material: MaterialResponse) => void;
  onDelete: (material: MaterialResponse) => void;
}

export function MaterialTable({
  data,
  isLoading,
  onPageChange,
  onSizeChange,
  onView,
  onEdit,
  onDelete,
}: MaterialTableProps) {
  const columns: Column<MaterialResponse>[] = React.useMemo(
    () => [
      {
        key: "codigo",
        header: "Código",
        width: "180px",
        cell: (item) => (
          <span className="font-mono text-xs font-semibold text-[var(--brand-purple)] bg-[var(--brand-purple)]/5 px-2.5 py-1 rounded-md border border-[var(--brand-purple)]/15">
            {item.codigo}
          </span>
        ),
      },
      {
        key: "descricao",
        header: "Descrição do Material",
        cell: (item) => (
          <div className="font-medium text-[var(--foreground)] pr-4">
            {item.descricao}
          </div>
        ),
      },
      {
        key: "unidadeMedida",
        header: "Unidade",
        width: "150px",
        cell: (item) => (
          <Badge variant="secondary" className="font-mono font-medium">
            {item.unidadeMedida?.sigla ? item.unidadeMedida.sigla.toUpperCase() : "-"}
            {item.unidadeMedida?.nome && item.unidadeMedida.nome !== item.unidadeMedida.sigla
              ? ` (${item.unidadeMedida.nome})`
              : ""}
          </Badge>
        ),
      },
      {
        key: "acoes",
        header: "Ações",
        width: "140px",
        align: "right",
        cell: (item) => (
          <div className="flex items-center justify-end gap-1">
            {/* Botão Visualizar Modal */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(item)}
              title="Visualizar detalhes do material"
              className="h-8 w-8 p-0 text-[var(--muted-foreground)] hover:text-[var(--brand-blue)] hover:bg-[var(--brand-blue)]/10"
              aria-label="Visualizar material"
            >
              <Eye className="h-4 w-4" />
            </Button>

            {/* Botão Editar Modal */}
            <PermissionGate permission="cadastros.materiais:update">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(item)}
                title="Editar material"
                className="h-8 w-8 p-0 text-[var(--muted-foreground)] hover:text-[var(--brand-purple)] hover:bg-[var(--brand-purple)]/10"
                aria-label="Editar material"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </PermissionGate>

            {/* Botão Excluir Modal */}
            <PermissionGate permission="cadastros.materiais:delete">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(item)}
                title="Excluir material"
                className="h-8 w-8 p-0 text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-500/10"
                aria-label="Excluir material"
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
      emptyMessage="Nenhum material encontrado com os filtros aplicados."
    />
  );
}
