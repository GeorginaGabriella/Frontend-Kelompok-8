import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seed";

export const runtime = "nodejs";

export async function GET() {
  try {
    await seedDatabase();

    const rows = await prisma.menu.findMany({
      select: { data: true },
      orderBy: { id: "asc" },
    });

    const menus = rows.map((row) => JSON.parse(row.data));

    return NextResponse.json({
      total: menus.length,
      menus,
    });
  } catch (error) {
    console.error("Menus GET error:", error);

    return NextResponse.json(
      { error: "Gagal mengambil menu." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { name, updated } = await request.json();

    if (
      typeof name !== "string" ||
      !name.trim() ||
      !updated ||
      typeof updated !== "object" ||
      Array.isArray(updated)
    ) {
      return NextResponse.json(
        { error: "Data menu tidak valid." },
        { status: 400 }
      );
    }

    const row = await prisma.menu.findFirst({
      where: { name },
      select: {
        slug: true,
        data: true,
      },
    });

    if (!row) {
      return NextResponse.json(
        { error: "Menu tidak ditemukan." },
        { status: 404 }
      );
    }

    const oldMenu = JSON.parse(row.data);
    const newMenu = { ...oldMenu, ...updated };

    await prisma.menu.update({
      where: { slug: row.slug },
      data: {
        name: newMenu.name,
        data: JSON.stringify(newMenu),
      },
    });

    return NextResponse.json({
      message: "Menu berhasil diperbarui.",
      menu: newMenu,
    });
  } catch (error) {
    console.error("Menus PUT error:", error);

    return NextResponse.json(
      { error: "Gagal memperbarui menu." },
      { status: 500 }
    );
  }
}
