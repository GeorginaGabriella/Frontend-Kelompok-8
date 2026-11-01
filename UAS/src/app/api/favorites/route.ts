import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const username =
    request.nextUrl.searchParams.get("username") || "guest";

  const rows = db.prepare(`
    SELECT menu_name
    FROM favorites
    WHERE username = ?
  `).all(username) as { menu_name: string }[];

  return NextResponse.json({
    favorites: rows.map((item) => item.menu_name)
  });
}

export async function POST(request: NextRequest) {
  try {
    const { username = "guest", menu_name } =
      await request.json();

    if (!menu_name) {
      return NextResponse.json(
        { error: "Nama menu harus diisi." },
        { status: 400 }
      );
    }

    db.prepare(`
      INSERT OR IGNORE INTO favorites (username, menu_name)
      VALUES (?, ?)
    `).run(username, menu_name);

    return NextResponse.json({
      message: "Favorit berhasil ditambahkan."
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal menyimpan favorit." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { username = "guest", menu_name } =
      await request.json();

    if (menu_name) {
      db.prepare(`
        DELETE FROM favorites
        WHERE username = ? AND menu_name = ?
      `).run(username, menu_name);
    } else {
      db.prepare(`
        DELETE FROM favorites WHERE username = ?
      `).run(username);
    }

    return NextResponse.json({
      message: "Favorit berhasil dihapus."
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus favorit." },
      { status: 500 }
    );
  }
}
