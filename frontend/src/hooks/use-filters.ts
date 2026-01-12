import { useDebounce } from "@uidotdev/usehooks";
import { useState } from "react";

interface UseFiltersOptions {
  debounceDuration?: number;
}

export function useFilters<T extends Record<string, unknown>>(
  initialFilters = {} as T,
  options: UseFiltersOptions = {},
) {
  const { debounceDuration = 0 } = options;
  const [filters, setFilters] = useState(initialFilters);
  const debouncedFilters = useDebounce(filters, debounceDuration);

  const setFilter = <K extends keyof T>(key: K, value: T[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(initialFilters);

  return {
    filters,
    debouncedFilters,
    setFilter,
    resetFilters,
  };
}
