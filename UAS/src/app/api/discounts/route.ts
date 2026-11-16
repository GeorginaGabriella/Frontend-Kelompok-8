import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seed";
import { isAdminRequest } from "@/lib/adminAuth";
import { evaluateDiscount } from "@/lib/order";
import type { DiscountCodeItem, DiscountType } from "@/types";

export const runtime = "nodejs";

const DISCOUNT_TYPES: DiscountType[] = ["percent", "amount", "shipping"];

function normalizeCode(value: unknown) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}

/** GET /api/discounts — daftar kode diskon yang aktif. */
export async function GET() {
  try {
    await seedDatabase();

    const discounts = await prisma.discountCode.findMany({
      orderBy: { code: "asc" },
    });

    return NextResponse.json({ discounts });
  } catch (error) {
    console.error("Discounts GET error:", error);

    return NextResponse.json(
      { error: "Gagal mengambil kode diskon." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/discounts
 * - action "validate": memeriksa kode diskon terhadap subtotal keranjang.
 * - action "create": menambah kode diskon baru (khusus admin).
 */
export async function POST(request: NextRequest) {
  try {
    await seedDatabase();

    const body = await request.json();
    const action = body.action === "create" ? "create" : "validate";

    if (action === "validate") {
      const code = normalizeCode(body.code);
      const subtotal = Number(body.subtotal);

      if (!code) {
        return NextResponse.json(
          { error: "Kode diskon harus diisi." },
          { status: 400 }
        );
      }

      if (!Number.isFinite(subtotal) || subtotal <= 0) {
        return NextResponse.json(
          { error: "Keranjang masih kosong." },
          { status: 400 }
        );
      }

      const discount = await prisma.discountCode.findUnique({
        where: { code },
      });

      if (!discount || !discount.active) {
        return NextResponse.json(
          { error: "Kode diskon tidak ditemukan." },
          { status: 404 }
        );
      }

      const applied = evaluateDiscount(
        discount as DiscountCodeItem,
        subtotal
      );

      if (!applied) {
        return NextResponse.json(
          {
            error: `Kode ${code} berlaku untuk pembelian minimal Rp ${discount.minSpend.toLocaleString(
              "id-ID"
            )}.`,
          },
          { status: 400 }
        );
      }

      return NextResponse.json({ discount: applied });
    }

    if (!(await isAdminRequest(request))) {
      return NextResponse.json(
        { error: "Hanya admin yang dapat menambah kode diskon." },
        { status: 403 }
      );
    }

    const code = normalizeCode(body.code);
    const label =
      typeof body.label === "string" ? body.label.trim() : "";
    const type: DiscountType = DISCOUNT_TYPES.includes(body.type)
      ? body.type
      : "percent";
    const value = Number(body.value);

    if (!code || !label) {
      return NextResponse.json(
        { error: "Kode dan keterangan diskon wajib diisi." },
        { status: 400 }
      );
    }

    if (type !== "shipping" && (!Number.isFinite(value) || value <= 0)) {
      return NextResponse.json(
        { error: "Nilai diskon harus lebih besar dari 0." },
        { status: 400 }
      );
    }

    const existing = await prisma.discountCode.findUnique({
      where: { code },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Kode diskon sudah terdaftar." },
        { status: 409 }
      );
    }

    const discount = await prisma.discountCode.create({
      data: {
        code,
        label,
        type,
        value: type === "shipping" ? 0 : Math.round(value),
        minSpend: Math.max(0, Math.round(Number(body.minSpend) || 0)),
        maxDiscount: Math.max(0, Math.round(Number(body.maxDiscount) || 0)),
        freeShipping: type === "shipping" || body.freeShipping === true,
        active: true,
      },
    });

    return NextResponse.json(
      { message: "Kode diskon berhasil ditambahkan.", discount },
      { status: 201 }
    );
  } catch (error) {
    console.error("Discounts POST error:", error);

    return NextResponse.json(
      { error: "Gagal memproses kode diskon." },
      { status: 500 }
    );
  }
}

/** PUT /api/discounts — mengaktifkan / menonaktifkan kode diskon (admin). */
export async function PUT(request: NextRequest) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json(
        { error: "Hanya admin yang dapat mengubah kode diskon." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const code = normalizeCode(body.code);

    if (!code || typeof body.active !== "boolean") {
      return NextResponse.json(
        { error: "Data kode diskon tidak valid." },
        { status: 400 }
      );
    }

    const existing = await prisma.discountCode.findUnique({
      where: { code },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Kode diskon tidak ditemukan." },
        { status: 404 }
      );
    }

    await prisma.discountCode.update({
      where: { code },
      data: { active: body.active },
    });

    return NextResponse.json({
      message: body.active
        ? "Kode diskon diaktifkan."
        : "Kode diskon dinonaktifkan.",
    });
  } catch (error) {
    console.error("Discounts PUT error:", error);

    return NextResponse.json(
      { error: "Gagal memperbarui kode diskon." },
      { status: 500 }
    );
  }
}

/** DELETE /api/discounts — menghapus kode diskon (admin). */
export async function DELETE(request: NextRequest) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json(
        { error: "Hanya admin yang dapat menghapus kode diskon." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const code = normalizeCode(body.code);

    if (!code) {
      return NextResponse.json(
        { error: "Kode diskon tidak valid." },
        { status: 400 }
      );
    }

    await prisma.discountCode.deleteMany({ where: { code } });

    return NextResponse.json({
      message: "Kode diskon berhasil dihapus.",
    });
  } catch (error) {
    console.error("Discounts DELETE error:", error);

    return NextResponse.json(
      { error: "Gagal menghapus kode diskon." },
      { status: 500 }
    );
  }
}
