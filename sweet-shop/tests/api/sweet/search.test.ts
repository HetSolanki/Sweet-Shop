import { GET } from "@/app/api/sweets/route";
import { prisma } from "@/lib/prisma";
import { Sweet } from "@/types/sweetTypes";

// Test suite for the GET /api/sweets/ endpoint - (SEARCHING AND SORTING FUNCTIONS)
describe("GET /api/sweets - Search & Sort", () => {
  let categoryAId: string;
  let categoryBId: string;

  beforeAll(async () => {
    // Create two test categories
    const [catA, catB] = await Promise.all([
      prisma.category.upsert({
        where: { name: "Milk-Based" },
        update: {},
        create: { name: "Milk-Based" },
      }),
      prisma.category.upsert({
        where: { name: "Nut-Based" },
        update: {},
        create: { name: "Nut-Based" },
      }),
    ]);

    categoryAId = catA.id;
    categoryBId = catB.id;

    // Create test sweets
    await prisma.sweet.createMany({
      data: [
        {
          name: "Kaju Katli",
          price: 45,
          quantity: 10,
          categoryId: categoryBId,
        },
        {
          name: "Rasgulla",
          price: 30,
          quantity: 5,
          categoryId: categoryAId,
        },
        {
          name: "Milk Cake",
          price: 25,
          quantity: 8,
          categoryId: categoryAId,
        },
        {
          name: "Badam Halwa",
          price: 60,
          quantity: 6,
          categoryId: categoryBId,
        },
      ],
    });
  });

  // Clean up the database after tests - (deleting test categories and sweets created)
  afterAll(async () => {
    await prisma.sweet.deleteMany({
      where: {
        categoryId: categoryAId || categoryBId,
      },
    });
    await prisma.category.delete({
      where: {
        id: categoryAId || categoryBId,
      },
    });
    await prisma.$disconnect();
  });

  // Test case: Returns sweets matching a partial name
  it("should retu   rn sweets matching partial name (case-insensitive)", async () => {
    const req = new Request("http://localhost/api/sweets?name=katli");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "Kaju Katli" })])
    );
  });

  // Test case: Filters sweets by category name
  it("should return sweets matching category name", async () => {
    const req = new Request("http://localhost/api/sweets?category=Milk-Based");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(
      data.data.every((sweet: Sweet) => sweet.category?.id === "Milk-Based")
    ).toBe(true);
  });

  // Test case: Filters sweets by both name and category
  it("should return sweets matching both name and category", async () => {
    const req = new Request(
      "http://localhost/api/sweets?name=milk&category=Milk-Based"
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.data.length).toBe(1);
    expect(data.data[0].name).toBe("Milk Cake");
  });

  // Test case: filters sweets within a specific price range
  it("should return sweets within the specified price range", async () => {
    const req = new Request(
      "http://localhost/api/sweets?minPrice=30&maxPrice=50"
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(
      data.data.every((sweet: Sweet) => sweet.price >= 30 && sweet.price <= 50)
    ).toBe(true);
  });

  // Test case: sorts sweets by price in ascending order
  it("should return sweets sorted by price ascending", async () => {
    const req = new Request("http://localhost/api/sweets?sort=price_asc");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    const prices = data.data.map((sweet: Sweet) => sweet.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  // Test case: sorts sweets by name in descending order
  it("should return sweets sorted by name descending", async () => {
    const req = new Request("http://localhost/api/sweets?sort=name_desc");
    const res = await GET(req);
    const data = await res.json();

    const names = data.data.map((sweet: Sweet) => sweet.name);
    expect(names).toEqual([...names].sort().reverse());
  });

  // Test case: Returns an empty array if no matches found.
  it("should return empty array if no sweets match the filters", async () => {
    const req = new Request("http://localhost/api/sweets?name=xyz");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.data).toEqual([]);
  });
});
