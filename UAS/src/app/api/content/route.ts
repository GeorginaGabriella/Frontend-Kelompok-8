import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seed";

export const runtime = "nodejs";

export async function GET() {
  try {
    await seedDatabase();

    const content = await prisma.siteContent.findUnique({
      where: { id: 1 },
      select: {
        heroDescription: true,
        aboutDescription: true,
      },
    });

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Content GET error:", error);

    return NextResponse.json(
      { error: "Gagal mengambil konten." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { heroDescription, aboutDescription } =
      await request.json();

    if (
      typeof heroDescription !== "string" ||
      typeof aboutDescription !== "string"
    ) {
      return NextResponse.json(
        { error: "Data konten tidak valid." },
        { status: 400 }
      );
    }

    await prisma.siteContent.upsert({
      where: { id: 1 },
      update: {
        heroDescription,
        aboutDescription,
      },
      create: {
        id: 1,
        heroDescription,
        aboutDescription,
      },
    });

    return NextResponse.json({
      message: "Konten berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Content PUT error:", error);

    return NextResponse.json(
      { error: "Gagal memperbarui konten." },
      { status: 500 }
    );
  }
}
