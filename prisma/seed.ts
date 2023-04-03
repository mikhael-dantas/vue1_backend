// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// async function main() {
//   const uuid = "123e4567-e89b-12d3-a456-426655440000";
//   const photo = "photo.jpg";
//   const news = "Some news";
//   const friendlyUrl = "some-friendly-url";
//   const newsTitle = "Some news title";
//   const postDay = new Date("2023-03-31");

//   await prisma.myTable.create({
//     data: {
//       uuid,
//       photo,
//       news,
//       friendlyUrl,
//       newsTitle,
//       postDay,
//     },
//   });

//   console.log("Seed data inserted.");
// }

// main()
//   .catch((e) => console.error(e))
//   .finally(() => prisma.$disconnect());
