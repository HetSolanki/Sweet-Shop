import { GET } from "@/app/api/sweets/route";
import { prisma } from "@/lib/prisma";
import { Sweet } from "@/src/generated/prisma";
import { SweetSeed } from "@/types/sweetSeed";

describe("Get all the sweets which are in stock", () => {
  let categoryId: string;
  let testData: SweetSeed[] = [];
  
  // Seed testing sweets and category
  beforeAll(async () => {
    const category = await prisma.category.create({
      data: {
        name: "chocolates",
      },
    });

    categoryId = category.id; // Save category ID for deleting testing data

    testData = [
      {
        name: "Kaju Katli",
        price: 45,
        quantity: 20,
        categoryId: categoryId,
      },
      {
        name: "Rasgulla",
        price: 30,
        quantity: 50,
        categoryId: categoryId,
      },
      {
        name: "Soan Papdi",
        price: 25,
        quantity: 0,
        categoryId: categoryId,
      },
      {
        name: "Ladoo",
        price: 20,
        quantity: 60,
        categoryId: categoryId,
      },
      {
        name: "Badam Halwa",
        price: 60,
        quantity: 15,
        categoryId: categoryId,
      },
    ];
    await prisma.sweet.createMany({
      data: testData,
    });
  });

  // Cleanup DB after test - deleting test sweets and categories
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
  });

  // Test Case: Retrives all the records available in stocks
  it("should returns all the records available in stocks", async () => {
    const req = new Request("http://localhost/api/sweets", {
      method: "GET",
    });
    const res = await GET(req);
    const data = await res.json();

    console.log(data);
    expect(res.status).toBe(200);
    expect(data.data.length).toBe(4);
    expect(
      data.data.every((sweet: Sweet) =>
        testData.some((item: SweetSeed) => {
          return (
            item.name === sweet.name &&
            item.price === sweet.price &&
            item.quantity === sweet.quantity &&
            item.categoryId === sweet.categoryId &&
            item.quantity !== 0
          );
        })
      )
    ).toBe(true);
  });
});
