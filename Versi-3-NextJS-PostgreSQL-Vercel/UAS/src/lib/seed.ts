import { prisma } from "./prisma";
import {
  initialMenus,
  defaultFaqs,
  defaultSiteContent,
  adminAccount,
} from "@/data/gadoGadoData";

export async function seedDatabase() {
  await prisma.menu.createMany({
    data: initialMenus.map((menu) => ({
      slug: menu.slug,
      name: menu.name,
      data: JSON.stringify(menu),
    })),
    skipDuplicates: true,
  });

  const faqCount = await prisma.faq.count();

  if (faqCount === 0) {
    await prisma.faq.createMany({
      data: defaultFaqs.map((faq) => ({
        question: faq.question,
        answer: faq.answer,
      })),
    });
  }

  await prisma.user.upsert({
    where: {
      username: adminAccount.username,
    },
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
    where: {
      id: 1,
    },
    update: {},
    create: {
      id: 1,
      heroDescription: defaultSiteContent.heroDescription,
      aboutDescription: defaultSiteContent.aboutDescription,
    },
  });

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
