
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seed";
import { isAdminRequest } from "@/lib/adminAuth";

export const runtime = "nodejs";

// GET: Mengambil seluruh data FAQ (publik)
export async function GET() {
  try {
    await seedDatabase();

    const faqs = await prisma.faq.findMany({
      select: {
        id: true,
        question: true,
        answer: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json({ faqs });
  } catch (error) {
    console.error("FAQs GET error:", error);

    return NextResponse.json(
      { error: "Gagal mengambil FAQ." },
      { status: 500 }
    );
  }
}

// POST: Menambahkan FAQ (khusus admin)
export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya admin yang dapat menambahkan FAQ." },
        { status: 403 }
      );
    }

    const { question, answer } = await request.json();

    if (
      typeof question !== "string" ||
      typeof answer !== "string" ||
      !question.trim() ||
      !answer.trim()
    ) {
      return NextResponse.json(
        { error: "Pertanyaan dan jawaban harus diisi." },
        { status: 400 }
      );
    }

    const faq = await prisma.faq.create({
      data: {
        question: question.trim(),
        answer: answer.trim(),
      },
      select: {
        id: true,
        question: true,
        answer: true,
      },
    });

    return NextResponse.json({
      message: "FAQ berhasil ditambahkan.",
      faq,
    });
  } catch (error) {
    console.error("FAQs POST error:", error);

    return NextResponse.json(
      { error: "Gagal menambahkan FAQ." },
      { status: 500 }
    );
  }
}

// PUT: Mengedit FAQ (khusus admin)
export async function PUT(request: NextRequest) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya admin yang dapat mengedit FAQ." },
        { status: 403 }
      );
    }

    const { id, question, answer } = await request.json();

    if (
      !Number.isInteger(id) ||
      id <= 0 ||
      typeof question !== "string" ||
      typeof answer !== "string" ||
      !question.trim() ||
      !answer.trim()
    ) {
      return NextResponse.json(
        { error: "Data FAQ tidak valid." },
        { status: 400 }
      );
    }

    const existingFaq = await prisma.faq.findUnique({
      where: { id },
    });

    if (!existingFaq) {
      return NextResponse.json(
        { error: "FAQ tidak ditemukan." },
        { status: 404 }
      );
    }

    const faq = await prisma.faq.update({
      where: { id },
      data: {
        question: question.trim(),
        answer: answer.trim(),
      },
      select: {
        id: true,
        question: true,
        answer: true,
      },
    });

    return NextResponse.json({
      message: "FAQ berhasil diperbarui.",
      faq,
    });
  } catch (error) {
    console.error("FAQs PUT error:", error);

    return NextResponse.json(
      { error: "Gagal memperbarui FAQ." },
      { status: 500 }
    );
  }
}

// DELETE: Menghapus FAQ (khusus admin)
export async function DELETE(request: NextRequest) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya admin yang dapat menghapus FAQ." },
        { status: 403 }
      );
    }

    const { id } = await request.json();

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "ID FAQ tidak valid." },
        { status: 400 }
      );
    }

    const existingFaq = await prisma.faq.findUnique({
      where: { id },
    });

    if (!existingFaq) {
      return NextResponse.json(
        { error: "FAQ tidak ditemukan." },
        { status: 404 }
      );
    }

    const faqCount = await prisma.faq.count();

    if (faqCount <= 1) {
      return NextResponse.json(
        {
          error:
            "Minimal harus ada satu FAQ. FAQ terakhir tidak dapat dihapus.",
        },
        { status: 400 }
      );
    }

    await prisma.faq.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "FAQ berhasil dihapus.",
    });
  } catch (error) {
    console.error("FAQs DELETE error:", error);

    return NextResponse.json(
      { error: "Gagal menghapus FAQ." },
      { status: 500 }
    );
  }
}