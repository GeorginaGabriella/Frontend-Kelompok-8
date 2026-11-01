import db from "./db";
import {
  initialMenus,
  defaultFaqs,
  defaultSiteContent,
  adminAccount,
} from "@/data/gadoGadoData";

export function seedDatabase() {
  const insertMenu = db.prepare(`
    INSERT OR IGNORE INTO menus (slug, name, data)
    VALUES (?, ?, ?)
  `);

  const insertFaq = db.prepare(`
    INSERT INTO faqs (question, answer)
    SELECT ?, ?
    WHERE NOT EXISTS (
      SELECT 1 FROM faqs WHERE question = ?
    )
  `);

  const insertAdmin = db.prepare(`
    INSERT OR IGNORE INTO users
    (name, username, password, role)
    VALUES (?, ?, ?, ?)
  `);

  const insertContent = db.prepare(`
    INSERT OR IGNORE INTO site_content
    (id, hero_description, about_description)
    VALUES (1, ?, ?)
  `);

  const transaction = db.transaction(() => {
    for (const menu of initialMenus) {
      insertMenu.run(
        menu.slug,
        menu.name,
        JSON.stringify(menu)
      );
    }

    for (const faq of defaultFaqs) {
      insertFaq.run(
        faq.question,
        faq.answer,
        faq.question
      );
    }

    insertAdmin.run(
      adminAccount.name,
      adminAccount.username,
      adminAccount.password,
      adminAccount.role
    );

    insertContent.run(
      defaultSiteContent.heroDescription,
      defaultSiteContent.aboutDescription
    );
  });

  transaction();
}
