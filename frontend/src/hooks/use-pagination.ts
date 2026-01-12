import type { PaginationParams } from "@/api/types/global";
import { useDebounce } from "@uidotdev/usehooks";
import { useState } from "react";

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  debounceDuration?: number;
}

export function usePagination({
  initialPage = 1,
  initialPageSize = 20,
  debounceDuration = 0,
}: UsePaginationOptions = {}) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const pagination: PaginationParams = {
    page: currentPage,
    pageSize,
  };

  const debouncedPagination = useDebounce(pagination, debounceDuration);

  const setPage = (page: number) => setCurrentPage(page);

  const setSize = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    pagination,
    debouncedPagination,
    setPage,
    setSize,
  };
}
