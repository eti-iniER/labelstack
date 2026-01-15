import type { Order } from "@/api/types/orders";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useOrdersTableContext } from "./context";

export const ActionsCell = ({ order }: { order: Order }) => {
  const { onEditAddress, onEditPackage, onDeleteOrder } =
    useOrdersTableContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <HiOutlineDotsHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            onEditAddress(order);
          }}
        >
          Edit sender address
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onEditPackage(order);
          }}
        >
          Edit package
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onDeleteOrder(order);
          }}
          className="text-destructive"
        >
          Delete order
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
