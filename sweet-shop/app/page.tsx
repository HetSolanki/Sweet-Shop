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

type categories = {
  id: string;
  name: string;
};

export default function ShopPage() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("name_asc");
  const [categories, setCategories] = useState<categories[]>([]);

  const fetchData = async () => {
    const query = new URLSearchParams();
    if (search) query.append("name", search);
    if (category) query.append("category", category == "All" ? "" : category);
    if (sort) query.append("sort", sort);

    const res = await fetch(`/api/sweets?${query.toString()}`);
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
  }, [search, category, sort]);

  return (
    <div className="px-6 py-8 space-y-6">
      <h1 className="text-2xl font-bold">🍬 Browse Sweets</h1>

      {/* Search / Filter / Sort */}
      <div className="flex flex-wrap gap-4 items-center">
        <Input
          placeholder="Search by name..."
          className="w-60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select onValueChange={setCategory} value={category}>
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

        <Select onValueChange={setSort} value={sort}>
          <SelectTrigger className="w-43">
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
          }}
        >
          Reset Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {sweets.map((sweet) => (
          <SweetCard key={sweet.id} sweet={sweet} onPurchase={fetchData} />
        ))}
      </div>
    </div>
  );
}
