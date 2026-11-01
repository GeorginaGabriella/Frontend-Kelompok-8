import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { seedDatabase } from "@/lib/seed";

export const runtime = "nodejs";

export async function GET() {
  seedDatabase();

  const faqs = db.prepare(`
    SELECT id, question, answer
    FROM faqs
    ORDER BY id ASC
  `).all();

  return NextResponse.json({ faqs });
}

export async function POST(request: NextRequest) {
  try {
    const { question, answer } = await request.json();

    if (!question?.trim() || !answer?.trim()) {
      return NextResponse.json(
        { error: "Pertanyaan dan jawaban harus diisi." },
        { status: 400 }
      );
    }

    db.prepare(`
      INSERT INTO faqs (question, answer)
      VALUES (?, ?)
    `).run(question.trim(), answer.trim());

    return NextResponse.json({
      message: "FAQ berhasil ditambahkan."
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal menambahkan FAQ." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { question } = await request.json();

    db.prepare(`
      DELETE FROM faqs WHERE question = ?
    `).run(question);

    return NextResponse.json({
      message: "FAQ berhasil dihapus."
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus FAQ." },
      { status: 500 }
    );
  }
}
