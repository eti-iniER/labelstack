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
import { usePackages } from "@/api/hooks/packages/use-packages";
import { LuCheck, LuChevronsUpDown } from "react-icons/lu";
import { cn, convertOzToLbsOz } from "@/lib/utils";

interface BatchUpdatePackageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderCount: number;
  onSave: (packageId: number) => void;
  isSavePending?: boolean;
}

export function BatchUpdatePackageModal({
  open,
  onOpenChange,
  orderCount,
  onSave,
  isSavePending = false,
}: BatchUpdatePackageModalProps) {
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [value, setValue] = useState("");
  const { data, isPending, isError } = usePackages({
    pagination: { page: 1, pageSize: 100 },
    filters: {
      isUserCreated: true, // Only allow user-created packages to be selected
    },
  });

  const packages = data?.results || [];
  const selectedPackage = packages.find((p) => p.id.toString() === value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPackage) {
      onSave(selectedPackage.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Batch update package</DialogTitle>
          <DialogDescription>
            Update the package for {orderCount} selected order
            {orderCount > 1 ? "s" : ""}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Package</Label>
            {isPending ? (
              <Skeleton className="h-10 w-full" />
            ) : isError ? (
              <div className="text-destructive text-sm">
                Failed to load packages
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
                    {selectedPackage
                      ? `${selectedPackage.itemSku} - ${selectedPackage.length}"×${selectedPackage.width}"×${selectedPackage.height}"`
                      : "Select package"}
                    <LuChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search packages..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No package found.</CommandEmpty>
                      <CommandGroup>
                        {packages.map((pkg) => {
                          const weight = convertOzToLbsOz(pkg.weight);
                          return (
                            <CommandItem
                              key={pkg.id}
                              value={pkg.id.toString()}
                              onSelect={(currentValue) => {
                                const newValue =
                                  currentValue === value ? "" : currentValue;
                                setValue(newValue);
                                setComboboxOpen(false);
                              }}
                            >
                              <div className="flex flex-col gap-0.5">
                                <span className="font-medium">
                                  {pkg.itemSku}
                                </span>
                                <span className="text-muted-foreground text-xs">
                                  Dimensions: {pkg.length}" × {pkg.width}" ×{" "}
                                  {pkg.height}"
                                </span>
                                <span className="text-muted-foreground text-xs">
                                  Weight: {weight.lbs} lbs {weight.oz} oz
                                </span>
                              </div>
                              <LuCheck
                                className={cn(
                                  "ml-auto",
                                  value === pkg.id.toString()
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          );
                        })}
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
            <Button type="submit" disabled={isSavePending || !selectedPackage}>
              {isSavePending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
