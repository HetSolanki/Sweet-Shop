import { addSweets } from "@/lib/sweetUtils";

// Handles POST requests to add a new sweet to the store
export async function POST(req: Request) {
  // Parse the incoming request body as JSON
  const reqData = await req.json();

  // Call the addSweets utility function to handle the logic (e.g. insert into DB)
  const res = addSweets(reqData);

  // Return a success message with 201 Created status
  return Response.json(
    { message: "Sweet Addeed Successfully.!" },
    { status: 201 }
  );
}
