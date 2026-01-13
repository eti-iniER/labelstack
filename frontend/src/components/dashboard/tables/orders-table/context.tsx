import { createContext, useContext } from "react";
import type { Order } from "@/api/types/orders";

interface OrdersTableContextValue {
  onEditAddress: (order: Order) => void;
  onEditPackage: (order: Order) => void;
}

export const OrdersTableContext = createContext<OrdersTableContextValue | null>(
  null,
);

export const useOrdersTableContext = () => {
  const context = useContext(OrdersTableContext);
  if (!context) {
    throw new Error(
      "useOrdersTableContext must be used within OrdersTableContext.Provider",
    );
  }
  return context;
};
