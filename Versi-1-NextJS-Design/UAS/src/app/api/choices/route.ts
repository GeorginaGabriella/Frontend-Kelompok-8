import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const username =
      request.nextUrl.searchParams.get("username") || "guest";

    const rows = await prisma.choice.findMany({
      where: { username },
      select: { menuName: true },
    });

    return NextResponse.json({
      choices: rows.map((item) => item.menuName),
    });
  } catch (error) {
    console.error("Choices GET error:", error);

    return NextResponse.json(
      { error: "Gagal mengambil pilihan." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username = "guest", menu_name } = await request.json();

    if (typeof menu_name !== "string" || !menu_name.trim()) {
      return NextResponse.json(
        { error: "Nama menu harus diisi." },
        { status: 400 }
      );
    }

    await prisma.choice.upsert({
      where: {
        username_menuName: {
          username,
          menuName: menu_name,
        },
      },
      update: {},
      create: {
        username,
        menuName: menu_name,
      },
    });

    return NextResponse.json({
      message: "Menu berhasil ditambahkan.",
    });
  } catch (error) {
    console.error("Choices POST error:", error);

    return NextResponse.json(
      { error: "Gagal menyimpan pilihan." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { username = "guest", menu_name } = await request.json();

    if (menu_name) {
      await prisma.choice.deleteMany({
        where: { username, menuName: menu_name },
      });
    } else {
      await prisma.choice.deleteMany({
        where: { username },
      });
    }

    return NextResponse.json({
      message: "Pilihan berhasil dihapus.",
    });
  } catch (error) {
    console.error("Choices DELETE error:", error);

    return NextResponse.json(
      { error: "Gagal menghapus pilihan." },
      { status: 500 }
    );
  }
}
