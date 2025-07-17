import prisma from "./prisma";

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

// Fetch all sweets from the database
export const fetchAllSweets = async () => {
  const res = await prisma.sweet.findMany({ include: { category: true } });
  return res;
};

// Fetch all sweet categories
export const fetchCategories = async () => {
  const categories = await prisma.category.findMany({});
  return categories;
};
