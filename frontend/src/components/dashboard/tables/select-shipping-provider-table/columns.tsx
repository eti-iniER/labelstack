/* eslint-disable react-refresh/only-export-components */
import type { Order } from "@/api/types/orders";
import type { ColumnDef } from "@tanstack/react-table";
import { convertOzToLbsOz, cn } from "@/lib/utils";
import { ActionsCell } from "./actions";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelectShippingProviderTableContext } from "./context";
import { useShippingProviders } from "@/api/hooks/shipping-providers/use-shipping-providers";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { LuCheck, LuChevronsUpDown } from "react-icons/lu";

const ShippingProviderCell = ({ order }: { order: Order }) => {
  const { onShippingProviderChange } = useSelectShippingProviderTableContext();
  const { data, isPending, isError } = useShippingProviders({
    pagination: { page: 1, pageSize: 100 },
  });
  const [open, setOpen] = useState(false);

  if (isPending) {
    return <Skeleton className="h-9 w-45" />;
  }

  if (isError) {
    return (
      <div className="text-destructive text-xs">Failed to load providers</div>
    );
  }

  const providers = data?.results || [];
  const selectedProvider = providers.find(
    (p) => p.id === order.shippingProvider?.id,
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-45 justify-between"
        >
          {selectedProvider ? selectedProvider.name : "Select provider"}
          <LuChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-75 p-0">
        <Command>
          <CommandInput placeholder="Search providers..." className="h-9" />
          <CommandList>
            <CommandEmpty>No provider found.</CommandEmpty>
            <CommandGroup>
              {providers.map((provider) => (
                <CommandItem
                  key={provider.id}
                  value={provider.name}
                  onSelect={() => {
                    setOpen(false);
                    onShippingProviderChange(order.id, provider);
                  }}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{provider.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {provider.description}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      ${provider.costPerPound}/lb
                    </span>
                  </div>
                  <LuCheck
                    className={cn(
                      "ml-auto",
                      order.shippingProvider?.id === provider.id
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export const selectShippingProviderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    size: 100,
    cell: ({ row }) => (
      <div className="pt-0.5 font-mono">{row.original.id}</div>
    ),
  },
  {
    id: "sender",
    header: "Sender",
    size: 150,
    cell: ({ row }) => {
      const { sender } = row.original;
      return (
        <div>
          {sender.firstName} {sender.lastName}
        </div>
      );
    },
  },
  {
    id: "recipient",
    header: "Recipient",
    size: 150,
    cell: ({ row }) => {
      const { recipient } = row.original;
      return (
        <div>
          {recipient.firstName} {recipient.lastName}
        </div>
      );
    },
  },
  {
    id: "fromAddress",
    header: "From",
    size: 200,
    cell: ({ row }) => {
      const { fromAddress } = row.original;
      return (
        <div className="text-sm">
          <div>
            {fromAddress.city}, {fromAddress.state}
          </div>
          <div className="text-muted-foreground">{fromAddress.zipCode}</div>
        </div>
      );
    },
  },
  {
    id: "toAddress",
    header: "To",
    size: 200,
    cell: ({ row }) => {
      const { toAddress } = row.original;
      return (
        <div className="text-sm">
          <div>
            {toAddress.city}, {toAddress.state}
          </div>
          <div className="text-muted-foreground">{toAddress.zipCode}</div>
        </div>
      );
    },
  },
  {
    id: "package",
    header: "Package",
    size: 150,
    cell: ({ row }) => {
      const { package: pkg } = row.original;
      const weight = convertOzToLbsOz(pkg.weight);
      const weightDisplay =
        weight.lbs === 0
          ? `${weight.oz} oz`
          : `${weight.lbs} lbs ${weight.oz} oz`;
      return (
        <div className="text-sm">
          <div>
            {pkg.length}" × {pkg.width}" × {pkg.height}"
          </div>
          <div className="text-muted-foreground">{weightDisplay}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    size: 150,
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <div className="text-sm">
          {date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    id: "shippingProvider",
    header: "Shipping provider",
    size: 200,
    cell: ({ row }) => <ShippingProviderCell order={row.original} />,
  },
  {
    id: "actions",
    header: "Actions",
    size: 80,
    cell: ({ row }) => <ActionsCell order={row.original} />,
  },
];
