import { POST } from "@/app/api/sweets/add/route";

// Test suite for the POST /api/sweets/add endpoint
describe("POST /api/sweets/add", () => {
  // Test for successful sweet creation with valid category ID
  it("should return 201 and success message when sweet is created with valid categoryId", async () => {
    const validCategoryId = "a2568acc-e41a-45b9-83c4-6322956a96d1";

    // Request body with valid data
    const body = {
      name: "Kaju Katli",
      price: 45,
      quantity: 10,
      categoryId: validCategoryId,
    };

    // Simulate a POST request
    const req = new Request("http://localhost/api/sweets/add", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Invoke the route handler
    const res = await POST(req);
    const data = await res.json();

    // Assertions
    expect(res.status).toBe(201);
    expect(data.message).toBe("Sweet added successfully!");
  });

  // Test for failure when category ID is invalid
  it("should return 400 and error message when categoryId is invalid", async () => {
    const body = {
      name: "Rasgulla",
      price: 30,
      quantity: 5,
      categoryId: "1", // Invalid or non-existent category ID
    };

    // Simulate a POST request
    const req = new Request("http://localhost/api/sweets/add", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Invoke the route handler
    const res = await POST(req);
    const data = await res.json();

    // Assertions
    expect(res.status).toBe(400);
    expect(data.error).toBe(
      "Invalid category. Please provide a valid category ID."
    );
  });
});
