"use server";

import { prisma } from "./prisma";
import { AddSweetType } from "@/types/sweetApiTypes";

// Fetch all sweets from the database
export const fetchAllSweets = async () => {
  const res = await prisma.sweet.findMany({ include: { category: true } });
  return res;
};

// Purchase a sweet using PURCHASE API route
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

// Fetch all sweet categories
export const fetchCategories = async () => {
  const categories = await prisma.category.findMany({});
  return categories;
};

// Restock a sweet using RESTOCK API route
export const restockSweet = async (sweetId: string, quantity: string) => {
  const res = await fetch("http://localhost:3000/api/sweets/restock", {
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
    `http://localhost:3000/api/sweets/delete/${sweetId}`,
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

  const res = await fetch("http://localhost:3000/api/sweets/add", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await res.json();
  return result;
};

// Creating an new category;
export const addCategory = async (name: string) => {
  if (!name.trim()) {
    return { status: 400, error: "Category name is required." };
  }

  try {
    const category = await prisma.category.create({
      data: { name },
    });

    return {
      status: 201,
      message: "Category added successfully",
      data: category,
    };
  } catch (error) {
    return { status: 500, error: "Something went wrong." };
  }
};
