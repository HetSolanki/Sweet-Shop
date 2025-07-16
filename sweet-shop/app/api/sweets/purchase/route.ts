import { purchaseSweet } from "@/lib/sweetUtils";

// POST /api/sweets/purchase - Handles sweet purchase and stock update
export async function POST(req: Request) {
  const body = await req.json();

  const result = await purchaseSweet(body); // Perform sweet purchase

  console.log(result);
  return Response.json(result, { status: result.status });
}
