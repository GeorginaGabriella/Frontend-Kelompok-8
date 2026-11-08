import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const username =
      request.nextUrl.searchParams.get("username") || "guest";

    const rows = await prisma.favorite.findMany({
      where: { username },
      select: { menuName: true },
    });

    return NextResponse.json({
      favorites: rows.map((item) => item.menuName),
    });
  } catch (error) {
    console.error("Favorites GET error:", error);

    return NextResponse.json(
      { error: "Gagal mengambil favorit." },
      { status: 500 }
    );
  }
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

    await prisma.favorite.upsert({
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
      message: "Favorit berhasil ditambahkan.",
    });
  } catch (error) {
    console.error("Favorites POST error:", error);

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
      await prisma.favorite.deleteMany({
        where: {
          username,
          menuName: menu_name,
        },
      });
    } else {
      await prisma.favorite.deleteMany({
        where: { username },
      });
    }

    return NextResponse.json({
      message: "Favorit berhasil dihapus.",
    });
  } catch (error) {
    console.error("Favorites DELETE error:", error);

    return NextResponse.json(
      { error: "Gagal menghapus favorit." },
      { status: 500 }
    );
  }
}