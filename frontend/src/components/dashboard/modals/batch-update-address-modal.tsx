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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [addressId, setAddressId] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(addressId, 10);
    if (!isNaN(id) && id > 0) {
      onSave(id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Batch update address</DialogTitle>
          <DialogDescription>
            Update the address for {orderCount} selected order
            {orderCount > 1 ? "s" : ""}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="addressId">Address ID</Label>
            <Input
              id="addressId"
              type="number"
              min="1"
              placeholder="Enter address ID"
              value={addressId}
              onChange={(e) => setAddressId(e.target.value)}
              disabled={isSavePending}
              required
            />
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
            <Button type="submit" disabled={isSavePending || !addressId}>
              {isSavePending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
