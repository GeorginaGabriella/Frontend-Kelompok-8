import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { seedDatabase } from "@/lib/seed";

export const runtime = "nodejs";

export async function GET() {
  seedDatabase();

  const users = db.prepare(`
    SELECT name, username, password, role
    FROM users
  `).all();

  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  seedDatabase();

  try {
    const body = await request.json();
    const { action, name, username, password } = body;

    if (action === "register") {
      if (!name || !username || !password || password.length < 6) {
        return NextResponse.json(
          { error: "Data register tidak valid." },
          { status: 400 }
        );
      }

      const existing = db.prepare(
        "SELECT id FROM users WHERE username = ?"
      ).get(username.toLowerCase());

      if (existing) {
        return NextResponse.json(
          { error: "Username sudah digunakan." },
          { status: 409 }
        );
      }

      db.prepare(`
        INSERT INTO users (name, username, password, role)
        VALUES (?, ?, ?, 'user')
      `).run(name.trim(), username.toLowerCase(), password);

      return NextResponse.json({
        message: "Register berhasil."
      });
    }

    if (action === "login") {
      const user = db.prepare(`
        SELECT name, username, password, role
        FROM users
        WHERE username = ? AND password = ?
      `).get(username.toLowerCase(), password) as
        | { name: string; username: string; password: string; role: string }
        | undefined;

      if (!user) {
        return NextResponse.json(
          { error: "Username atau password salah." },
          { status: 401 }
        );
      }

      return NextResponse.json({
        user: {
          name: user.name,
          username: user.username,
          role: user.role
        }
      });
    }

    return NextResponse.json(
      { error: "Action tidak dikenal." },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
