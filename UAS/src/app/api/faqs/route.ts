import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seed";

export const runtime = "nodejs";

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

export async function POST(request: NextRequest) {
  try {
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

    await prisma.faq.create({
      data: {
        question: question.trim(),
        answer: answer.trim(),
      },
    });

    return NextResponse.json({
      message: "FAQ berhasil ditambahkan.",
    });
  } catch (error) {
    console.error("FAQs POST error:", error);

    return NextResponse.json(
      { error: "Gagal menambahkan FAQ." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (typeof question !== "string" || !question.trim()) {
      return NextResponse.json(
        { error: "Pertanyaan FAQ tidak valid." },
        { status: 400 }
      );
    }

    await prisma.faq.deleteMany({
      where: {
        question: question.trim(),
      },
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