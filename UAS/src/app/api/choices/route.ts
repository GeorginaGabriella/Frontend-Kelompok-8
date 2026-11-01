import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const username =
    request.nextUrl.searchParams.get("username") || "guest";

  const rows = db.prepare(`
    SELECT menu_name
    FROM choices
    WHERE username = ?
  `).all(username) as { menu_name: string }[];

  return NextResponse.json({
    choices: rows.map((item) => item.menu_name)
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
      INSERT OR IGNORE INTO choices (username, menu_name)
      VALUES (?, ?)
    `).run(username, menu_name);

    return NextResponse.json({
      message: "Menu berhasil ditambahkan."
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal menyimpan pilihan." },
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
        DELETE FROM choices
        WHERE username = ? AND menu_name = ?
      `).run(username, menu_name);
    } else {
      db.prepare(`
        DELETE FROM choices WHERE username = ?
      `).run(username);
    }

    return NextResponse.json({
      message: "Pilihan berhasil dihapus."
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus pilihan." },
      { status: 500 }
    );
  }
}
