import { POST } from "@/app/api/sweets/add/route";
import { prisma } from "@/lib/prisma";

// Test suite for the POST /api/sweets/add endpoint
describe("POST /api/sweets/add", () => {
  let categoryId: string;

  // Seed a test category before running the tests
  beforeEach(async () => {
    const category = await prisma.category.upsert({
      where: { name: "test-category" },
      update: {},
      create: { name: "test-category" },
    });

    categoryId = category.id; // Save sweet ID for deletion test
  });

  // Clean up the database after tests - (deleting test category and sweet created)
  afterEach(async () => {
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
    const validCategoryId = categoryId; // Valid-Id

    const body = {
      name: "Kaju Katli",
      price: 45,
      quantity: 10,
      categoryId: validCategoryId,
    };

    const req = new Request("http://localhost/api/sweets/add", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await POST(req);
    const data = await res.json();

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

    const req = new Request("http://localhost/api/sweets/add", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe(
      "Invalid category. Please provide a valid category ID."
    );
  });
});
