import { useOrders } from "@/api/hooks/orders/use-orders";
import { OrdersTable } from "@/components/dashboard/tables/orders-table/table";
import { usePagination } from "@/hooks/use-pagination";

export const Orders = () => {
  const pagination = usePagination();
  const { data: orders, isPending } = useOrders({
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
