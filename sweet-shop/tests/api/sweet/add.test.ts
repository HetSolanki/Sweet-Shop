import { POST } from "@/app/api/sweets/add/route";
import { prisma } from "@/lib/prisma";

// Test suite for the POST /api/sweets/add endpoint
describe("POST /api/sweets/add", () => {
  let categoryId: string;

  beforeAll(async () => {
    const category = await prisma.category.upsert({
      where: { name: "Milk-Based" },
      update: {},
      create: { name: "Milk-Based" },
    });

    categoryId = category.id; // Save ID for deletion test
  });

  // Clean up the database after tests
  afterAll(async () => {
    await prisma.sweet.deleteMany({
      where: {
        categoryId,
      },
    });
    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
    await prisma.$disconnect();
  });

  // Test case: Creating a sweet with a valid categoryId should return 201 and success message
  it("should return 201 and success message when sweet is created with valid categoryId", async () => {
    const validCategoryId = categoryId; // ValidId

    // Request payload with valid sweet data
    const body = {
      name: "Kaju Katli",
      price: 45,
      quantity: 10,
      categoryId: validCategoryId,
    };

    // Simulate a POST request to the API
    const req = new Request("http://localhost/api/sweets/add", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Call the POST handler
    const res = await POST(req);
    const data = await res.json();

    // Assert response status and returned message
    expect(res.status).toBe(201);
    expect(data.message).toBe("Sweet added successfully!");
  });

  // Test case: Providing an invalid categoryId should return 400 and error message
  it("should return 400 and error message when categoryId is invalid", async () => {
    const body = {
      name: "Rasgulla",
      price: 30,
      quantity: 5,
      categoryId: "1", // Invalid category ID that doesn’t exist in DB
    };

    // Simulate a POST request to the API
    const req = new Request("http://localhost/api/sweets/add", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Call the POST handler
    const res = await POST(req);
    const data = await res.json();

    // Assert response status and error message
    expect(res.status).toBe(400);
    expect(data.error).toBe(
      "Invalid category. Please provide a valid category ID."
    );
  });
});
