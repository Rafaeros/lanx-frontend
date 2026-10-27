import * as React from "react";
import type { PageResult } from "@/shared/types";
import { Button } from "../ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Inbox,
  Loader2,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  cell: (item: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  width?: string;
  /** Esconde a coluna abaixo do breakpoint (telas menores ficam só com o essencial). */
  hideBelow?: "sm" | "md" | "lg" | "xl";
}

const HIDE_BELOW: Record<NonNullable<Column<unknown>["hideBelow"]>, string> = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
  xl: "hidden xl:table-cell",
};

export interface DataTableProps<T> {
  columns: Column<T>[];
  data?: PageResult<T> | null;
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onSizeChange?: (size: number) => void;
  emptyMessage?: string;
  className?: string;
  /** Chave da linha; padrão: `id` do item ou o índice. */
  getRowKey?: (item: T, index: number) => React.Key;
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  onPageChange,
  onSizeChange,
  emptyMessage = "Nenhum registro encontrado.",
  className,
  getRowKey,
}: DataTableProps<T>) {
  const items = data?.items || [];
  const totalElements = data?.totalElements ?? items.length;
  const currentPage = data?.page ?? 0;
  const pageSize = data?.size ?? 20;
  const totalPages = data?.totalPages ?? (Math.ceil(totalElements / pageSize) || 1);

  const startRecord = totalElements === 0 ? 0 : currentPage * pageSize + 1;
  const endRecord = Math.min((currentPage + 1) * pageSize, totalElements);

  // Gera números de página com reticências para navegação inteligente
  const pageNumbers = React.useMemo(() => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      const left = Math.max(0, currentPage - 1);
      const right = Math.min(totalPages - 1, currentPage + 1);

      if (left > 0) {
        pages.push(0);
        if (left > 1) pages.push("...");
      }

      for (let i = left; i <= right; i++) {
        pages.push(i);
      }

      if (right < totalPages - 1) {
        if (right < totalPages - 2) pages.push("...");
        pages.push(totalPages - 1);
      }
    }
    return pages;
  }, [totalPages, currentPage]);

  return (
    // Dentro de um PageShell `fill`, ocupa o espaço que sobra na tela (mínimo de 18rem) e só as linhas rolam
    <div className={cn("flex w-full flex-col gap-3 lg:min-h-72 lg:flex-1", className)}>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xs">
        {/* só o eixo X fica contido: com o Y contido, a roda do mouse sobre a tabela não rolava a página */}
        <div className="min-h-0 flex-1 overflow-auto overscroll-x-contain">
          <table className="w-full min-w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 bg-muted text-xs font-semibold text-muted-foreground shadow-[inset_0_-1px_0_var(--card-border)]">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    style={{ width: col.width }}
                    className={cn(
                      "px-4 py-3.5 whitespace-nowrap",
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right",
                      col.hideBelow && HIDE_BELOW[col.hideBelow],
                      col.className
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="h-56 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="text-sm font-medium">Carregando...</span>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="h-56 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                      <Inbox className="h-10 w-10 stroke-[1.5]" />
                      <p className="text-sm font-medium">{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((row, idx) => (
                  <tr
                    key={getRowKey ? getRowKey(row, idx) : ((row as { id?: React.Key }).id ?? idx)}
                    className="hover:bg-muted/50 transition-colors group"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "px-4 py-3 text-sm text-foreground",
                          col.align === "center" && "text-center",
                          col.align === "right" && "text-right",
                          col.hideBelow && HIDE_BELOW[col.hideBelow],
                          col.className
                        )}
                      >
                        {col.cell(row, idx)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Barra de Paginação Completa e Responsiva */}
      {data && (
        <div className="flex shrink-0 flex-col items-center justify-between gap-3 px-1 py-1 text-sm text-muted-foreground md:flex-row">
          {/* Contador e Seletor de Tamanho */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            <span>
              Exibindo <strong className="text-foreground">{startRecord}</strong> a{" "}
              <strong className="text-foreground">{endRecord}</strong> de{" "}
              <strong className="text-foreground">{totalElements}</strong> registros
            </span>

            {onSizeChange && (
              <div className="flex items-center gap-1.5 ml-2 border-l border-border pl-3">
                <span className="text-xs">Por página:</span>
                <select
                  value={pageSize}
                  onChange={(e) => onSizeChange(Number(e.target.value))}
                  className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground focus:ring-2 focus:ring-ring focus:outline-none cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            )}
          </div>

          {/* Navegação de Páginas com Botões Numéricos */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Primeira Página */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(0)}
              disabled={currentPage <= 0 || isLoading}
              className="h-8 w-8 p-0"
              title="Primeira página"
              aria-label="Primeira página"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>

            {/* Página Anterior */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage <= 0 || isLoading}
              className="h-8 w-8 p-0"
              title="Página anterior"
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Números das Páginas */}
            <div className="hidden sm:flex items-center gap-1">
              {pageNumbers.map((p, idx) => {
                if (typeof p === "string") {
                  return (
                    <span key={`dots-${idx}`} className="px-2 text-xs text-muted-foreground">
                      ...
                    </span>
                  );
                }

                const isCurrent = p === currentPage;
                return (
                  <Button
                    key={p}
                    variant={isCurrent ? "primary" : "outline"}
                    size="sm"
                    onClick={() => onPageChange?.(p)}
                    disabled={isLoading}
                    className={cn(
                      "h-8 min-w-[32px] px-2 text-xs font-medium",
                      isCurrent && "shadow-xs font-bold"
                    )}
                  >
                    {p + 1}
                  </Button>
                );
              })}
            </div>

            {/* Indicador simples para mobile */}
            <span className="sm:hidden px-2 text-xs font-medium">
              {currentPage + 1} / {Math.max(1, totalPages)}
            </span>

            {/* Próxima Página */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage >= totalPages - 1 || isLoading}
              className="h-8 w-8 p-0"
              title="Próxima página"
              aria-label="Próxima página"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Última Página */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(totalPages - 1)}
              disabled={currentPage >= totalPages - 1 || isLoading}
              className="h-8 w-8 p-0"
              title="Última página"
              aria-label="Última página"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
