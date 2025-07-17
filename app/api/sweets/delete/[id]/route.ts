import { deleteSweet } from "@/lib/sweetUtils";

// DELETE /api/sweets/delete/[id] - Removes a sweet by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const result = await deleteSweet(id); // Perform deletion

  return Response.json(result, { status: result.status });
}
