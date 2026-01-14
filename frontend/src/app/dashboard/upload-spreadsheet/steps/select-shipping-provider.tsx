import { useJob } from "@/api/hooks/jobs/use-job";
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
  const jobId = multiPageForm.data.job;
  const { data: job } = useJob(jobId);
  const { data: orders, isPending } = useOrders({
    filters: {
      job: jobId,
    },
    pagination: pagination.params,
  });

  return (
    <div className="flex h-full w-full flex-1 flex-col gap-2 p-2">
      <div className="flex items-center justify-between px-2">
        <p className="text-muted-foreground text-sm">
          Total cost:{" "}
          <span className="text-foreground font-medium">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(Number(job?.totalCost ?? 0))}
          </span>
        </p>
      </div>
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
