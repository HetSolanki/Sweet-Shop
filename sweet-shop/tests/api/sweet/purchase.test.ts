import { POST as purchaseSweet } from "@/app/api/sweets/purchase/route";
import { prisma } from "@/lib/prisma";

describe("POST /api/sweets/purchase", () => {
  let sweetId: string;
  let categoryId: string;

  // Seed a test sweet and category before each test
  beforeEach(async () => {
    const category = await prisma.category.create({
      data: { name: "PurchaseTestCategory" },
    });

    categoryId = category.id;

    const sweet = await prisma.sweet.create({
      data: {
        name: "Test Sweet",
        price: 50,
        quantity: 10,
        categoryId,
      },
    });

    sweetId = sweet.id;
  });

  // Clean up test data after each test
  afterEach(async () => {
    await prisma.sweet.deleteMany({ where: { categoryId } });
    await prisma.category.delete({ where: { id: categoryId } });
  });

  // Test case: Successful purchase
  it("should reduce stock and return success response", async () => {
    const req = new Request("http://localhost/api/sweets/purchase", {
      method: "POST",
      body: JSON.stringify({ sweetId, quantity: 3 }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await purchaseSweet(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBe("Purchase successful!");
    expect(data.remainingStock).toBe(7); // 10 - 3
  });

  // Test case: Quantity exceeds available stock
  it("should return 400 if requested quantity exceeds stock", async () => {
    const req = new Request("http://localhost/api/sweets/purchase", {
      method: "POST",
      body: JSON.stringify({ sweetId, quantity: 15 }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await purchaseSweet(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Not enough stock to fulfill purchase.");
  });

  // Test case: Invalid or non-existent sweet ID
  it("should return 404 for invalid sweet ID", async () => {
    const req = new Request("http://localhost/api/sweets/purchase", {
      method: "POST",
      body: JSON.stringify({ sweetId: "non-existent-id", quantity: 2 }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await purchaseSweet(req);
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe("Sweet not found.");
  });

  // Test case: Invalid purchase quantity (e.g. zero)
  it("should return 400 for non-positive quantity", async () => {
    const req = new Request("http://localhost/api/sweets/purchase", {
      method: "POST",
      body: JSON.stringify({ sweetId, quantity: 0 }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await purchaseSweet(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Quantity must be greater than zero.");
  });
});
