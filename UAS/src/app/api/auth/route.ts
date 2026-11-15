import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seed";
import { createSessionToken } from "@/lib/adminAuth";

export const runtime = "nodejs";

const COOKIE_NAME = "gadoGadoSession";

export async function GET() {
  try {
    await seedDatabase();

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Auth GET error:", error);

    return NextResponse.json(
      { error: "Gagal mengambil data user." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await seedDatabase();

    const body = await request.json();
    const { action, name, username, password } = body;

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password
    ) {
      return NextResponse.json(
        { error: "Username dan password harus diisi." },
        { status: 400 }
      );
    }

    const normalizedUsername = username.trim().toLowerCase();

    if (action === "register") {
      if (typeof name !== "string" || !name.trim()) {
        return NextResponse.json(
          { error: "Nama harus diisi." },
          { status: 400 }
        );
      }

      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password minimal 6 karakter." },
          { status: 400 }
        );
      }

      const existingUser = await prisma.user.findUnique({
        where: { username: normalizedUsername },
        select: { id: true },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Username sudah digunakan." },
          { status: 409 }
        );
      }

      await prisma.user.create({
        data: {
          name: name.trim(),
          username: normalizedUsername,
          password,
          role: "user",
        },
      });

      return NextResponse.json({
        message: "Register berhasil.",
      });
    }

    if (action === "login") {
      const user = await prisma.user.findFirst({
        where: {
          username: normalizedUsername,
          password,
        },
        select: {
          name: true,
          username: true,
          role: true,
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: "Username atau password salah." },
          { status: 401 }
        );
      }

      const response = NextResponse.json({ user });

      response.cookies.set(
        COOKIE_NAME,
        createSessionToken(user.username),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 8,
        }
      );

      return response;
    }

    return NextResponse.json(
      { error: "Action tidak dikenali." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Auth POST error:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan pada proses autentikasi." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    message: "Logout berhasil.",
  });

  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}