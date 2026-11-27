ALTER TABLE "site_content"
ADD COLUMN "history_label" TEXT NOT NULL DEFAULT 'MENGENAL WARISAN KULINER';

ALTER TABLE "site_content"
ADD COLUMN "history_title" TEXT NOT NULL DEFAULT 'Jejak Sejarah Gado-Gado';

ALTER TABLE "site_content"
ADD COLUMN "history_slides" TEXT NOT NULL DEFAULT '[]';
