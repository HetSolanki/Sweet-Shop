import { DELETE } from "@/app/api/sweets/delete/[id]/route";
import { prisma } from "@/lib/prisma";

describe("DELETE /api/sweets/delete/[id]", () => {
  let sweetId: string;

  // Seed a test sweet before running the tests
  beforeAll(async () => {
    const category = await prisma.category.upsert({
      where: { name: "Milk-Based" },
      update: {},
      create: { name: "Milk-Based" },
    });

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

    sweetId = sweet.id; // Save ID for deletion test
  });

  // Clean up the database after tests
  afterAll(async () => {
    await prisma.sweet.deleteMany();
    await prisma.category.deleteMany();
    await prisma.$disconnect();
  });

  // Test case: Deleting a valid sweet should return success message
  it("should return 200 and success message when sweet is deleted", async () => {
    // Create a DELETE request to simulate the client call
    const req = new Request(`http://localhost/api/sweets/delete/${sweetId}`, {
      method: "DELETE",
    });

    // Call the actual route handler with mocked request and params
    const params = {
      id: sweetId,
    };
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

    const req = new Request(`http://localhost/api/sweets/delete/${invalidId}`, {
      method: "DELETE",
    });

    const params = {
      id: invalidId,
    };

    const res = await DELETE(req, { params });
    const data = await res.json();

    // Assert that a proper error message is returned
    expect(res.status).toBe(404);
    expect(data.error).toBe("Sweet not found.");
  });
});
