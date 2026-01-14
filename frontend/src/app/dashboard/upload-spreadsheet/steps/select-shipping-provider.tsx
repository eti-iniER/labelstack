import { useOrders } from "@/api/hooks/orders/use-orders";
import { type UploadSpreadsheetData } from "@/app/dashboard/upload-spreadsheet/types";
import { useMultiPageFormContext } from "@/components/dashboard/multi-page-form";
import { SelectShippingProviderTable } from "@/components/dashboard/tables/select-shipping-provider-table/table";
import { Button } from "@/components/ui/button";
import { usePagination } from "@/hooks/use-pagination";
import { TbArrowLeft, TbArrowRight } from "react-icons/tb";

export const SelectShippingProvider = () => {
  const multiPageForm = useMultiPageFormContext<UploadSpreadsheetData>();
  const pagination = usePagination();
  const { data: orders, isPending } = useOrders({
    filters: {
      job: multiPageForm.data.job,
    },
    pagination: pagination.params,
  });

  return (
    <div className="flex h-full w-full flex-1 flex-col gap-2">
      <SelectShippingProviderTable
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
