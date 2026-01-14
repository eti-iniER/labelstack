import type { Order } from "@/api/types/orders";
import { Button } from "@/components/ui/button";
import { HiOutlineTrash } from "react-icons/hi";
import { useSelectShippingProviderTableContext } from "./context";

export const ActionsCell = ({ order }: { order: Order }) => {
  const { onDeleteOrder } = useSelectShippingProviderTableContext();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {
        onDeleteOrder(order);
      }}
    >
      <HiOutlineTrash className="text-destructive size-4" />
    </Button>
  );
};
