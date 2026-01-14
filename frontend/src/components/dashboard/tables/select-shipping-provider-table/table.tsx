import { useDeleteOrder } from "@/api/hooks/orders/use-delete-order";
import { useBatchDelete } from "@/api/hooks/orders/use-batch-delete";
import { useBatchUpdateShippingProvider } from "@/api/hooks/orders/use-batch-update-shipping-provider";
import { useUpdateOrder } from "@/api/hooks/orders/use-update-order";
import type { Order } from "@/api/types/orders";
import { DataTable, type BatchAction } from "@/components/data-table/table";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagination } from "@/hooks/use-pagination";
import { useModal } from "@/hooks/use-modal";
import { selectShippingProviderColumns } from "./columns";
import { ConfirmOrderDeletionModal } from "@/components/dashboard/modals/confirm-order-deletion-modal";
import { ConfirmBatchOrderDeletionModal } from "@/components/dashboard/modals/confirm-batch-order-deletion-modal";
import { BatchUpdateShippingProviderModal } from "@/components/dashboard/modals/batch-update-shipping-provider-modal";
import { useCallback, useMemo, useState } from "react";
import { SelectShippingProviderTableContext } from "./context";
import { toast } from "sonner";

function OrderRowSkeleton() {
  return (
    <>
      <div
        className="flex items-center p-2"
        style={{ width: 50, minWidth: 50 }}
      >
        <Skeleton className="size-4" />
      </div>
      <div
        className="flex items-center p-2"
        style={{ width: 50, minWidth: 50 }}
      >
        <Skeleton className="h-4 w-6" />
      </div>
      <div
        className="flex items-center p-2"
        style={{ width: 100, minWidth: 100 }}
      >
        <Skeleton className="h-4 w-16" />
      </div>
      <div
        className="flex items-center p-2"
        style={{ width: 150, minWidth: 150 }}
      >
        <Skeleton className="h-4 w-24" />
      </div>
      <div
        className="flex items-center p-2"
        style={{ width: 150, minWidth: 150 }}
      >
        <Skeleton className="h-4 w-24" />
      </div>
      <div
        className="flex flex-col justify-center gap-1 p-2"
        style={{ width: 200, minWidth: 200 }}
      >
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div
        className="flex flex-col justify-center gap-1 p-2"
        style={{ width: 200, minWidth: 200 }}
      >
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div
        className="flex flex-col justify-center gap-1 p-2"
        style={{ width: 150, minWidth: 150 }}
      >
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div
        className="flex items-center p-2"
        style={{ width: 150, minWidth: 150 }}
      >
        <Skeleton className="h-4 w-20" />
      </div>
      <div
        className="flex items-center p-2"
        style={{ width: 200, minWidth: 200 }}
      >
        <Skeleton className="h-9 w-45" />
      </div>
      <div
        className="flex items-center p-2"
        style={{ width: 80, minWidth: 80 }}
      >
        <Skeleton className="size-8" />
      </div>
    </>
  );
}

interface SelectShippingProviderTableProps {
  data: Order[];
  isLoading?: boolean;
  totalCount: number;
  pagination: ReturnType<typeof usePagination>;
}

