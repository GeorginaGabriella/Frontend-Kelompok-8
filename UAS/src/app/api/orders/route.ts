import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seed";
import { isAdminRequest } from "@/lib/adminAuth";
import {
  ORDER_STATUSES,
  SHIPPING_BASE,
  FREE_SHIPPING_THRESHOLD,
  createOrderCode,
  evaluateDiscount,
  parsePriceLabel,
} from "@/lib/order";
import type {
  DiscountCodeItem,
  MenuItem,
  OrderItem,
  OrderRecord,
} from "@/types";

export const runtime = "nodejs";

type OrderRow = {
  id: number;
  orderCode: string;
  username: string;
  recipient: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  note: string;
  items: string;
  subtotal: number;
  discountCode: string;
  discountAmount: number;
  shippingCost: number;
  total: number;
  status: string;
  createdAt: Date;
};

function serializeOrder(row: OrderRow): OrderRecord {
  let items: OrderItem[] = [];

  try {
    const parsed = JSON.parse(row.items);
    items = Array.isArray(parsed) ? parsed : [];
  } catch {
    items = [];
  }

  return {
    id: row.id,
    orderCode: row.orderCode,
    username: row.username,
    recipient: row.recipient,
    phone: row.phone,
    address: row.address,
    city: row.city,
    postalCode: row.postalCode,
    note: row.note,
    items,
    subtotal: row.subtotal,
    discountCode: row.discountCode,
    discountAmount: row.discountAmount,
    shippingCost: row.shippingCost,
    total: row.total,
    status: row.status as OrderRecord["status"],
    createdAt: row.createdAt.toISOString(),
  };
}

function cleanText(value: unknown, maxLength = 240) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

/**
 * GET /api/orders
 * Admin menerima seluruh pesanan, pengguna biasa hanya pesanan miliknya
 * (lewat query ?username=).
 */
export async function GET(request: NextRequest) {
  try {
    await seedDatabase();

    const admin = await isAdminRequest(request);
    const username = request.nextUrl.searchParams.get("username");

    const rows = await prisma.order.findMany({
      where: admin ? {} : { username: username || "guest" },
      orderBy: { createdAt: "desc" },
      take: admin ? 200 : 20,
    });

    return NextResponse.json({
      orders: rows.map((row) => serializeOrder(row as OrderRow)),
    });
  } catch (error) {
    console.error("Orders GET error:", error);

    return NextResponse.json(
      { error: "Gagal mengambil data pesanan." },
      { status: 500 }
    );
  }
}

