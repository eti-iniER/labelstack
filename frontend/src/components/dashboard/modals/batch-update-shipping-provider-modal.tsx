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
import { useShippingProviders } from "@/api/hooks/shipping-providers/use-shipping-providers";
import { LuCheck, LuChevronsUpDown } from "react-icons/lu";
import { cn } from "@/lib/utils";

interface BatchUpdateShippingProviderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderCount: number;
  onSave: (shippingProviderId: number) => void;
  isSavePending?: boolean;
}

export function BatchUpdateShippingProviderModal({
  open,
  onOpenChange,
  orderCount,
  onSave,
  isSavePending = false,
}: BatchUpdateShippingProviderModalProps) {
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [value, setValue] = useState("");
  const { data, isPending, isError } = useShippingProviders({
    pagination: { page: 1, pageSize: 100 },
  });

  const providers = data?.results || [];
  const selectedProvider = providers.find((p) => p.id.toString() === value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProvider) {
      onSave(selectedProvider.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Batch update shipping provider</DialogTitle>
          <DialogDescription>
            Update the shipping provider for {orderCount} selected order
            {orderCount > 1 ? "s" : ""}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Shipping provider</Label>
            {isPending ? (
              <Skeleton className="h-10 w-full" />
            ) : isError ? (
              <div className="text-destructive text-sm">
                Failed to load providers
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
                    {selectedProvider
                      ? selectedProvider.name
                      : "Select provider"}
                    <LuChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search providers..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No provider found.</CommandEmpty>
                      <CommandGroup>
                        {providers.map((provider) => (
                          <CommandItem
                            key={provider.id}
                            value={provider.id.toString()}
                            onSelect={(currentValue) => {
                              const newValue =
                                currentValue === value ? "" : currentValue;
                              setValue(newValue);
                              setComboboxOpen(false);
                            }}
                          >
                            <div className="flex flex-col gap-0.5">
                              <span className="font-medium">
                                {provider.name}
                              </span>
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
                                value === provider.id.toString()
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
            <Button type="submit" disabled={isSavePending || !selectedProvider}>
              {isSavePending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
