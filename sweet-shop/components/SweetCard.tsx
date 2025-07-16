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
    <Card>
      <CardHeader>
        <CardTitle>{sweet.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{sweet.category?.name}</p>
      </CardHeader>
      <CardContent>
        <p>Price: ₹{sweet.price}</p>
        <p>Stock: {sweet.quantity}</p>
        <Popup sweetId={sweet.id} onPurchase={onPurchase} />
      </CardContent>
    </Card>
  );
}
