import { DELETE } from "@/app/api/sweets/delete/[id]/route";
import { prisma } from "@/lib/prisma";

// Test suite for the POST /api/sweets/delete endpoint
describe("DELETE /api/sweets/delete/:id", () => {
  let sweetId: string;
  let categoryId: string;

  // Seed a test category and sweet before running the tests
  beforeEach(async () => {
    const category = await prisma.category.upsert({
      where: { name: "methai-mix" },
      update: {},
      create: { name: "methai-mix" },
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

  // Test case: Deleting a valid sweet should return success message
  it("should return 200 and success message when sweet is deleted", async () => {
    const req = new Request(`http://localhost/api/sweets/delete/${sweetId}`, {
      method: "DELETE",
    });

    const params = {
      id: sweetId,
    };

    const res = await DELETE(req, { params });
    const data = await res.json();

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

    expect(res.status).toBe(404);
    expect(data.error).toBe("Sweet not found.");
  });

  // Test case: Missing field should returns 400 and error message
  it("should return 400 and error message when fields are missing", async () => {
    const invalidId = "invalid-id"; // Invalid sweetId

    const req = new Request(`http://localhost/api/sweets/delete/${invalidId}`, {
      method: "DELETE",
    });

    const params = {
      id: "", // Missing id field
    };
    const res = await DELETE(req, { params });
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("All fields are required");
  });
});
