import type { Order } from "@/api/types/orders";
import { DataTable } from "@/components/data-table/table";
import type { usePagination } from "@/hooks/use-pagination";
import { ordersColumns } from "./columns";

interface OrdersTableProps {
  data: Order[];
  isLoading?: boolean;
  totalCount: number;
  pagination: ReturnType<typeof usePagination>;
}

export function OrdersTable({
  data,
  isLoading,
  totalCount,
  pagination,
}: OrdersTableProps) {
  return (
    <DataTable
      data={data}
      columns={ordersColumns}
      isLoading={isLoading}
      options={{
        totalCount,
        currentPage: pagination.params.page,
        pageSize: pagination.params.pageSize,
        onPageChange: pagination.setPage,
        onPageSizeChange: pagination.setSize,
        showSerialNumbers: true,
        fixedHeader: true,
        useAvailableHeight: true,
      }}
    />
  );
}
