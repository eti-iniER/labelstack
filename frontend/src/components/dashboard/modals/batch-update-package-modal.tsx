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
  const [packageId, setPackageId] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(packageId, 10);
    if (!isNaN(id) && id > 0) {
      onSave(id);
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
            <Label htmlFor="packageId">Package ID</Label>
            <Input
              id="packageId"
              type="number"
              min="1"
              placeholder="Enter package ID"
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
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
            <Button type="submit" disabled={isSavePending || !packageId}>
              {isSavePending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
