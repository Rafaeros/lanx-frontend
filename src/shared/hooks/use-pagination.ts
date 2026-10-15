import { useState, useCallback } from "react";

export interface PaginationOptions {
  initialPage?: number;
  initialSize?: number;
}

export function usePagination({
  initialPage = 0,
  initialSize = 10,
}: PaginationOptions = {}) {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);

  const nextPage = useCallback(() => setPage((prev) => prev + 1), []);
  const prevPage = useCallback(() => setPage((prev) => Math.max(0, prev - 1)), []);
  const goToPage = useCallback((newPage: number) => setPage(Math.max(0, newPage)), []);
  const resetPage = useCallback(() => setPage(0), []);

  return {
    page,
    size,
    setPage: goToPage,
    setSize,
    nextPage,
    prevPage,
    resetPage,
  };
}

