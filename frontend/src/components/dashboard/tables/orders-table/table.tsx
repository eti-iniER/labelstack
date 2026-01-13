import { useUpdateAddress } from "@/api/hooks/orders/use-update-address";
import { useUpdatePackage } from "@/api/hooks/orders/use-update-package";
import type { Order } from "@/api/types/orders";
import { DataTable } from "@/components/data-table/table";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagination } from "@/hooks/use-pagination";
import { useModal } from "@/hooks/use-modal";
import { ordersColumns } from "./columns";
import { EditAddressModal } from "@/components/dashboard/modals/edit-address-modal";
import { EditPackageModal } from "@/components/dashboard/modals/edit-package-modal";
import type { AddressFormData } from "@/schemas/address";
import type { PackageFormData } from "@/schemas/package";
import { useCallback, useMemo, useState } from "react";
import { OrdersTableContext } from "./context";

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

  const updateAddress = useUpdateAddress();
  const updatePackage = useUpdatePackage();

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

  const handleSaveAddress = useCallback(
    (data: AddressFormData) => {
      if (!selectedAddressId) return;
      updateAddress.mutate(
        { addressId: selectedAddressId, data },
        {
          onSuccess: () => {
            setAddressModalOpen(false);
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
          },
        },
      );
    },
    [selectedPackageId, updatePackage, setPackageModalOpen],
  );

  const contextValue = useMemo(
    () => ({
      onEditAddress: handleEditAddress,
      onEditPackage: handleEditPackage,
    }),
    [handleEditAddress, handleEditPackage],
  );

  return (
    <OrdersTableContext.Provider value={contextValue}>
      <DataTable
        data={data}
        columns={ordersColumns}
        isLoading={isLoading}
        options={{
          selectable: true,
          selectedPropertyKey: "id",
          totalCount,
          currentPage: pagination.params.page,
          pageSize: pagination.params.pageSize,
          onPageChange: pagination.setPage,
          onPageSizeChange: pagination.setSize,
          showSerialNumbers: false,
          fixedHeader: true,
          useAvailableHeight: true,
          rowSkeleton: OrderRowSkeleton,
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
    </OrdersTableContext.Provider>
  );
}
