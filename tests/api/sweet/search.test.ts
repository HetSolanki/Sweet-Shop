import { GET } from "@/app/api/sweets/route";
import { prisma } from "@/lib/prisma";
import { Sweet } from "@/types/sweetTypes";

// Test suite for the GET /api/sweets/ endpoint - (SEARCHING AND SORTING FUNCTIONS)
describe("GET /api/sweets - Search & Sort", () => {
  let categoryAId: string;
  let categoryBId: string;

  beforeEach(async () => {
    // Create test categories
    const [catA, catB] = await Promise.all([
      prisma.category.upsert({
        where: { name: "Milk-Based-2" },
        update: {},
        create: { name: "Milk-Based-2" },
      }),
      prisma.category.upsert({
        where: { name: "Nut-Based-1" },
        update: {},
        create: { name: "Nut-Based-1" },
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
  afterEach(async () => {
    await prisma.sweet.deleteMany({
      where: {
        categoryId: {
          in: [categoryAId, categoryBId],
        },
      },
    });
    await prisma.category.deleteMany({
      where: {
        id: {
          in: [categoryAId, categoryBId],
        },
      },
    });
    await prisma.$disconnect();
  });

  // Test case: Returns sweets matching a partial name
  it("should return sweets matching partial name", async () => {
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
    const req = new Request(
      "http://localhost/api/sweets?category=Milk-Based-2"
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(
      data.data.every((sweet: Sweet) => sweet.category?.name === "Milk-Based-2")
    ).toBe(true);
  });

  // Test case: Filters sweets by both name and category
  it("should return sweets matching both name and category", async () => {
    const req = new Request(
      "http://localhost/api/sweets?name=milk&category=Milk-Based-2"
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.data.length).toBe(1);
    expect(data.data[0].name).toBe("Milk Cake");
    expect(data.data[0].category.name).toBe("Milk-Based-2");
  });

  // Test case: filters sweets within a specific price range
  it("should return sweets within the specified price range", async () => {
    const req = new Request(
      "http://localhost/api/sweets?minPrice=30&maxPrice=50&category=Milk-based-2"
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
    const req = new Request(
      "http://localhost/api/sweets?sort=price_asc&category=Milk-based-2"
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    const prices = data.data.map((sweet: Sweet) => sweet.price);
    expect(prices).toEqual([...prices].sort());
  });

  // Test case: sorts sweets by name in descending order
  it("should return sweets sorted by name descending", async () => {
    const req = new Request(
      "http://localhost/api/sweets?sort=name_desc&category=Milk-based-2"
    );
    const res = await GET(req);
    const data = await res.json();

    const names = data.data.map((sweet: Sweet) => sweet.name);
    expect(names).toEqual([...names].sort().reverse());
  });

  // Test case: Returns an empty array if no matches found.
  it("should return empty array if no sweets match the filters", async () => {
    const req = new Request(
      "http://localhost/api/sweets?name=xyz&category=Milk-based-2"
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.data).toEqual([]);
  });
});
