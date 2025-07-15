import { POST } from "@/app/api/sweets/add/route";

describe("POST /api/sweets", () => {
  it("should create a new sweet when given valid input", async () => {
    // Define the request body with valid sweet data
    const body = {
      name: "Kaju Katli",
      price: 45,
      quantity: 10,
      category: "Nut-Based",
    };

    // Create a mock Web API Request object as used in Next.js App Router
    const req = new Request("http://localhost/api/sweets/add", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Call the actual POST handler from the API route
    const res = await POST(req);

    // Parse the returned response
    const data = await res.json();

    // Validate response status and body contents
    expect(res.status).toBe(201);
    expect(data.message).toBe("Sweet Addeed Successfully.!");
  });
});
