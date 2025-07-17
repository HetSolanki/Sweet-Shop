"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { addSweet, fetchCategories } from "@/lib/api";
import { AddSweetType } from "@/types/sweetApiTypes";

type Category = {
  id: string;
  name: string;
};

export default function AddSweetDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetchCategories();
      setCategories(res || []);
    };
    load();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !quantity || !category) {
      toast.error("All fields are required.");
      return;
    }

    const sweet: AddSweetType = {
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      categoryId: category,
    };

    const res = await addSweet(sweet);

    if (res.status === 201) {
      toast.success(res.message);
      setOpen(false);
      location.reload();
    } else {
      toast.custom(() => (
        <div
          className="w-full max-w-sm bg-red-500 border border-destructive rounded-md shadow-lg p-4 flex items-start gap-3"
          role="alert"
        >
          <AlertTriangle className="text-white h-5 w-5" />
          <div>
            <p className="text-sm text-white">{res.error}</p>
          </div>
        </div>
      ));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-purple-400 font-semibold">
          Add Sweet
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <form onSubmit={handleAdd}>
          <DialogHeader>
            <DialogTitle>Sweet Details</DialogTitle>
            <DialogDescription>Add new sweet to your shop</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rasgulla"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={price}
                min={1}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 50"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                min={1}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 10"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
