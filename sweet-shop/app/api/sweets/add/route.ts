import { addSweets } from "@/lib/sweetUtils";

// Route handler for POST /api/sweets/add
// Adds a new sweet to the database and returns a success or error response
export async function POST(req: Request) {
  // Parse the incoming request body
  const reqData = await req.json();

  // Delegate insertion logic to the service function
  const result = await addSweets(reqData);

  // Return the structured response with correct status
  return Response.json(
    { message: result.message, error: result.error },
    { status: result.status }
  );
}
