import { DELETE } from "@/app/api/sweets/delete/[id]/route";
import { prisma } from "@/lib/prisma";

// Test suite for the POST /api/sweets/delete endpoint
describe("DELETE /api/sweets/delete/:id", () => {
  let sweetId: string;
  let categoryId: string;

  // Seed a test category and sweet before running the tests
  beforeAll(async () => {
    const category = await prisma.category.upsert({
      where: { name: "test-category" },
      update: {},
      create: { name: "test-category" },
    });

    categoryId = category.id; // Save category ID for deletion test

    const sweet = await prisma.sweet.create({
      data: {
        name: "Rasgulla",
        price: 30,
        quantity: 20,
        category: {
          connect: { id: category.id },
        },
      },
    });

    sweetId = sweet.id; // Save sweet ID for deletion test
  });

  // Clean up the database after tests - (Removing test category created)
  afterAll(async () => {
    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    await prisma.$disconnect();
  });

  // Test case: Deleting a valid sweet should return success message
  it("should return 200 and success message when sweet is deleted", async () => {
    // Create a DELETE mock request to simulate the client call
    const req = new Request(`http://localhost/api/sweets/delete/${sweetId}`, {
      method: "DELETE",
    });

    const params = {
      id: sweetId,
    };

    // Call the actual route handler with mocked request and params([:id])
    const res = await DELETE(req, { params });

    // Parse response JSON body
    const data = await res.json();

    // Assert that deletion was successful
    expect(res.status).toBe(200);
    expect(data.message).toBe("Sweet deleted successfully.");
  });

  // Test case: Deleting a non-existent sweet should return 404
  it("should return 404 when sweet with given ID does not exist", async () => {
    const invalidId = "invalid-id"; // Invalid sweetId

    // Create an DELETE mock request to simulate client call
    const req = new Request(`http://localhost/api/sweets/delete/${invalidId}`, {
      method: "DELETE",
    });

    const params = {
      id: invalidId,
    };

    // Call actual route handler with mocked request and params([:id])
    const res = await DELETE(req, { params });
    const data = await res.json();

    // Assert that a proper error message is returned
    expect(res.status).toBe(404);
    expect(data.error).toBe("Sweet not found.");
  });
});
