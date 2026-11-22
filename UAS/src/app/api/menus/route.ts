import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seed";
import { isAdminRequest } from "@/lib/adminAuth";
import type { MenuItem } from "@/types";

export const runtime = "nodejs";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseMenuData(data: string): MenuItem {
  return JSON.parse(data) as MenuItem;
}

// GET: Mengambil seluruh data menu
export async function GET() {
  try {
    await seedDatabase();

    const rows = await prisma.menu.findMany({
      select: {
        data: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    console.log("MENU ROWS:", rows);
    console.log("MENU ROWS TYPE:", typeof rows);
    console.log("IS ARRAY:", Array.isArray(rows));

    if (!Array.isArray(rows)) {
      throw new Error(
        "Hasil prisma.menu.findMany() bukan array."
      );
    }

    const menus = rows.map((row, index) => {
      if (!row.data || typeof row.data !== "string") {
        throw new Error(
          `Data menu pada urutan ${index} kosong atau tidak valid.`
        );
      }

      try {
        return parseMenuData(row.data);
      } catch {
        throw new Error(
          `Format JSON menu pada urutan ${index} tidak valid.`
        );
      }
    });

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

// POST: Menambahkan menu baru
export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json(
        { error: "Hanya admin yang dapat menambah menu." },
        { status: 403 }
      );
    }

    await seedDatabase();

    const body = await request.json();

    if (
      typeof body.name !== "string" ||
      !body.name.trim() ||
      typeof body.price !== "string" ||
      !body.price.trim() ||
      typeof body.description !== "string" ||
      !body.description.trim()
    ) {
      return NextResponse.json(
        { error: "Nama, harga, dan deskripsi wajib diisi." },
        { status: 400 }
      );
    }

    const slug = createSlug(body.name);

    if (!slug) {
      return NextResponse.json(
        { error: "Nama menu tidak valid." },
        { status: 400 }
      );
    }

    const existing = await prisma.menu.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Nama menu sudah digunakan." },
        { status: 409 }
      );
    }

    const ingredients = Array.isArray(body.ingredients)
      ? body.ingredients.filter(
          (item: unknown) => typeof item === "string"
        )
      : [];

    const menu: MenuItem = {
      slug,
      name: body.name.trim(),
      searchName: body.name.trim().toLowerCase(),
      kategori: "lainnya",
      group: "lainnya",
      regionBadge: body.region || "NUSANTARA",
      categoryLabel: body.categoryLabel || "TRADISIONAL",
      region: body.region || "NUSANTARA",
      rating: "5.0",
      image: body.image || "",
      shortDescription:
        body.shortDescription || body.description.trim(),
      description: body.description.trim(),
      cardIngredients: ingredients.slice(0, 3),
      ingredients,
      price: body.price.trim(),
      location: body.location || "",
      city: body.city || "",
      condiments: body.condiments || "",
      benefits: body.benefits || "",
    };

    await prisma.menu.create({
      data: {
        slug,
        name: menu.name,
        data: JSON.stringify(menu),
      },
    });

    return NextResponse.json(
      {
        message: "Menu berhasil ditambahkan.",
        menu,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Menus POST error:", error);

    return NextResponse.json(
      { error: "Gagal menambahkan menu." },
      { status: 500 }
    );
  }
}

// PUT: Memperbarui menu
export async function PUT(request: NextRequest) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json(
        { error: "Hanya admin yang dapat mengedit menu." },
        { status: 403 }
      );
    }

    await seedDatabase();

    const body = await request.json();
    const { slug, updated } = body;

    if (
      typeof slug !== "string" ||
      !slug.trim() ||
      !updated ||
      typeof updated !== "object" ||
      Array.isArray(updated)
    ) {
      return NextResponse.json(
        { error: "Data menu tidak valid." },
        { status: 400 }
      );
    }

    const row = await prisma.menu.findUnique({
      where: { slug },
    });

    if (!row) {
      return NextResponse.json(
        { error: "Menu tidak ditemukan." },
        { status: 404 }
      );
    }

    const oldMenu = parseMenuData(row.data);

    const newMenu: MenuItem = {
      ...oldMenu,
      ...updated,
      slug: row.slug,
    };

    if (
      typeof newMenu.name !== "string" ||
      !newMenu.name.trim() ||
      typeof newMenu.price !== "string" ||
      !newMenu.price.trim() ||
      typeof newMenu.description !== "string" ||
      !newMenu.description.trim()
    ) {
      return NextResponse.json(
        { error: "Nama, harga, dan deskripsi wajib diisi." },
        { status: 400 }
      );
    }

    newMenu.searchName = newMenu.name.trim().toLowerCase();

    await prisma.menu.update({
      where: { slug },
      data: {
        name: newMenu.name.trim(),
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

// DELETE: Menghapus menu
export async function DELETE(request: NextRequest) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json(
        { error: "Hanya admin yang dapat menghapus menu." },
        { status: 403 }
      );
    }

    await seedDatabase();

    const body = await request.json();

    if (
      typeof body.slug !== "string" ||
      !body.slug.trim()
    ) {
      return NextResponse.json(
        { error: "Slug menu tidak valid." },
        { status: 400 }
      );
    }

    const existing = await prisma.menu.findUnique({
      where: { slug: body.slug },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Menu tidak ditemukan." },
        { status: 404 }
      );
    }

    const menuCount = await prisma.menu.count();

    if (menuCount <= 1) {
      return NextResponse.json(
        { error: "Minimal harus ada satu menu di database." },
        { status: 400 }
      );
    }

    await prisma.menu.delete({
      where: { slug: body.slug },
    });

    return NextResponse.json({
      message: "Menu berhasil dihapus.",
    });
  } catch (error) {
    console.error("Menus DELETE error:", error);

    return NextResponse.json(
      { error: "Gagal menghapus menu." },
      { status: 500 }
    );
  }
}
