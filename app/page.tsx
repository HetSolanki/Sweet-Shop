"use client";

import { useEffect, useState } from "react";
import { fetchCategories } from "@/lib/api";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import SweetCard from "@/components/SweetCard";
import { Button } from "@/components/ui/button";
import { Sweet } from "@/types/sweetTypes";

type Category = {
  id: string;
  name: string;
};

export default function ShopPage() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("name_asc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchData = async () => {
    const query = new URLSearchParams();
    if (search) query.append("name", search);
    if (category) query.append("category", category === "All" ? "" : category);
    if (sort) query.append("sort", sort);
    if (minPrice) query.append("minPrice", minPrice);
    if (maxPrice) query.append("maxPrice", maxPrice);
    const res = await fetch(
      `http://localhost:3000/api/sweets?${query.toString()}`
    );
    const data = await res.json();
    setSweets(data.data);
  };

  const loadCategories = async () => {
    const catRes = await fetchCategories();
    setCategories(catRes || []);
  };

  useEffect(() => {
    fetchData();
    loadCategories();
  }, [search, category, sort, minPrice, maxPrice]);

  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Browse Sweets</h1>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Search by name..."
          className="w-60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <span className="text-sm ">Price</span>
          <Input
            type="number"
            placeholder="Min"
            className="w-20 h-8"
            value={minPrice}
            min={1}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            placeholder="Max"
            className="w-20 h-8"
            value={maxPrice}
            min={1}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name_asc">Name (A-Z)</SelectItem>
            <SelectItem value="name_desc">Name (Z-A)</SelectItem>
            <SelectItem value="price_asc">Price (Low → High)</SelectItem>
            <SelectItem value="price_desc">Price (High → Low)</SelectItem>
            <SelectItem value="quantity_asc">Stock (Low → High)</SelectItem>
            <SelectItem value="quantity_desc">Stock (High → Low)</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => {
            setSearch("");
            setCategory("");
            setSort("name_asc");
            setMinPrice("");
            setMaxPrice("");
          }}
        >
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sweets.map((sweet) => (
          <SweetCard key={sweet.id} sweet={sweet} onPurchase={fetchData} />
        ))}
      </div>
    </div>
  );
}
