-- CreateTable
CREATE TABLE "comments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "menu_slug" TEXT NOT NULL DEFAULT 'umum',
    "topic" TEXT NOT NULL DEFAULT 'Umum',
    "rating" INTEGER NOT NULL DEFAULT 5,
    "message" TEXT NOT NULL,
    "reply" TEXT NOT NULL DEFAULT '',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_site_content" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "hero_description" TEXT NOT NULL,
    "about_description" TEXT NOT NULL,
    "history_label" TEXT NOT NULL DEFAULT 'MENGENAL WARISAN KULINER',
    "history_title" TEXT NOT NULL DEFAULT 'Jejak Sejarah Gado-Gado',
    "history_slides" TEXT NOT NULL DEFAULT '[]'
);
INSERT INTO "new_site_content" ("about_description", "hero_description", "id") SELECT "about_description", "hero_description", "id" FROM "site_content";
DROP TABLE "site_content";
ALTER TABLE "new_site_content" RENAME TO "site_content";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "comments_menu_slug_idx" ON "comments"("menu_slug");
