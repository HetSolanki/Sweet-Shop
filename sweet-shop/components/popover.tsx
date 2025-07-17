"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { purchaseSweet } from "@/lib/api";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

export default function Popup({
  sweetId,
  onPurchase,
}: {
  sweetId: string;
  onPurchase: () => void;
}) {
  const [quantity, setQuantity] = useState("");
  const [open, setOpen] = useState(false);

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await purchaseSweet(sweetId, quantity);

    if (res.status === 200) {
      toast.success(res.message);
      setOpen(false);
      onPurchase();
    } else {
      toast.info(res.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Purchase</Button>
      </DialogTrigger>

      <DialogContent className="w-80">
        <form onSubmit={handlePurchase}>
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="leading-none font-medium">Quantity</h4>
              <p className="text-muted-foreground text-sm">
                Enter quantity to purchase
              </p>
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="qty">Qty</Label>
              <Input
                id="qty"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="col-span-2 h-8"
                placeholder="e.g. 2"
                required
                min={1}
              />
            </div>

            <Button type="submit">Purchase</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
