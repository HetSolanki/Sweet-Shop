"use client";

import { DataTable } from "@/components/ui/datatable";
import { fetchAllSweets } from "@/lib/api";
import { Sweet } from "@/src/generated/prisma";
import { useEffect, useState } from "react";
import { columns } from "./column";

export default function AdminHome() {
  const [sweets, setSweets] = useState<Sweet[]>();
  const fetchSweets = async () => {
    const sweets = await fetchAllSweets();
    setSweets(sweets.data);
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  return (
    <div className="h-scree w-screen p-4">
      <h1 className="text-3xl font-bold">Sweet Inventory</h1>
      <div className="mt-4 w-[60%] mx-auto">
        {sweets && <DataTable data={sweets} columns={columns} />}
      </div>
    </div>
  );
}
