import { prisma } from "@/lib/prisma";
import { Where } from "@/types/whereTypes";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const name = searchParams.get("name");
  const category = searchParams.get("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sort = searchParams.get("sort") || "name_asc";

  const where: Partial<Where> = {};

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

    return Response.json({ data: sweets }, { status: 200 });
  } catch (error) {
    console.error("Search error:", error);
    return Response.json({ error: "Failed to fetch sweets." }, { status: 500 });
  }
}
