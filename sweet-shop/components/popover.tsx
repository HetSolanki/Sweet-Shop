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

  const handlePurchase = async () => {
    const res = await purchaseSweet(sweetId, quantity);

    if (res.status === 200) {
      toast.success(res.message);
      setOpen(false);
      onPurchase();
    } else {
      toast.custom(() => (
        <div
          className="w-full max-w-sm bg-red-500 border border-destructive rounded-md shadow-lg p-4 flex items-start gap-3"
          role="alert"
        >
          <AlertTriangle className="text-white h-5 w-5" />
          <div className="">
            <p className="text-sm text-white">{res.error}</p>
          </div>
        </div>
      ));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Purchase</Button>
      </DialogTrigger>

      <DialogContent className="w-80">
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
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="col-span-2 h-8"
              placeholder="e.g. 2"
            />
          </div>

          <Button onClick={handlePurchase}>Purchase</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
