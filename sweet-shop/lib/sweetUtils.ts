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

// Deletes a sweet by ID if it exists in the database
// Returns success or appropriate error message
export const deleteSweet = async (id: string) => {
  try {
    console.log(id);
    // Check if the sweet with the given ID exists
    const existingSweet = await prisma.sweet.findUnique({
      where: { id },
    });

    // If not found, return a 404-like error object
    if (!existingSweet) {
      return {
        error: "Sweet not found.",
        status: 404,
      };
    }

    // Delete the sweet from the database
    await prisma.sweet.delete({
      where: { id },
    });

    // Return a success message
    return {
      message: "Sweet deleted successfully.",
      status: 200,
    };
  } catch (error) {
    // Handle any unexpected errors (e.g. DB failure)
    console.error("Error deleting sweet:", error);
    return {
      error: "An unexpected error occurred while deleting the sweet.",
      status: 500,
    };
  }
};
