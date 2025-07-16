import { prisma } from "@/lib/prisma";

async function main() {
  // Create categories
  const nutBased = await prisma.category.upsert({
    where: { name: "Nut-Based" },
    update: {},
    create: { name: "Nut-Based" },
  });

  const milkBased = await prisma.category.upsert({
    where: { name: "Milk-Based" },
    update: {},
    create: { name: "Milk-Based" },
  });

  const fruitBased = await prisma.category.upsert({
    where: { name: "Fruit-Based" },
    update: {},
    create: { name: "Fruit-Based" },
  });

  // Create sweets
  await prisma.sweet.createMany({
    data: [
      {
        name: "Kaju Katli",
        price: 45,
        quantity: 20,
        categoryId: nutBased.id,
      },
      {
        name: "Rasgulla",
        price: 30,
        quantity: 50,
        categoryId: milkBased.id,
      },
      {
        name: "Dry Fruit Ladoo",
        price: 55,
        quantity: 25,
        categoryId: nutBased.id,
      },
      {
        name: "Mango Barfi",
        price: 40,
        quantity: 10,
        categoryId: fruitBased.id,
      },
      {
        name: "Milk Cake",
        price: 35,
        quantity: 15,
        categoryId: milkBased.id,
      },
    ],
  });

  console.log("✅ Seeded sweet shop database successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
