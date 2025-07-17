"use client";

import { AddSweetType } from "@/types/sweetApiTypes";

// Purchase a sweet using PURCHASE API route
export const purchaseSweet = async (sweetId: string, quantity: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/sweets/purchase`, {
    method: "POST",
    body: JSON.stringify({ sweetId, quantity }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await res.json();
  return result;
};

// Restock a sweet using RESTOCK API route
export const restockSweet = async (sweetId: string, quantity: string) => {
  console.log("called", `${process.env.NEXT_PUBLIC_HOST}/api/sweets/restock`);
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/sweets/restock`, {
    method: "POST",
    body: JSON.stringify({ sweetId, quantity }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await res.json();
  return result;
};

// Delete a sweet by its ID via DELETE API route
export const deleteSweet = async (sweetId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_HOST}/api/sweets/delete/${sweetId}`,
    {
      method: "DELETE",
    }
  );

  const result = await res.json();
  return result;
};

// Add a new sweet to the shop using ADD API route
export const addSweet = async ({
  name,
  categoryId,
  price,
  quantity,
}: AddSweetType) => {
  const body = {
    name,
    categoryId,
    price,
    quantity,
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/sweets/add`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await res.json();
  return result;
};
