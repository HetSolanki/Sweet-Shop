import { AddSweetType } from "@/types/sweetApiTypes";
import { prisma } from "@/lib/prisma";

// Adds a new sweet only if the provided categoryId exists in the database
export const addSweets = async ({
  name,
  categoryId,
  price,
  quantity,
}: AddSweetType) => {
  // Check if the category ID exists in the database
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  // If the category doesn't exist, return an error message
  if (!category) {
    return {
      error: "Invalid category. Please provide a valid category ID.",
      status: 400,
    };
  }

  // Proceed to create the sweet and connect it to the valid category
  const res = await prisma.sweet.create({
    data: {
      name,
      price,
      quantity,
      category: {
        connect: { id: categoryId },
      },
    },
  });

  // Return success message if sweet is created
  if (res) {
    return {
      message: "Sweet added successfully!",
      status: 201,
    };
  }

  // if insertion is not succeeded
  return {
    error: "Something went wrong while adding the sweet.",
    status: 500,
  };
};
