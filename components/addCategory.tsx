"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { addCategory } from "@/lib/api";

export default function AddCategoryDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    const res = await addCategory(name);

    if (res.status === 201) {
      toast.success(res.message);
      setOpen(false);
      location.reload();
    } else {
      toast.error(res.error || "Failed to add category.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-purple-400 font-semibold">
          Add Category
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <form onSubmit={handleAdd}>
          <DialogHeader>
            <DialogTitle>New Category</DialogTitle>
            <DialogDescription>
              Add a new category to organize sweets
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category-name">Name</Label>
              <Input
                id="category-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Bengali"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
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
