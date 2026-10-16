import type { PageResult } from "@/shared/types";

/** Pagina uma lista já carregada em memória, no mesmo formato que a API devolve. */
export function paginate<T>(items: T[], page: number, size: number): PageResult<T> {
  const start = page * size;
  return {
    items: items.slice(start, start + size),
    page,
    size,
    totalElements: items.length,
    totalPages: Math.ceil(items.length / size) || 1,
  };
}
