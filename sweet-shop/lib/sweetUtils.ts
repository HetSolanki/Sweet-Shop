import { AddSweetType } from "@/types/sweetApiTypes";
import { prisma } from "@/lib/prisma";
import { WhereTypes } from "@/types/whereTypes";

// Adds a new sweet only if the provided categoryId exists in the database
export const addSweets = async ({
  name,
  categoryId,
  price,
  quantity,
}: AddSweetType) => {
  try {
    // Check for empty inputs
    if (!name || !price || !quantity || !categoryId) {
      return {
        error: "All fields are required",
        status: 400,
      };
    }
    // Check if the category ID exists in the database
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return {
        error: "Invalid category. Please provide a valid category ID.",
        status: 400,
      };
    }

    if (quantity < 0) {
      return {
        error: "Invalid quantity. Please provide valid quantity",
        status: 400,
      };
    }
    if (price < 0) {
      return {
        error: "Invalid price. Please provide valid price value",
        status: 400,
      };
    }

    // Proceed to create the sweet and connect it to the valid category
    await prisma.sweet.create({
      data: {
        name,
        price,
        quantity,
        category: {
          connect: { id: categoryId },
        },
      },
    });

    return {
      message: "Sweet added successfully!",
      status: 201,
    };
  } catch (error) {
    // Handle any unexpected errors (e.g. DB failure)
    console.error("Error deleting sweet:", error);
    return {
      error: "Something went wrong while adding the sweet.",
      status: 500,
    };
  }
};

// Deletes a sweet by ID if it exists in the database
export const deleteSweet = async (id: string) => {
  try {
    // Check for empty inputs
    if (!id) {
      return {
        error: "All fields are required",
        status: 400,
      };
    }

    // Check if the sweet with the given ID exists
    const existingSweet = await prisma.sweet.findUnique({
      where: { id },
    });

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

// Perform search and sort based on provided query parameters
export const searchSweet = async ({
  searchParams,
}: {
  searchParams: URLSearchParams;
}) => {
  const name = searchParams.get("name");
  const category = searchParams.get("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sort = searchParams.get("sort") || "name_asc";

  const where: Partial<WhereTypes> = {};

  // Filters records based on the name or category provided
  if (name || category) {
    where.name = {
      ...(name && { contains: name }),
    };

    where.category = {
      ...(category && { name: { contains: category } }),
    };
  }

  // Add price range filtering only if one or both values are provided
  if (minPrice || maxPrice) {
    where.price = {
      ...(minPrice && { gte: Number(minPrice) }),
      ...(maxPrice && { lte: Number(maxPrice) }),
    };
  }

  where.quantity = { gte: 1 };

  const [sortField, sortOrder] = sort.split("_");
  let orderBy = {};

  // Dynamically construct sort field and sorting order
  orderBy = {
    [sortField]: sortOrder,
  };

  try {
    const sweets = await prisma.sweet.findMany({
      where,
      orderBy,
      include: {
        category: true,
      },
    });

    return { data: sweets, status: 200 };
  } catch (error) {
    console.error("Search error:", error);
    return { error: "Failed to fetch sweets.", status: 500 };
  }
};

// Perform stock purchase and update the quantity
export const purchaseSweet = async ({
  sweetId,
  quantity,
}: {
  sweetId: string;
  quantity: string;
}) => {
  try {
    // Validate inputs
    if (!sweetId || typeof sweetId !== "string") {
      return { error: "Invalid or missing sweet ID.", status: 400 };
    }

    const parsedQty = Number(quantity);
    if (!quantity || isNaN(parsedQty) || parsedQty <= 0) {
      return { error: "Quantity must be greater than zero.", status: 400 };
    }

    // Check if sweet exists
    const sweet = await prisma.sweet.findUnique({ where: { id: sweetId } });

    if (!sweet) {
      return { error: "Sweet not found.", status: 404 };
    }

    // Check stock availability
    if (sweet.quantity < parsedQty) {
      return { error: "Not enough stock to fulfill purchase.", status: 400 };
    }

    // Perform stock update
    const updated = await prisma.sweet.update({
      where: { id: sweetId },
      data: {
        quantity: {
          decrement: parsedQty,
        },
      },
    });

    return {
      message: "Purchase successful!",
      remainingStock: updated.quantity,
      status: 200,
    };
  } catch (error) {
    console.error("Purchase error:", error);
    return { error: "Internal server error.", status: 500 };
  }
};

// Restocks the sweet quantity
export const restockSweets = async ({
  sweetId,
  quantity,
}: {
  sweetId: string;
  quantity: string;
}) => {
  // Input validation
  if (!sweetId || typeof sweetId !== "string") {
    return {
      status: 400,
      error: "Invalid or missing sweet ID.",
    };
  }

  const parseQty = Number(quantity);
  if (!parseQty || isNaN(parseQty) || parseQty <= 0) {
    return {
      status: 400,
      error: "Quantity must be greater than zero.",
    };
  }

  try {
    // Check if the sweet exists
    const sweet = await prisma.sweet.findUnique({
      where: { id: sweetId },
    });

    if (!sweet) {
      return {
        status: 404,
        error: "Sweet not found.",
      };
    }

    // Update sweet quantity
    const updated = await prisma.sweet.update({
      where: { id: sweetId },
      data: {
        quantity: {
          increment: parseQty,
        },
      },
    });

    return {
      status: 200,
      message: "Restock successful!",
      updatedQuantity: updated.quantity,
    };
  } catch (error) {
    console.error("Restock error:", error);
    return {
      status: 500,
      error: "Internal server error.",
    };
  }
};
