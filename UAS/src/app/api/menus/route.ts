import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { seedDatabase } from "@/lib/seed";

export const runtime = "nodejs";

export async function GET() {
  seedDatabase();

  const rows = db.prepare(`
    SELECT data FROM menus ORDER BY id ASC
  `).all() as { data: string }[];

  const menus = rows.map((row) => JSON.parse(row.data));

  return NextResponse.json({
    total: menus.length,
    menus
  });
}

export async function PUT(request: NextRequest) {
  try {
    const { name, updated } = await request.json();

    const row = db.prepare(`
      SELECT slug, data FROM menus WHERE name = ?
    `).get(name) as
      | { slug: string; data: string }
      | undefined;

    if (!row) {
      return NextResponse.json(
        { error: "Menu tidak ditemukan." },
        { status: 404 }
      );
    }

    const oldMenu = JSON.parse(row.data);
    const newMenu = { ...oldMenu, ...updated };

    db.prepare(`
      UPDATE menus
      SET name = ?, data = ?
      WHERE slug = ?
    `).run(newMenu.name, JSON.stringify(newMenu), row.slug);

    return NextResponse.json({
      message: "Menu berhasil diperbarui.",
      menu: newMenu
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui menu." },
      { status: 500 }
    );
  }
}
