"use server";
  
import { prisma } from "./prisma";
import { AddSweetType } from "@/types/sweetApiTypes";

export const fetchAllSweets = async () => {
  const res = await fetch("http://localhost:3000/api/sweets");
  const result = await res.json();
  return result;
};

export const purchaseSweet = async (sweetId: string, quantity: string) => {
  const res = await fetch("http://localhost:3000/api/sweets/purchase", {
    method: "POST",
    body: JSON.stringify({ sweetId, quantity }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await res.json();
  return result;
};

export const fetchCategories = async () => {
  const categories = await prisma.category.findMany({});
  return categories;
};

export const restockSweet = async (sweetId: string, quantity: string) => {
  const res = await fetch("http://localhost:3000/api/sweets/restock", {
    method: "POST",
    body: JSON.stringify({ sweetId, quantity }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const results = await res.json();
  return results;
};

export const deleteSweet = async (sweetId: string) => {
  const res = await fetch(
    `http://localhost:3000/api/sweets/delete/${sweetId}`,
    {
      method: "DELETE",
    }
  );

  const results = await res.json();
  return results;
};

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
  const res = await fetch("http://localhost:3000/api/sweets/add", {
    method: "POST",
    body: JSON.stringify(body),
  });

  const result = await res.json();
  return result;
};
