import { prisma } from "./prisma";
import {
  initialMenus,
  defaultFaqs,
  defaultSiteContent,
  defaultDiscountCodes,
  adminAccount,
} from "@/data/gadoGadoData";

export async function seedDatabase() {
  const menuCount = await prisma.menu.count();

  if (menuCount === 0) {
    for (const menu of initialMenus) {
      await prisma.menu.create({
        data: {
          slug: menu.slug,
          name: menu.name,
          data: JSON.stringify(menu),
        },
      });
    }
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
    update: {
      name: adminAccount.name,
      password: adminAccount.password!,
      role: "admin",
    },
    create: {
      name: adminAccount.name,
      username: adminAccount.username,
      password: adminAccount.password!,
      role: "admin",
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

  for (const discount of defaultDiscountCodes) {
    await prisma.discountCode.upsert({
      where: { code: discount.code },
      update: {},
      create: {
        code: discount.code,
        label: discount.label,
        type: discount.type,
        value: discount.value,
        minSpend: discount.minSpend,
        maxDiscount: discount.maxDiscount,
        freeShipping: discount.freeShipping,
        active: true,
      },
    });
  }

  const commentCount = await prisma.comment.count();

  if (commentCount === 0) {
    await prisma.comment.createMany({
      data: [
        {
          name: "Dina Pratiwi",
          topic: "Rasa Menu",
          rating: 5,
          message:
            "Gado-Gado Betawi-nya mantap, bumbu kacangnya tidak terlalu manis. Es cendolnya juga segar banget!",
          reply:
            "Terima kasih Dina! Senang sekali paket gado-gado dan es cendolnya cocok untuk kamu.",
          published: true,
        },
        {
          name: "Rafi Hidayat",
          topic: "Pengiriman",
          rating: 4,
          message:
            "Pesanan sampai 30 menit dan masih hangat. Mungkin lontongnya bisa dipisah supaya tidak lembek.",
          reply:
            "Masukan diterima, Rafi. Mulai sekarang lontong kami kemas terpisah dari saus kacang.",
          published: true,
        },
      ],
    });
  }
}