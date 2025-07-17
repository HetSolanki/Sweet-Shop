import { POST } from "@/app/api/sweets/restock/route";
import { prisma } from "@/lib/prisma";

describe("POST /api/sweets/restock", () => {
  let sweetId: string;
  let categoryId: string;

  // Seed a category and sweet before each test
  beforeEach(async () => {
    const category = await prisma.category.create({
      data: { name: "vegetable-based" },
    });

    categoryId = category.id;

    const sweet = await prisma.sweet.create({
      data: {
        name: "Methi Pak",
        price: 101,
        quantity: 12,
        categoryId,
      },
    });

    sweetId = sweet.id;
  });

  // Clean up sweet and category after each test
  afterEach(async () => {
    await prisma.sweet.deleteMany({ where: { categoryId } });
    await prisma.category.delete({ where: { id: categoryId } });
  });

  // Test case: Restocking successfully updates quantity
  it("should update the sweet's quantity when restocked", async () => {
    const req = new Request("http://localhost/api/sweets/restock", {
      method: "POST",
      body: JSON.stringify({
        sweetId,
        quantity: 5,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBe("Restock successful!");
    expect(data.updatedQuantity).toBe(17); // 12 + 5
  });

  // Test case: Invalid sweet ID
  it("should return 404 for non-existing sweet ID", async () => {
    const req = new Request("http://localhost/api/sweets/restock", {
      method: "POST",
      body: JSON.stringify({
        sweetId: "non-existent-id",
        quantity: 5,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe("Sweet not found.");
  });

  // Test case: Negative restock quantity
  it("should return 400 if restock quantity is negative", async () => {
    const req = new Request("http://localhost/api/sweets/restock", {
      method: "POST",
      body: JSON.stringify({
        sweetId,
        quantity: -3,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Quantity must be greater than zero.");
  });

  // Test case: Missing quantity field
  it("should return 400 if quantity is missing or invalid", async () => {
    const req = new Request("http://localhost/api/sweets/restock", {
      method: "POST",
      body: JSON.stringify({
        sweetId,
        // quantity is missing
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Quantity must be greater than zero.");
  });
});
