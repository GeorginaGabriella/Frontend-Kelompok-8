import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seed";
import { isAdminRequest } from "@/lib/adminAuth";
import type { CommentItem } from "@/types";

export const runtime = "nodejs";

type CommentRow = {
  id: number;
  name: string;
  topic: string;
  rating: number;
  message: string;
  reply: string;
  published: boolean;
  createdAt: Date;
};

const TOPICS = [
  "Umum",
  "Rasa Menu",
  "Pengiriman",
  "Harga & Promo",
  "Keluhan",
  "Saran",
];

function serializeComment(row: CommentRow): CommentItem {
  return {
    id: row.id,
    name: row.name,
    topic: row.topic,
    rating: row.rating,
    message: row.message,
    reply: row.reply,
    published: row.published,
    createdAt: row.createdAt.toISOString(),
  };
}

/**
 * GET /api/comments
 * Pengunjung hanya menerima komentar yang sudah ditampilkan,
 * admin menerima semuanya termasuk yang disembunyikan.
 */
export async function GET(request: NextRequest) {
  try {
    await seedDatabase();

    const admin = await isAdminRequest(request);

    const rows = await prisma.comment.findMany({
      where: admin ? {} : { published: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({
      comments: rows.map((row) => serializeComment(row as CommentRow)),
    });
  } catch (error) {
    console.error("Comments GET error:", error);

    return NextResponse.json(
      { error: "Gagal mengambil komentar." },
      { status: 500 }
    );
  }
}

/** POST /api/comments — pengunjung mengirim komentar baru. */
export async function POST(request: NextRequest) {
  try {
    await seedDatabase();

    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim().slice(0, 60) : "";
    const message =
      typeof body.message === "string"
        ? body.message.trim().slice(0, 800)
        : "";
    const topic =
      typeof body.topic === "string" && TOPICS.includes(body.topic)
        ? body.topic
        : "Umum";

    const parsedRating = Math.round(Number(body.rating));
    const rating = Number.isFinite(parsedRating)
      ? Math.min(5, Math.max(1, parsedRating))
      : 5;

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Nama minimal 2 karakter." },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: "Komentar minimal 10 karakter." },
        { status: 400 }
      );
    }

    const created = await prisma.comment.create({
      data: {
        name,
        topic,
        rating,
        message,
        reply: "",
        published: true,
      },
    });

    return NextResponse.json(
      {
        message: "Komentar berhasil dikirim. Terima kasih!",
        comment: serializeComment(created as CommentRow),
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

/** PUT /api/comments — admin membalas atau menyembunyikan komentar. */
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

    const existing = await prisma.comment.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { error: "Komentar tidak ditemukan." },
        { status: 404 }
      );
    }

    const data: { reply?: string; published?: boolean } = {};

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

    await prisma.comment.update({ where: { id }, data });

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

/** DELETE /api/comments — admin menghapus komentar. */
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

    await prisma.comment.deleteMany({ where: { id } });

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
