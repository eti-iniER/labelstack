import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useAddresses } from "@/api/hooks/addresses/use-addresses";
import { LuCheck, LuChevronsUpDown } from "react-icons/lu";
import { cn } from "@/lib/utils";

interface BatchUpdateAddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderCount: number;
  onSave: (addressId: number) => void;
  isSavePending?: boolean;
}

export function BatchUpdateAddressModal({
  open,
  onOpenChange,
  orderCount,
  onSave,
  isSavePending = false,
}: BatchUpdateAddressModalProps) {
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [value, setValue] = useState("");
  const { data, isPending, isError } = useAddresses({
    pagination: { page: 1, pageSize: 100 },
    filters: {
      isUserCreated: true, // Only allow user-created addresses to be selected
    },
  });

  const addresses = data?.results || [];
  const selectedAddress = addresses.find((a) => a.id.toString() === value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAddress) {
      onSave(selectedAddress.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Batch update sender address</DialogTitle>
          <DialogDescription>
            Update the sender address for {orderCount} selected order
            {orderCount > 1 ? "s" : ""}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Address</Label>
            {isPending ? (
              <Skeleton className="h-10 w-full" />
            ) : isError ? (
              <div className="text-destructive text-sm">
                Failed to load addresses
              </div>
            ) : (
              <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={comboboxOpen}
                    className="w-full justify-between"
                    disabled={isSavePending}
                    type="button"
                  >
                    {selectedAddress
                      ? `${selectedAddress.name} - ${selectedAddress.city}, ${selectedAddress.state}`
                      : "Select address"}
                    <LuChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search addresses..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No address found.</CommandEmpty>
                      <CommandGroup>
                        {addresses.map((address) => (
                          <CommandItem
                            key={address.id}
                            value={address.id.toString()}
                            onSelect={(currentValue) => {
                              const newValue =
                                currentValue === value ? "" : currentValue;
                              setValue(newValue);
                              setComboboxOpen(false);
                            }}
                          >
                            <div className="flex flex-col gap-0.5">
                              <span className="font-medium">
                                {address.name}
                              </span>
                              <span className="text-muted-foreground text-xs">
                                {address.address}
                                {address.address2 && `, ${address.address2}`}
                              </span>
                              <span className="text-muted-foreground text-xs">
                                {address.city}, {address.state}{" "}
                                {address.zipCode}
                              </span>
                            </div>
                            <LuCheck
                              className={cn(
                                "ml-auto",
                                value === address.id.toString()
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
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSavePending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSavePending || !selectedAddress}>
              {isSavePending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
