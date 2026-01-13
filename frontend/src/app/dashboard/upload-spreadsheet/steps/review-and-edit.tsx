import { useOrders } from "@/api/hooks/orders/use-orders";
import { type OrderFilters } from "@/api/types/orders";
import { type UploadSpreadsheetData } from "@/app/dashboard/upload-spreadsheet/types";
import { useMultiPageFormContext } from "@/components/dashboard/multi-page-form";
import { OrdersTable } from "@/components/dashboard/tables/orders-table/table";
import { useFilters } from "@/hooks/use-filters";
import { usePagination } from "@/hooks/use-pagination";

export const ReviewAndEdit = () => {
  const multiPageForm = useMultiPageFormContext<UploadSpreadsheetData>();
  const { filters } = useFilters<OrderFilters>({
    jobId: multiPageForm.data.jobId,
  });
  const pagination = usePagination();
  const { data: orders, isPending } = useOrders({
    filters,
    pagination: pagination.params,
  });
  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <OrdersTable
        isLoading={isPending}
        totalCount={orders?.count ?? 0}
        data={orders?.results ?? []}
        pagination={pagination}
      />
    </div>
  );
};
