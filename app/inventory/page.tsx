"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/datatable";
import { fetchAllSweets } from "@/lib/category";
import { Sweet } from "@/src/generated/prisma";
import { columns } from "./column";
import AddCategoryDialog from "@/components/addCategory";
import AddSweetDialog from "@/components/addSweet";
import Spinner from "@/components/Spinner";

export default function AdminHome() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSweets = async () => {
    setLoading(true);
    const data = await fetchAllSweets();
    setSweets(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  return (
    <div className="min-h-screen px-6 py-10 bg-white">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">
            Sweet Inventory
          </h1>
          <div className="flex gap-4">
            <AddSweetDialog />
            <AddCategoryDialog />
          </div>
        </div>

        <div>
          {loading ? (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 min-h-[200px] flex justify-center items-center">
              <Spinner />
            </div>
          ) : sweets.length > 0 ? (
            <DataTable data={sweets} columns={columns} />
          ) : (
            <p className="text-muted-foreground">No sweets found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
