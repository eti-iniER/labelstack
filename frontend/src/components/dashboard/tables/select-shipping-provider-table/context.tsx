import { createContext, useContext } from "react";
import type { Order } from "@/api/types/orders";

interface SelectShippingProviderTableContextValue {
  onDeleteOrder: (order: Order) => void;
  onShippingProviderChange: (
    orderId: number,
    provider: { id: number; name: string },
  ) => void;
}

export const SelectShippingProviderTableContext =
  createContext<SelectShippingProviderTableContextValue | null>(null);

export const useSelectShippingProviderTableContext = () => {
  const context = useContext(SelectShippingProviderTableContext);
  if (!context) {
    throw new Error(
      "useSelectShippingProviderTableContext must be used within SelectShippingProviderTableContext.Provider",
    );
  }
  return context;
};
