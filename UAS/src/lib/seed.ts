import { prisma } from "./prisma";
import {
  initialMenus,
  defaultFaqs,
  defaultSiteContent,
  adminAccount,
} from "@/data/gadoGadoData";

export async function seedDatabase() {
  for (const menu of initialMenus) {
    await prisma.menu.upsert({
      where: { slug: menu.slug },
      update: {},
      create: {
        slug: menu.slug,
        name: menu.name,
        data: JSON.stringify(menu),
      },
    });
  }

  for (const faq of defaultFaqs) {
    const existingFaq = await prisma.faq.findFirst({
      where: { question: faq.question },
    });

    if (!existingFaq) {
      await prisma.faq.create({
        data: {
          question: faq.question,
          answer: faq.answer,
        },
      });
    }
  }

  await prisma.user.upsert({
    where: { username: adminAccount.username },
    update: {},
    create: {
      name: adminAccount.name,
      username: adminAccount.username,
      password: adminAccount.password!,
      role: adminAccount.role,
    },
  });

  await prisma.siteContent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      heroDescription: defaultSiteContent.heroDescription,
      aboutDescription: defaultSiteContent.aboutDescription,
    },
  });
}
