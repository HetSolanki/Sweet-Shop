import { addSweets } from "@/lib/sweetUtils";

// POST /api/sweets/add - Handles sweet creation
export async function POST(req: Request) {
  const reqData = await req.json();

  const result = await addSweets(reqData); // Perform sweet creation

  return Response.json(result, { status: result.status });
}