export function SelectShippingProviderTable({
  data,
  isLoading,
  totalCount,
  pagination,
}: SelectShippingProviderTableProps) {
  const { isOpen: isDeleteModalOpen, onOpenChange: setDeleteModalOpen } =
    useModal();
  const {
    isOpen: isBatchDeleteModalOpen,
    onOpenChange: setBatchDeleteModalOpen,
  } = useModal();
  const {
    isOpen: isBatchUpdateShippingProviderModalOpen,
    onOpenChange: setBatchUpdateShippingProviderModalOpen,
  } = useModal();
  const [selectedOrderForDeletion, setSelectedOrderForDeletion] =
    useState<Order | null>(null);
  const [selectedOrdersForBatch, setSelectedOrdersForBatch] = useState<Order[]>(
    [],
  );
  const [
    selectedOrdersForShippingProviderUpdate,
    setSelectedOrdersForShippingProviderUpdate,
  ] = useState<Order[]>([]);

  const deleteOrder = useDeleteOrder();
  const batchDelete = useBatchDelete();
  const batchUpdateShippingProvider = useBatchUpdateShippingProvider();
  const updateOrder = useUpdateOrder();

  const handleDeleteOrder = useCallback(
    (order: Order) => {
      setSelectedOrderForDeletion(order);
      setDeleteModalOpen(true);
    },
    [setDeleteModalOpen],
  );

  const handleConfirmDelete = useCallback(() => {
    if (!selectedOrderForDeletion) return;
    deleteOrder.mutate(selectedOrderForDeletion.id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setSelectedOrderForDeletion(null);
        toast.success("Order deleted successfully");
      },
    });
  }, [selectedOrderForDeletion, deleteOrder, setDeleteModalOpen]);

  const handleBatchDelete = useCallback(
    (orders: Order[]) => {
      setSelectedOrdersForBatch(orders);
      setBatchDeleteModalOpen(true);
    },
    [setBatchDeleteModalOpen],
  );

  const handleConfirmBatchDelete = useCallback(() => {
    const orderIds = selectedOrdersForBatch.map((order) => order.id);
    batchDelete.mutate(orderIds, {
      onSuccess: () => {
        setBatchDeleteModalOpen(false);
        setSelectedOrdersForBatch([]);
        toast.success("Orders deleted successfully");
      },
    });
  }, [selectedOrdersForBatch, batchDelete, setBatchDeleteModalOpen]);

  const handleShippingProviderChange = useCallback(
    (orderId: number, provider: { id: number; name: string }) => {
      updateOrder.mutate(
        { orderId, shippingProviderId: provider.id },
        {
          onSuccess: () => {
            toast.success(`Shipping provider updated to ${provider.name}`);
          },
        },
      );
    },
    [updateOrder],
  );

  const handleBatchUpdateShippingProvider = useCallback(
    (orders: Order[]) => {
      setSelectedOrdersForShippingProviderUpdate(orders);
      setBatchUpdateShippingProviderModalOpen(true);
    },
    [setBatchUpdateShippingProviderModalOpen],
  );

  const handleConfirmBatchUpdateShippingProvider = useCallback(
    (shippingProviderId: number) => {
      const orderIds = selectedOrdersForShippingProviderUpdate.map(
        (order) => order.id,
      );
      batchUpdateShippingProvider.mutate(
        { orderIds, shippingProviderId },
        {
          onSuccess: () => {
            setBatchUpdateShippingProviderModalOpen(false);
            setSelectedOrdersForShippingProviderUpdate([]);
            toast.success("Shipping provider updated successfully");
          },
        },
      );
    },
    [
      selectedOrdersForShippingProviderUpdate,
      batchUpdateShippingProvider,
      setBatchUpdateShippingProviderModalOpen,
    ],
  );

  const contextValue = useMemo(
    () => ({
      onDeleteOrder: handleDeleteOrder,
      onShippingProviderChange: handleShippingProviderChange,
    }),
    [handleDeleteOrder, handleShippingProviderChange],
  );

  const batchActions: BatchAction<Order>[] = useMemo(
    () => [
      {
        id: "batch-update-shipping-provider",
        label: "Update shipping provider",
        onSelect: handleBatchUpdateShippingProvider,
      },
      {
        id: "batch-delete",
        label: "Delete orders",
        onSelect: handleBatchDelete,
        isDestructive: true,
      },
    ],
    [handleBatchUpdateShippingProvider, handleBatchDelete],
  );

  return (
    <SelectShippingProviderTableContext.Provider value={contextValue}>
      <DataTable
        data={data}
        columns={selectShippingProviderColumns}
        isLoading={isLoading}
        options={{
          selectable: true,
          totalCount,
          currentPage: pagination.params.page,
          pageSize: pagination.params.pageSize,
          onPageChange: pagination.setPage,
          onPageSizeChange: pagination.setSize,
          showSerialNumbers: false,
          fixedHeader: true,
          useAvailableHeight: true,
          rowSkeleton: OrderRowSkeleton,
          batchActions,
        }}
      />

      {isDeleteModalOpen && (
        <ConfirmOrderDeletionModal
          open={isDeleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          order={selectedOrderForDeletion}
          onConfirm={handleConfirmDelete}
        />
      )}

      {isBatchDeleteModalOpen && (
        <ConfirmBatchOrderDeletionModal
          open={isBatchDeleteModalOpen}
          onOpenChange={setBatchDeleteModalOpen}
          orders={selectedOrdersForBatch}
          onConfirm={handleConfirmBatchDelete}
        />
      )}

      {isBatchUpdateShippingProviderModalOpen && (
        <BatchUpdateShippingProviderModal
          open={isBatchUpdateShippingProviderModalOpen}
          onOpenChange={setBatchUpdateShippingProviderModalOpen}
          orderCount={selectedOrdersForShippingProviderUpdate.length}
          onSave={handleConfirmBatchUpdateShippingProvider}
          isSavePending={batchUpdateShippingProvider.isPending}
        />
      )}
    </SelectShippingProviderTableContext.Provider>
  );
}
