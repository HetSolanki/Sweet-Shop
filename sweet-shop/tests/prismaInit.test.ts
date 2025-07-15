// Verifies that the Prisma client initializes and connects to the SQLite database successfully

import { prisma } from "@/lib/prisma";
describe("Prisma Initialization", () => {
  it("should connect and return a PrismaClient instance", async () => {
    const version = await prisma.$queryRaw`SELECT sqlite_version();`;
    expect(version).toBeDefined();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
