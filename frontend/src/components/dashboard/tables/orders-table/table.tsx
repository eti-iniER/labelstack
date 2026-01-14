import { useUpdateAddress } from "@/api/hooks/orders/use-update-address";
import { useUpdatePackage } from "@/api/hooks/orders/use-update-package";
import { useDeleteOrder } from "@/api/hooks/orders/use-delete-order";
import { useBatchUpdateAddress } from "@/api/hooks/orders/use-batch-update-address";
import { useBatchUpdatePackage } from "@/api/hooks/orders/use-batch-update-package";
import { useBatchDelete } from "@/api/hooks/orders/use-batch-delete";
import type { Order } from "@/api/types/orders";
import { DataTable, type BatchAction } from "@/components/data-table/table";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagination } from "@/hooks/use-pagination";
import { useModal } from "@/hooks/use-modal";
import { ordersColumns } from "./columns";
import { EditAddressModal } from "@/components/dashboard/modals/edit-address-modal";
import { EditPackageModal } from "@/components/dashboard/modals/edit-package-modal";
import { ConfirmOrderDeletionModal } from "@/components/dashboard/modals/confirm-order-deletion-modal";
import { ConfirmBatchOrderDeletionModal } from "@/components/dashboard/modals/confirm-batch-order-deletion-modal";
import { BatchUpdateAddressModal } from "@/components/dashboard/modals/batch-update-address-modal";
import { BatchUpdatePackageModal } from "@/components/dashboard/modals/batch-update-package-modal";
import type { AddressFormData } from "@/schemas/address";
import type { PackageFormData } from "@/schemas/package";
import { useCallback, useMemo, useState } from "react";
import { OrdersTableContext } from "./context";
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
        style={{ width: 80, minWidth: 80 }}
      >
        <Skeleton className="size-8" />
      </div>
    </>
  );
}

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
  const { isOpen: isAddressModalOpen, onOpenChange: setAddressModalOpen } =
    useModal();
  const { isOpen: isPackageModalOpen, onOpenChange: setPackageModalOpen } =
    useModal();
  const { isOpen: isDeleteModalOpen, onOpenChange: setDeleteModalOpen } =
    useModal();
  const {
    isOpen: isBatchAddressModalOpen,
    onOpenChange: setBatchAddressModalOpen,
  } = useModal();
  const {
    isOpen: isBatchPackageModalOpen,
    onOpenChange: setBatchPackageModalOpen,
  } = useModal();
  const {
    isOpen: isBatchDeleteModalOpen,
    onOpenChange: setBatchDeleteModalOpen,
  } = useModal();
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [addressDefaultValues, setAddressDefaultValues] = useState<
    Partial<AddressFormData> | undefined
  >(undefined);
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(
    null,
  );
  const [packageDefaultValues, setPackageDefaultValues] = useState<
    Partial<PackageFormData> | undefined
  >(undefined);
  const [selectedOrderForDeletion, setSelectedOrderForDeletion] =
    useState<Order | null>(null);
  const [selectedOrdersForBatch, setSelectedOrdersForBatch] = useState<Order[]>(
    [],
  );

  const updateAddress = useUpdateAddress();
  const updatePackage = useUpdatePackage();
  const deleteOrder = useDeleteOrder();
  const batchUpdateAddress = useBatchUpdateAddress();
  const batchUpdatePackage = useBatchUpdatePackage();
  const batchDelete = useBatchDelete();

  const handleEditAddress = useCallback(
    (order: Order) => {
      setSelectedAddressId(order.toAddress.id);
      setAddressDefaultValues(order.toAddress);
      setAddressModalOpen(true);
    },
    [setAddressModalOpen],
  );

  const handleEditPackage = useCallback(
    (order: Order) => {
      setSelectedPackageId(order.package.id);
      setPackageDefaultValues(order.package);
      setPackageModalOpen(true);
    },
    [setPackageModalOpen],
  );

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

  const handleSaveAddress = useCallback(
    (data: AddressFormData) => {
      if (!selectedAddressId) return;
      updateAddress.mutate(
        { addressId: selectedAddressId, data },
        {
          onSuccess: () => {
            setAddressModalOpen(false);
            toast.success("Address updated successfully");
          },
        },
      );
    },
    [selectedAddressId, updateAddress, setAddressModalOpen],
  );

  const handleSavePackage = useCallback(
    (data: PackageFormData) => {
      if (!selectedPackageId) return;
      updatePackage.mutate(
        { packageId: selectedPackageId, data },
        {
          onSuccess: () => {
            setPackageModalOpen(false);
            toast.success("Package updated successfully");
          },
        },
      );
    },
    [selectedPackageId, updatePackage, setPackageModalOpen],
  );

  const handleBatchUpdateAddress = useCallback(
    (orders: Order[]) => {
      setSelectedOrdersForBatch(orders);
      setBatchAddressModalOpen(true);
    },
    [setBatchAddressModalOpen],
  );

  const handleBatchUpdatePackage = useCallback(
    (orders: Order[]) => {
      setSelectedOrdersForBatch(orders);
      setBatchPackageModalOpen(true);
    },
    [setBatchPackageModalOpen],
  );

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

  const handleSaveBatchAddress = useCallback(
    (addressId: number) => {
      const orderIds = selectedOrdersForBatch.map((order) => order.id);
      batchUpdateAddress.mutate(
        { orderIds, addressId },
        {
          onSuccess: () => {
            setBatchAddressModalOpen(false);
            setSelectedOrdersForBatch([]);
            toast.success("Addresses updated successfully");
          },
        },
      );
    },
    [selectedOrdersForBatch, batchUpdateAddress, setBatchAddressModalOpen],
  );

  const handleSaveBatchPackage = useCallback(
    (packageId: number) => {
      const orderIds = selectedOrdersForBatch.map((order) => order.id);
      batchUpdatePackage.mutate(
        { orderIds, packageId },
        {
          onSuccess: () => {
            setBatchPackageModalOpen(false);
            setSelectedOrdersForBatch([]);
            toast.success("Packages updated successfully");
          },
        },
      );
    },
    [selectedOrdersForBatch, batchUpdatePackage, setBatchPackageModalOpen],
  );

  const contextValue = useMemo(
    () => ({
      onEditAddress: handleEditAddress,
      onEditPackage: handleEditPackage,
      onDeleteOrder: handleDeleteOrder,
    }),
    [handleEditAddress, handleEditPackage, handleDeleteOrder],
  );

  const batchActions: BatchAction<Order>[] = useMemo(
    () => [
      {
        id: "batch-update-address",
        label: "Update address",
        onSelect: handleBatchUpdateAddress,
      },
      {
        id: "batch-update-package",
        label: "Update package",
        onSelect: handleBatchUpdatePackage,
      },
      {
        id: "batch-delete",
        label: "Delete orders",
        onSelect: handleBatchDelete,
        isDestructive: true,
      },
    ],
    [handleBatchUpdateAddress, handleBatchUpdatePackage, handleBatchDelete],
  );

  return (
    <OrdersTableContext.Provider value={contextValue}>
      <DataTable
        data={data}
        columns={ordersColumns}
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

      {isAddressModalOpen && (
        <EditAddressModal
          open={isAddressModalOpen}
          onOpenChange={setAddressModalOpen}
          defaultValues={addressDefaultValues}
          onSave={handleSaveAddress}
        />
      )}

      {isPackageModalOpen && (
        <EditPackageModal
          open={isPackageModalOpen}
          onOpenChange={setPackageModalOpen}
          defaultValues={packageDefaultValues}
          onSave={handleSavePackage}
        />
      )}

      {isDeleteModalOpen && (
        <ConfirmOrderDeletionModal
          open={isDeleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          order={selectedOrderForDeletion}
          onConfirm={handleConfirmDelete}
        />
      )}

      {isBatchAddressModalOpen && (
        <BatchUpdateAddressModal
          open={isBatchAddressModalOpen}
          onOpenChange={setBatchAddressModalOpen}
          orderCount={selectedOrdersForBatch.length}
          onSave={handleSaveBatchAddress}
          isSavePending={batchUpdateAddress.isPending}
        />
      )}

      {isBatchPackageModalOpen && (
        <BatchUpdatePackageModal
          open={isBatchPackageModalOpen}
          onOpenChange={setBatchPackageModalOpen}
          orderCount={selectedOrdersForBatch.length}
          onSave={handleSaveBatchPackage}
          isSavePending={batchUpdatePackage.isPending}
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
    </OrdersTableContext.Provider>
  );
}
