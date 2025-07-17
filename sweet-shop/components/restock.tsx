"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { restockSweet } from "@/lib/api";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function Restock({ sweetId }: { sweetId: string }) {
  const [quantity, setQuantity] = useState("");
  const [open, setOpen] = useState(false);

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await restockSweet(sweetId, quantity);

    if (res.status === 200) {
      toast.success(res.message);
      setOpen(false);
      location.reload();
    } else {
      toast.info(res.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Restock</Button>
      </DialogTrigger>

      <DialogContent className="w-80">
        <form onSubmit={handleRestock}>
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="leading-none font-medium">Quantity</h4>
              <p className="text-muted-foreground text-sm">
                Enter quantity to restock
              </p>
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="qty">Qty</Label>
              <Input
                id="qty"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="col-span-2 h-8"
                placeholder="e.g. 2"
                required
              />
            </div>

            <Button type="submit">Restock</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
