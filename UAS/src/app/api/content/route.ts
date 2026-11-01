import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { seedDatabase } from "@/lib/seed";

export const runtime = "nodejs";

export async function GET() {
  seedDatabase();

  const content = db.prepare(`
    SELECT hero_description AS heroDescription,
           about_description AS aboutDescription
    FROM site_content
    WHERE id = 1
  `).get();

  return NextResponse.json({ content });
}

export async function PUT(request: NextRequest) {
  try {
    const { heroDescription, aboutDescription } =
      await request.json();

    db.prepare(`
      INSERT INTO site_content
      (id, hero_description, about_description)
      VALUES (1, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        hero_description = excluded.hero_description,
        about_description = excluded.about_description
    `).run(heroDescription, aboutDescription);

    return NextResponse.json({
      message: "Konten berhasil diperbarui."
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui konten." },
      { status: 500 }
    );
  }
}
