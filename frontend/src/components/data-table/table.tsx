import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type {
  ColumnDef,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useMemo, useRef, useState, type HTMLProps } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export type BatchAction<TData = unknown> = {
  id: string;
  label: string;
  onSelect: (selectedRows: TData[]) => void;
  isDestructive?: boolean;
};

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={cn("accent-primary size-4 cursor-pointer", className)}
      {...rest}
    />
  );
}

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
  onSelectionChange: (selectedRows: TData[]) => void;
  batchActions: BatchAction<TData>[];
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
    pageSize = 50,
    onPageChange = () => {},
    onPageSizeChange = () => {},
    showSerialNumbers = false,
    fixedHeader = false,
    rowSkeleton,
    rowSkeletonCount = 20,
    selectable = false,
    selectedPropertyKey = "id",
    onSelectionChange = () => {},
    batchActions = [],
  } = options;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedBatchAction, setSelectedBatchAction] = useState<string>("");
  const parentRef = useRef<HTMLDivElement>(null);

  const allColumns = useMemo<ColumnDef<TData>[]>(() => {
    const checkboxColumn: ColumnDef<TData> = {
      id: "select",
      header: ({ table }) => (
        <IndeterminateCheckbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <IndeterminateCheckbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          indeterminate={row.getIsSomeSelected()}
          onChange={row.getToggleSelectedHandler()}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()}
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
        return <div className="text-sm text-neutral-600">{serialNumber}.</div>;
      },
    };

    return [
      ...(selectable ? [checkboxColumn] : []),
      ...(showSerialNumbers ? [serialNumberColumn] : []),
      ...columns,
      ...(actionsColumn ? [actionsColumn] : []),
    ];
  }, [
    columns,
    selectable,
    showSerialNumbers,
    actionsColumn,
    currentPage,
    pageSize,
  ]);

  const table = useReactTable({
    data,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
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
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 20,
  });

  useEffect(() => {
    if (selectable) {
      const selectedRows = table
        .getSelectedRowModel()
        .rows.map((row) => row.original);
      onSelectionChange(selectedRows);
    }
  }, [rowSelection, selectable, onSelectionChange, table]);

  useEffect(() => {
    table.resetRowSelection(true);
  }, [data, table]);

  useEffect(() => {
    virtualizer.scrollToOffset(0);
  }, [currentPage, data, virtualizer]);

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
                    "flex w-full items-center border-b bg-neutral-200",
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
                        className="flex items-center p-2 text-sm font-semibold text-neutral-900"
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
                <div className="text-neutral-600">Loading...</div>
              </div>
            )
          ) : rows.length === 0 ? (
            <div
              className={cn(
                "flex items-center justify-center",
                useAvailableHeight ? "h-full" : "h-48",
              )}
            >
              <div className="text-sm text-neutral-500 italic">
                No data found
              </div>
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
                  "flex w-full items-center border-b bg-neutral-200",
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
                      className="flex items-center p-2 text-sm font-semibold text-neutral-900"
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
                      "absolute left-0 flex w-full border-b transition-colors",
                      onRowClick && "cursor-pointer",
                      virtualRow.index % 2 === 0 ? "bg-white" : "bg-neutral-50",
                      row.getIsSelected()
                        ? "hover:bg-blue-150! bg-blue-100!"
                        : "hover:bg-blue-50",
                    )}
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start + (fixedHeader ? 0 : 60)}px)`,
                      minWidth: "fit-content",
                      willChange: "transform",
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
          <p className="text-sm text-neutral-600">
            Showing {startItem} to {endItem} of {totalCount} results
          </p>
          <Select
            value={pageSize.toString()}
            onValueChange={(v) => onPageSizeChange(Number(v))}
          >
            <SelectTrigger className="h-8 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" side="top">
              {[20, 50, 100, 200, 500].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-neutral-600">per page</span>
        </div>
        <div className="flex items-center space-x-2">
          {selectable && table.getSelectedRowModel().rows.length > 0 && (
            <>
              <p className="text-sm font-medium text-neutral-700">
                {table.getSelectedRowModel().rows.length} selected
              </p>
              {batchActions.length > 0 && (
                <>
                  <Select
                    value={selectedBatchAction}
                    onValueChange={setSelectedBatchAction}
                  >
                    <SelectTrigger className="h-8 w-40">
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent position="popper" side="top">
                      {batchActions.map((action) => (
                        <SelectItem key={action.id} value={action.id}>
                          {action.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant={
                      batchActions.find((a) => a.id === selectedBatchAction)
                        ?.isDestructive
                        ? "destructive"
                        : "default"
                    }
                    disabled={!selectedBatchAction}
                    onClick={() => {
                      const action = batchActions.find(
                        (a) => a.id === selectedBatchAction,
                      );
                      if (action) {
                        const selectedRows = table
                          .getSelectedRowModel()
                          .rows.map((row) => row.original);
                        action.onSelect(selectedRows);
                      }
                    }}
                  >
                    Execute
                  </Button>
                </>
              )}
            </>
          )}
        </div>
        <div className="flex items-center space-x-2 select-none">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canPreviousPage}
          >
            <LuChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <div className="flex items-center space-x-1">
            <span className="text-sm text-neutral-600">Page</span>
            <span className="text-sm font-medium">{currentPage}</span>
            <span className="text-sm text-neutral-600">of</span>
            <span className="text-sm font-medium">{totalPages}</span>
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
