import { restockSweets } from "@/lib/sweetUtils";

// POST /api/sweets/restock - Handles sweet restocks and quantity updates
export async function POST(req: Request) {
  const body = await req.json();

  const result = await restockSweets(body); // restock the sweet

  return Response.json(result, { status: result.status });
}
