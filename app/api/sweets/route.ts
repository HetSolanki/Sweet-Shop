import { searchSweet } from "@/lib/sweetUtils";

// GET /api/sweets - Handles search, filter, and sort
export async function GET(req: Request) {
  const searchParams = new URL(req.url);

  const res = await searchSweet(searchParams); // Perform searching and sorting

  return Response.json({ data: res.data }, { status: res.status });
}
