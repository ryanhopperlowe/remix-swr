import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({ data: { email: "ryan@mail.com" } });

  await prisma.item.create({
    data: {
      name: "Blue Pants",
      description: "Blue Jeans",
      imagePath: "/Blue.png",
      price: 100.0,
      tags: {
        connectOrCreate: [
          { create: { name: "casual" }, where: { name: "casual" } },
          { create: { name: "blue" }, where: { name: "blue" } },
        ],
      },
    },
  });

  await prisma.item.create({
    data: {
      name: "Chino",
      imagePath: "/Chino.png",
      price: 100.0,
      tags: {
        connectOrCreate: [
          { create: { name: "casual" }, where: { name: "casual" } },
          { create: { name: "tan" }, where: { name: "tan" } },
        ],
      },
    },
  });

  await prisma.item.create({
    data: {
      name: "Gray Pants",
      imagePath: "/Grey.png",
      price: 100.0,
      tags: {
        connectOrCreate: [
          { create: { name: "casual" }, where: { name: "casual" } },
          { create: { name: "grey" }, where: { name: "grey" } },
        ],
      },
    },
  });

  await prisma.item.create({
    data: {
      name: "Khaki Pants",
      imagePath: "/Khaki.png",
      price: 100.0,
      tags: {
        connectOrCreate: [
          { create: { name: "casual" }, where: { name: "casual" } },
          { create: { name: "tan" }, where: { name: "tan" } },
        ],
      },
    },
  });

  await prisma.item.create({
    data: {
      name: "Tan Pants",
      imagePath: "/Tan.png",
      price: 100.0,
      tags: {
        connectOrCreate: [
          { create: { name: "casual" }, where: { name: "casual" } },
          { create: { name: "tan" }, where: { name: "tan" } },
        ],
      },
    },
  });

  await prisma.item.create({
    data: {
      name: "Washed Pants",
      imagePath: "/Washed.png",
      price: 100.0,
      tags: {
        connectOrCreate: [
          { create: { name: "casual" }, where: { name: "casual" } },
          { create: { name: "blue" }, where: { name: "blue" } },
        ],
      },
    },
  });
}

main()
  .then(() => console.log("Seeded"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
