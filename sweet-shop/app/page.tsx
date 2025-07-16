"use client";

import { useEffect, useState } from "react";
import { fetchAllSweets } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, IndianRupee, Tag } from "lucide-react";
import Popup from "@/components/popover";

type Sweet = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category?: {
    name: string;
  };
};

export default function Home() {
  const [sweets, setSweets] = useState<Sweet[]>([]);

  const fetchSweetsData = async () => {
    const res = await fetchAllSweets();
    setSweets(res.data || []);
  };

  useEffect(() => {
    fetchSweetsData();
  }, []);

  return (
    <main className="px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">🍬 Sweet Shop</h1>

      {sweets.length === 0 ? (
        <p className="text-muted-foreground">No sweets available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sweets.map((sweet) => (
            <Card
              key={sweet.id}
              className="shadow-sm hover:shadow-md transition"
            >
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Tag className="w-5 h-5 text-pink-500" />
                  {sweet.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  {sweet.category?.name || "Uncategorized"}
                </p>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <IndianRupee className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-lg">{sweet.price}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Package className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold text-lg">
                    Stock: {sweet.quantity}
                  </span>
                </div>

                <Popup sweetId={sweet.id} onPurchase={fetchSweetsData} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
