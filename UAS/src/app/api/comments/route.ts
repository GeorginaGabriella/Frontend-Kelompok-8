
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seed";
import { isAdminRequest } from "@/lib/adminAuth";

export const runtime = "nodejs";

const TOPICS = [
  "Umum",
  "Rasa Menu",
  "Pengiriman",
  "Harga & Promo",
  "Keluhan",
  "Saran",
];

function serializeComment(row: {
  id: number;
  name: string;
  menuSlug: string;
  topic: string;
  rating: number;
  message: string;
  reply: string;
  published: boolean;
  createdAt: Date;
}) {
  return {
    id: row.id,
    name: row.name,
    menuSlug: row.menuSlug,
    topic: row.topic,
    rating: row.rating,
    message: row.message,
    reply: row.reply,
    published: row.published,
    createdAt: row.createdAt.toISOString(),
  };
}

/**
 * GET /api/comments?menuSlug=gado-gado-betawi
 * Mengambil komentar sesuai menu.
 */
export async function GET(request: NextRequest) {
  try {
    await seedDatabase();

    const admin = await isAdminRequest(request);
    const menuSlug = request.nextUrl.searchParams.get("menuSlug");

    const rows = await prisma.comment.findMany({
      where: {
        ...(menuSlug ? { menuSlug } : {}),
        ...(admin ? {} : { published: true }),
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({
      comments: rows.map(serializeComment),
    });
  } catch (error) {
    console.error("Comments GET error:", error);

    return NextResponse.json(
      { error: "Gagal mengambil komentar." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/comments
 * Menyimpan komentar baru berdasarkan menu.
 */
export async function POST(request: NextRequest) {
  try {
    await seedDatabase();

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim().slice(0, 60)
        : "";

    const menuSlug =
      typeof body.menuSlug === "string"
        ? body.menuSlug.trim().slice(0, 120)
        : "";

    const message =
      typeof body.message === "string"
        ? body.message.trim().slice(0, 800)
        : "";

    const topic =
      typeof body.topic === "string" && TOPICS.includes(body.topic)
        ? body.topic
        : "Rasa Menu";

    const parsedRating = Math.round(Number(body.rating));

    const rating = Number.isFinite(parsedRating)
      ? Math.min(5, Math.max(1, parsedRating))
      : 5;

    if (name.length < 2) {
      return NextResponse.json(
        { error: "Nama minimal 2 karakter." },
        { status: 400 }
      );
    }

    if (!menuSlug) {
      return NextResponse.json(
        { error: "Menu belum dipilih." },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: "Komentar minimal 10 karakter." },
        { status: 400 }
      );
    }

    // Pastikan slug menu benar-benar tersedia.
    const menu = await prisma.menu.findUnique({
      where: { slug: menuSlug },
    });

    if (!menu) {
      return NextResponse.json(
        { error: "Menu tidak ditemukan." },
        { status: 404 }
      );
    }

    const created = await prisma.comment.create({
      data: {
        name,
        menuSlug,
        topic,
        rating,
        message,
        reply: "",
        published: true,
      },
    });

    return NextResponse.json(
      {
        message: "Komentar berhasil dikirim.",
        comment: serializeComment(created),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Comments POST error:", error);

    return NextResponse.json(
      { error: "Gagal mengirim komentar." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/comments
 * Admin membalas atau menyembunyikan komentar.
 */
export async function PUT(request: NextRequest) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json(
        { error: "Hanya admin yang dapat mengelola komentar." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const id = Math.floor(Number(body.id));

    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json(
        { error: "Komentar tidak valid." },
        { status: 400 }
      );
    }

    const existing = await prisma.comment.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Komentar tidak ditemukan." },
        { status: 404 }
      );
    }

    const data: {
      reply?: string;
      published?: boolean;
    } = {};

    if (typeof body.reply === "string") {
      data.reply = body.reply.trim().slice(0, 800);
    }

    if (typeof body.published === "boolean") {
      data.published = body.published;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "Tidak ada perubahan yang dikirim." },
        { status: 400 }
      );
    }

    await prisma.comment.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      message: "Komentar berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Comments PUT error:", error);

    return NextResponse.json(
      { error: "Gagal memperbarui komentar." },
      { status: 500 }
    );
  }
}


export async function DELETE(request: NextRequest) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json(
        { error: "Hanya admin yang dapat menghapus komentar." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const id = Math.floor(Number(body.id));

    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json(
        { error: "Komentar tidak valid." },
        { status: 400 }
      );
    }

    await prisma.comment.deleteMany({
      where: { id },
    });

    return NextResponse.json({
      message: "Komentar berhasil dihapus.",
    });
  } catch (error) {
    console.error("Comments DELETE error:", error);

    return NextResponse.json(
      { error: "Gagal menghapus komentar." },
      { status: 500 }
    );
  }
}
