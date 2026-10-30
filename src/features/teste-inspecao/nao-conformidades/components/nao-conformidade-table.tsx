import * as React from "react";
import { Edit2, Eye, Trash2 } from "lucide-react";
import type { PageResult } from "@/shared/types";
import type { NaoConformidadeResponse } from "../types";
import { DataTable, type Column } from "@/shared/components/data-table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { PermissionGate } from "@/features/auth/components/permission-gate";
import { formatDateBR, formatNumber } from "@/shared/lib/utils";

export interface NaoConformidadeTableProps {
  data?: PageResult<NaoConformidadeResponse> | null;
  isLoading?: boolean;
  emptyMessage?: string;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  onView: (naoConformidade: NaoConformidadeResponse) => void;
  onEdit: (naoConformidade: NaoConformidadeResponse) => void;
  onDelete: (naoConformidade: NaoConformidadeResponse) => void;
}

const excluido = <span className="text-xs text-muted-foreground">Excluído</span>;

/** Mesmas colunas da planilha exportada (departamento no lugar do número da operação). */
export function NaoConformidadeTable({
  data,
  isLoading,
  emptyMessage = "Nenhuma não conformidade encontrada.",
  onPageChange,
  onSizeChange,
  onView,
  onEdit,
  onDelete,
}: NaoConformidadeTableProps) {
  const columns: Column<NaoConformidadeResponse>[] = React.useMemo(
    () => [
      {
        key: "op",
        header: "OP",
        width: "120px",
        cell: (item) =>
          item.ordemDeProducao ? (
            <span className="font-mono text-sm font-semibold text-primary">{item.ordemDeProducao.codigo}</span>
          ) : (
            excluido
          ),
      },
      {
        key: "descricao",
        header: "Descrição",
        hideBelow: "md",
        cell: (item) => {
          const op = item.ordemDeProducao;
          if (!op?.materialCodigo) return <span className="text-xs text-muted-foreground">-</span>;
          return (
            <div>
              <div className="font-mono text-xs text-foreground">{op.materialCodigo}</div>
              <div className="max-w-[14rem] truncate text-xs text-muted-foreground" title={op.materialDescricao ?? ""}>
                {op.materialDescricao}
              </div>
            </div>
          );
        },
      },
      {
        key: "cliente",
        header: "Cliente",
        hideBelow: "lg",
        cell: (item) => <span className="text-foreground">{item.ordemDeProducao?.clienteNome ?? "-"}</span>,
      },
      {
        key: "entrega",
        header: "Data entrega",
        hideBelow: "xl",
        className: "whitespace-nowrap",
        cell: (item) => formatDateBR(item.ordemDeProducao?.previsao),
      },
      {
        key: "qtdOp",
        header: "Qtd OP",
        hideBelow: "xl",
        align: "right",
        cell: (item) => (item.ordemDeProducao ? formatNumber(item.ordemDeProducao.quantidade, 4) : "-"),
      },
      {
        key: "qtdNc",
        header: "Qtd não conforme",
        align: "right",
        cell: (item) => (
          <span className="font-semibold text-danger">{formatNumber(item.quantidadeNaoConforme, 4)}</span>
        ),
      },
      {
        key: "tipo",
        header: "Não conformidade",
        cell: (item) => (item.tipo ? <Badge variant="warning">{item.tipo.nome}</Badge> : excluido),
      },
      {
        key: "departamento",
        header: "Departamento",
        hideBelow: "sm",
        cell: (item) => <span className="text-foreground">{item.departamento?.nome ?? "-"}</span>,
      },
      {
        key: "data",
        header: "Data",
        className: "whitespace-nowrap",
        cell: (item) => formatDateBR(item.dataNaoConformidade),
      },
      {
        key: "acoes",
        header: "Ações",
        width: "140px",
        align: "right",
        cell: (item) => {
          const nome = item.ordemDeProducao?.codigo ?? "não conformidade";
          return (
            <div className="flex items-center justify-end gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(item)}
                title="Ver detalhes e anexos"
                aria-label={`Ver ${nome}`}
                className="h-8 w-8 p-0 text-muted-foreground hover:bg-primary/10 hover:text-primary"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <PermissionGate permission="teste-inspecao.nao-conformidade:update">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(item)}
                  title="Editar não conformidade"
                  aria-label={`Editar ${nome}`}
                  className="h-8 w-8 p-0 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </PermissionGate>
              <PermissionGate permission="teste-inspecao.nao-conformidade:delete">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(item)}
                  title="Excluir não conformidade"
                  aria-label={`Excluir ${nome}`}
                  className="h-8 w-8 p-0 text-muted-foreground hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </PermissionGate>
            </div>
          );
        },
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
      emptyMessage={emptyMessage}
    />
  );
}