/** POST /api/orders — membuat pesanan baru dari keranjang. */
export async function POST(request: NextRequest) {
  try {
    await seedDatabase();

    const body = await request.json();

    const recipient = cleanText(body.recipient, 80);
    const phone = cleanText(body.phone, 25);
    const address = cleanText(body.address, 400);

    if (!recipient || !phone || !address) {
      return NextResponse.json(
        { error: "Nama penerima, nomor telepon, dan alamat wajib diisi." },
        { status: 400 }
      );
    }

    if (!/^[0-9+\s()-]{8,}$/.test(phone)) {
      return NextResponse.json(
        { error: "Nomor telepon tidak valid." },
        { status: 400 }
      );
    }

    const rawItems = Array.isArray(body.items) ? body.items : [];

    if (rawItems.length === 0) {
      return NextResponse.json(
        { error: "Keranjang masih kosong." },
        { status: 400 }
      );
    }

    // Harga selalu dihitung ulang dari database agar tidak bisa dimanipulasi
    // dari sisi klien.
    const menuRows = await prisma.menu.findMany({
      select: { slug: true, name: true, data: true },
    });

    const menuBySlug = new Map<string, MenuItem>();

    for (const row of menuRows) {
      try {
        menuBySlug.set(row.slug, JSON.parse(row.data) as MenuItem);
      } catch {
        // Lewati baris menu yang datanya rusak.
      }
    }

    const items: OrderItem[] = [];

    for (const rawItem of rawItems) {
      const slug = cleanText(rawItem?.slug, 120);
      const quantity = Math.floor(Number(rawItem?.quantity));

      if (!slug || !Number.isFinite(quantity) || quantity < 1) {
        return NextResponse.json(
          { error: "Jumlah pesanan tidak valid." },
          { status: 400 }
        );
      }

      const menu = menuBySlug.get(slug);

      if (!menu) {
        return NextResponse.json(
          { error: `Menu "${slug}" sudah tidak tersedia.` },
          { status: 404 }
        );
      }

      items.push({
        slug,
        name: menu.name,
        unitPrice: parsePriceLabel(menu.price),
        quantity: Math.min(quantity, 99),
      });
    }

    const subtotal = items.reduce(
      (total, item) => total + item.unitPrice * item.quantity,
      0
    );

    let discountCode = "";
    let discountAmount = 0;
    let freeShipping = false;

    const requestedCode = cleanText(body.discountCode, 40).toUpperCase();

    if (requestedCode) {
      const discount = await prisma.discountCode.findUnique({
        where: { code: requestedCode },
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
            error: `Kode ${requestedCode} berlaku untuk pembelian minimal Rp ${discount.minSpend.toLocaleString(
              "id-ID"
            )}.`,
          },
          { status: 400 }
        );
      }

      discountCode = applied.code;
      discountAmount = applied.amount;
      freeShipping = applied.freeShipping;
    }

    const afterDiscount = subtotal - discountAmount;

    const shippingCost =
      freeShipping || afterDiscount >= FREE_SHIPPING_THRESHOLD
        ? 0
        : SHIPPING_BASE;

    const total = afterDiscount + shippingCost;

    const created = await prisma.order.create({
      data: {
        orderCode: createOrderCode(),
        username: cleanText(body.username, 60) || "guest",
        recipient,
        phone,
        address,
        city: cleanText(body.city, 80),
        postalCode: cleanText(body.postalCode, 12),
        note: cleanText(body.note, 300),
        items: JSON.stringify(items),
        subtotal,
        discountCode,
        discountAmount,
        shippingCost,
        total,
        status: "baru",
      },
    });

    return NextResponse.json(
      {
        message: "Pesanan berhasil dibuat.",
        order: serializeOrder(created as OrderRow),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Orders POST error:", error);

    return NextResponse.json(
      { error: "Gagal membuat pesanan." },
      { status: 500 }
    );
  }
}

/** PUT /api/orders — admin memperbarui status pesanan. */
export async function PUT(request: NextRequest) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json(
        { error: "Hanya admin yang dapat mengubah status pesanan." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const orderCode = cleanText(body.orderCode, 40);
    const status = cleanText(body.status, 20);

    if (
      !orderCode ||
      !(ORDER_STATUSES as ReadonlyArray<string>).includes(status)
    ) {
      return NextResponse.json(
        { error: "Status pesanan tidak valid." },
        { status: 400 }
      );
    }

    const existing = await prisma.order.findUnique({
      where: { orderCode },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Pesanan tidak ditemukan." },
        { status: 404 }
      );
    }

    await prisma.order.update({
      where: { orderCode },
      data: { status },
    });

    return NextResponse.json({
      message: `Status pesanan ${orderCode} menjadi ${status}.`,
    });
  } catch (error) {
    console.error("Orders PUT error:", error);

    return NextResponse.json(
      { error: "Gagal memperbarui status pesanan." },
      { status: 500 }
    );
  }
}

/** DELETE /api/orders — admin menghapus pesanan. */
export async function DELETE(request: NextRequest) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json(
        { error: "Hanya admin yang dapat menghapus pesanan." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const orderCode = cleanText(body.orderCode, 40);

    if (!orderCode) {
      return NextResponse.json(
        { error: "Kode pesanan tidak valid." },
        { status: 400 }
      );
    }

    await prisma.order.deleteMany({ where: { orderCode } });

    return NextResponse.json({
      message: "Pesanan berhasil dihapus.",
    });
  } catch (error) {
    console.error("Orders DELETE error:", error);

    return NextResponse.json(
      { error: "Gagal menghapus pesanan." },
      { status: 500 }
    );
  }
}
