import { prisma } from "@/lib/prisma";

// POST /api/sweets/purchase - Handles sweet purchase and updates stock
export async function POST(req: Request) {
  try {
    const { sweetId, quantity } = await req.json();

    // Validate inputs
    if (!sweetId || typeof sweetId !== "string") {
      return Response.json(
        { error: "Invalid or missing sweet ID." },
        { status: 400 }
      );
    }

    if (!quantity || typeof quantity !== "number" || quantity <= 0) {
      return Response.json(
        { error: "Quantity must be greater than zero." },
        { status: 400 }
      );
    }

    // Check if sweet exists
    const sweet = await prisma.sweet.findUnique({ where: { id: sweetId } });

    if (!sweet) {
      return Response.json({ error: "Sweet not found." }, { status: 404 });
    }

    // Check stock availability
    if (sweet.quantity < quantity) {
      return Response.json(
        { error: "Not enough stock to fulfill purchase." },
        { status: 400 }
      );
    }

    // Perform stock update
    const updated = await prisma.sweet.update({
      where: { id: sweetId },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });

    return Response.json(
      {
        message: "Purchase successful!",
        remainingStock: updated.quantity,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Purchase error:", error);
    return Response.json({ error: "Internal server error." }, { status: 500 });
  }
}
