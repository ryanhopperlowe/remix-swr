import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({ data: { email: "test@test.com" } });

  const items = await prisma.item.createMany({
    data: [{ name: "Item 1", price: 100 }],
  });
}
