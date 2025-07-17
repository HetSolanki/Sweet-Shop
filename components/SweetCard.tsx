"use client";
import { Sweet } from "@/types/sweetTypes";
import Popup from "./popover";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function SweetCard({
  sweet,
  onPurchase,
}: {
  sweet: Sweet;
  onPurchase: () => void;
}) {
  return (
    <Card className="rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold tracking-tight text-purple-700">
          {sweet.name}
        </CardTitle>
        <p className="text-xs text-muted-foreground">{sweet.category?.name}</p>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span className="text-lg">Price:</span>
          <span className="font-medium text-black text-lg">₹{sweet.price}</span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span className="text-lg">Stock:</span>
          <span className="text-green-600 font-semibold text-lg">
            {sweet.quantity}
          </span>
        </div>

        <div className="pt-3">
          <Popup sweetId={sweet.id} onPurchase={onPurchase} />
        </div>
      </CardContent>
    </Card>
  );
}
