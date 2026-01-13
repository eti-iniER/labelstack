import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export type DataTableOptions<TData> = Partial<{
  className: string;
  actionsColumn: ColumnDef<TData>;
  onRowClick: (row: TData) => void;
  useAvailableHeight: boolean;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  showSerialNumbers: boolean;
  fixedHeader: boolean;
  rowSkeleton: React.ComponentType;
  rowSkeletonCount: number;
  selectable: boolean;
  selectedPropertyKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelectionChange: (selectedValues: any[]) => void;
}>;

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  isLoading?: boolean;
  options?: DataTableOptions<TData>;
}

export function DataTable<TData>({
  data,
  columns,
  isLoading = false,
  options = {},
}: DataTableProps<TData>) {
  const {
    className,
    actionsColumn,
    onRowClick,
    useAvailableHeight = false,
    totalCount = data.length,
    currentPage = 1,
    pageSize = 10,
    onPageChange = () => {},
    onPageSizeChange = () => {},
    showSerialNumbers = false,
    fixedHeader = false,
    rowSkeleton,
    rowSkeletonCount = 5,
    selectable = false,
    selectedPropertyKey = "id",
    onSelectionChange = () => {},
  } = options;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const checkboxColumn: ColumnDef<TData> = {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 50,
    enableSorting: false,
  };

  const serialNumberColumn: ColumnDef<TData> = {
    id: "serial",
    header: "#",
    size: 50,
    enableSorting: false,
    cell: ({ row }) => {
      const serialNumber = (currentPage - 1) * pageSize + row.index + 1;
      return <div className="text-sm text-gray-600">{serialNumber}.</div>;
    },
  };

  const allColumns = [
    ...(selectable ? [checkboxColumn] : []),
    ...(showSerialNumbers ? [serialNumberColumn] : []),
    ...columns,
    ...(actionsColumn ? [actionsColumn] : []),
  ];

  const table = useReactTable({
    data,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: (updater) => {
      const newSelection =
        typeof updater === "function" ? updater(rowSelection) : updater;
      setRowSelection(newSelection);

      if (selectable) {
        const selectedIds = Object.keys(newSelection).filter(
          (key) => newSelection[key],
        );
        onSelectionChange(selectedIds);
      }
    },
    state: { sorting, rowSelection },
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pageSize),
    enableRowSelection: selectable,
    getRowId: selectable
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (row) => String((row as any)[selectedPropertyKey])
      : undefined,
  });
  const { rows } = table.getRowModel();
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5,
  });
  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);
  const canPreviousPage = currentPage > 1;
  const canNextPage = currentPage < totalPages;

  return (
    <div
      className={cn(
        "space-y-4",
        useAvailableHeight && "flex h-full flex-col",
        className,
      )}
    >
      <div
        className={cn(
          "overflow-hidden rounded-md border",
          useAvailableHeight && "flex flex-1 flex-col",
        )}
      >
        <div
          ref={parentRef}
          className={cn(
            "relative overflow-auto",
            useAvailableHeight && "h-full",
          )}
          style={
            useAvailableHeight
              ? { contain: "strict" }
              : { height: "600px", contain: "strict" }
          }
        >
          {isLoading ? (
            rowSkeleton ? (
              <div
                style={{
                  height: `${60}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                <div
                  className={cn(
                    "flex w-full items-center border-b bg-gray-50",
                    fixedHeader && "sticky",
                  )}
                  style={{
                    height: "60px",
                    minWidth: "fit-content",
                    position: fixedHeader ? "sticky" : "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 10,
                  }}
                >
                  {table.getHeaderGroups().map((headerGroup) =>
                    headerGroup.headers.map((header) => (
                      <div
                        key={header.id}
                        className="flex items-center bg-gray-50 p-2 text-sm font-medium text-gray-700"
                        style={{
                          width: `${header.getSize()}px`,
                          minWidth: `${header.getSize()}px`,
                          flexShrink: 0,
                          height: "100%",
                        }}
                      >
                        {!header.isPlaceholder &&
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      </div>
                    )),
                  )}
                </div>
                {Array.from({ length: rowSkeletonCount }, (_, i) => {
                  const SkeletonComponent = rowSkeleton;
                  return (
                    <div
                      key={`skeleton-row-${i}`}
                      className="absolute left-0 flex w-full border-b"
                      style={{
                        height: "60px",
                        transform: `translateY(${i * 60}px)`,
                        minWidth: "fit-content",
                      }}
                    >
                      <SkeletonComponent />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                className={cn(
                  "flex items-center justify-center",
                  useAvailableHeight ? "h-full" : "h-32",
                )}
              >
                <div className="text-gray-600">Loading...</div>
              </div>
            )
          ) : rows.length === 0 ? (
            <div
              className={cn(
                "flex items-center justify-center",
                useAvailableHeight ? "h-full" : "h-48",
              )}
            >
              <div className="text-sm text-gray-500 italic">No data found</div>
            </div>
          ) : (
            <div
              style={{
                height: `${virtualizer.getTotalSize() + 60}px`,
                width: "100%",
                position: "relative",
              }}
            >
              <div
                className={cn(
                  "flex w-full items-center border-b bg-gray-50",
                  fixedHeader && "sticky",
                )}
                style={{
                  height: "60px",
                  minWidth: "fit-content",
                  position: fixedHeader ? "sticky" : "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 10,
                }}
              >
                {table.getHeaderGroups().map((headerGroup) =>
                  headerGroup.headers.map((header) => (
                    <div
                      key={header.id}
                      className="flex items-center bg-gray-50 p-2 text-sm font-medium text-gray-700"
                      style={{
                        width: `${header.getSize()}px`,
                        minWidth: `${header.getSize()}px`,
                        flexShrink: 0,
                        height: "100%",
                      }}
                    >
                      {!header.isPlaceholder &&
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </div>
                  )),
                )}
              </div>
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                  <div
                    key={row.id}
                    className={cn(
                      "absolute left-0 flex w-full border-b bg-white transition-colors hover:bg-gray-50",
                      onRowClick && "cursor-pointer",
                    )}
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start + (fixedHeader ? 0 : 60)}px)`,
                      minWidth: "fit-content",
                    }}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <div
                        key={cell.id}
                        className="flex items-center p-2"
                        style={{
                          width: `${cell.column.getSize()}px`,
                          minWidth: `${cell.column.getSize()}px`,
                          flexShrink: 0,
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-600">
            Showing {startItem} to {endItem} of {totalCount} results
          </p>
          <Select
            value={pageSize.toString()}
            onValueChange={(v) => onPageSizeChange(Number(v))}
          >
            <SelectTrigger className="h-8 w-17.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600">per page</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canPreviousPage}
          >
            <LuChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-600">Page</span>
            <span className="text-sm font-medium">
              {currentPage} of {totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canNextPage}
          >
            Next <LuChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
