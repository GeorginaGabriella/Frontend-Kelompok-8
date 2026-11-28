import { seedDatabase } from "../src/lib/seed";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Mulai mengisi database Prisma Postgres...");

  await seedDatabase();

  console.log("\nSeed berhasil dijalankan!");
  console.log("Jumlah data:");

  const users = await prisma.user.count();
  const menus = await prisma.menu.count();
  const faqs = await prisma.faq.count();
  const favorites = await prisma.favorite.count();
  const choices = await prisma.choice.count();
  const siteContent = await prisma.siteContent.count();

  console.log("Users:", users);
  console.log("Menus:", menus);
  console.log("FAQs:", faqs);
  console.log("Favorites:", favorites);
  console.log("Choices:", choices);
  console.log("Site Content:", siteContent);
}

main()
  .catch((error) => {
    console.error("Seed gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
