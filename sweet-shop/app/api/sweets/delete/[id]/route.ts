import { deleteSweet } from "@/lib/sweetUtils";

// Route handler for DELETE /api/sweets/delete/[id]
// Deletes a sweet by ID and returns appropriate status and message
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  // Delegate deletion logic to the service function
  const result = await deleteSweet(id);

  // Return response with correct status and message or error
  return Response.json(result, { status: result.status });
}
