"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/datatable";
import { fetchAllSweets } from "@/lib/api";
import { Sweet } from "@/src/generated/prisma";
import { columns } from "./column";
import AddCategoryDialog from "@/components/addCategory";

export default function AdminHome() {
  const [sweets, setSweets] = useState<Sweet[]>([]);

  const fetchSweets = async () => {
    const data = await fetchAllSweets();
    setSweets(data);
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
          <AddCategoryDialog />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
          {sweets.length > 0 && <DataTable data={sweets} columns={columns} />}
        </div>
      </div>
    </div>
  );
}
