import { useOrders } from "@/api/hooks/orders/use-orders";
import { type OrderFilters } from "@/api/types/orders";
import { type UploadSpreadsheetData } from "@/app/dashboard/upload-spreadsheet/types";
import { useMultiPageFormContext } from "@/components/dashboard/multi-page-form";
import { OrdersTable } from "@/components/dashboard/tables/orders-table/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFilters } from "@/hooks/use-filters";
import { usePagination } from "@/hooks/use-pagination";
import { TbArrowLeft, TbArrowRight, TbX } from "react-icons/tb";

export const ReviewAndEdit = () => {
  const multiPageForm = useMultiPageFormContext<UploadSpreadsheetData>();
  const { filters, debouncedFilters, setFilter, resetFilters } =
    useFilters<OrderFilters>(
      {
        jobId: multiPageForm.data.jobId,
      },
      {
        debounceDuration: 300,
      },
    );
  const pagination = usePagination();
  const { data: orders, isPending } = useOrders({
    filters: debouncedFilters,
    pagination: pagination.params,
  });
  return (
    <div className="flex h-full w-full flex-1 flex-col gap-2">
      <div className="flex max-w-md items-center gap-2">
        <Input
          type="text"
          placeholder="Search orders by address, recipient, or order number..."
          value={filters.search || ""}
          onChange={(e) => setFilter("search", e.target.value)}
        />
        <Button
          variant="default"
          onClick={resetFilters}
          disabled={!filters.search}
        >
          <TbX className="size-4" />
        </Button>
      </div>
      <OrdersTable
        isLoading={isPending}
        totalCount={orders?.count ?? 0}
        data={orders?.results ?? []}
        pagination={pagination}
      />
      <div className="flex flex-row items-center justify-center gap-2">
        <Button variant="outline" onClick={multiPageForm.previous}>
          <TbArrowLeft className="size-4" />
          Previous step
        </Button>
        <Button onClick={multiPageForm.next}>
          Next step
          <TbArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
};
