"use client";

import AlertDialogBox from "@/components/alertDialog";
import Restock from "@/components/restock";
import { Button } from "@/components/ui/button";
import { Sweet } from "@/types/sweetTypes";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Sweet>[] = [
  {
    accessorKey: "name",
    header: () => <span className="font-semibold text-[17px]">Name</span>,
  },
  {
    accessorKey: "category.name",
    header: () => <span className="font-semibold text-[17px]">Category</span>,
  },
  {
    accessorKey: "price",
    header: () => <span className="font-semibold text-[17px]">Price</span>,
  },
  {
    accessorKey: "quantity",
    header: () => <span className="font-semibold text-[17px]">Quantity</span>,
  },
  {
    accessorKey: "action",
    header: () => (
      <span className="font-semibold text-[17px] text-left">Action</span>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex gap-6">
          <Restock sweetId={row.original.id} />
          <AlertDialogBox sweetId={row.original.id} />
        </div>
      );
    },
  },
];
