const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
  try {
    await db.category.createMany({
      data: [
        {
          name: "Computer Science",
        },
        {
          name: "Music",
        },
        {
          name: "Fitness",
        },
        {
          name: "Photography",
        },
        {
          name: "Accounting",
        },
        {
          name: "Engineering",
        },
        {
          name: "Filming",
        },
      ],
    });
  } catch (error) {
    console.log("[Error seeding database categories]", error);
  } finally {
    await db.$disconnect();
  }
}

main();
