import type {
  AppliedDiscount,
  CartItem,
  DiscountCodeItem,
  OrderTotals,
} from "@/types";

/** Ongkos kirim dasar untuk semua area (rupiah). */
export const SHIPPING_BASE = 10000;

/** Total belanja minimum agar ongkos kirim menjadi Rp 0. */
export const FREE_SHIPPING_THRESHOLD = 100000;

/**
 * Mengubah label harga pada data menu menjadi angka rupiah.
 * Contoh: "Rp 18.000–30.000" -> 18000, "Rp 8.000" -> 8000.
 * Nilai pertama dipakai sebagai harga jual satuan.
 */
export function parsePriceLabel(priceLabel: string): number {
  if (!priceLabel) return 0;

  const firstNumber = priceLabel
    .replace(/rp/gi, "")
    .split(/[–—-]/)[0]
    .replace(/[^0-9]/g, "");

  const parsed = Number.parseInt(firstNumber, 10);

  return Number.isFinite(parsed) ? parsed : 0;
}

/** Memformat angka menjadi "Rp 25.000". */
export function formatRupiah(value: number): string {
  const safeValue = Number.isFinite(value) ? Math.round(value) : 0;

  return `Rp ${safeValue.toLocaleString("id-ID")}`;
}

export function getCartSubtotal(items: CartItem[]): number {
  return items.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );
}

export function getCartQuantity(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Menghitung nilai potongan sebuah kode diskon terhadap subtotal.
 * Mengembalikan `null` bila kode belum memenuhi syarat minimum belanja.
 */
export function evaluateDiscount(
  discount: DiscountCodeItem,
  subtotal: number
): AppliedDiscount | null {
  if (discount.active === false) return null;
  if (subtotal < discount.minSpend) return null;

  let amount = 0;

  if (discount.type === "percent") {
    amount = Math.floor((subtotal * discount.value) / 100);

    if (discount.maxDiscount > 0) {
      amount = Math.min(amount, discount.maxDiscount);
    }
  } else if (discount.type === "amount") {
    amount = discount.value;
  }

  amount = Math.max(0, Math.min(amount, subtotal));

  return {
    code: discount.code,
    label: discount.label,
    amount,
    freeShipping: discount.freeShipping || discount.type === "shipping",
  };
}

/** Menghitung subtotal, diskon, ongkir, dan total akhir pesanan. */
export function calculateTotals(
  items: CartItem[],
  appliedDiscount: AppliedDiscount | null
): OrderTotals {
  const subtotal = getCartSubtotal(items);
  const discount = Math.min(appliedDiscount?.amount ?? 0, subtotal);
  const afterDiscount = subtotal - discount;

  let shipping = 0;

  if (items.length > 0) {
    const freeByThreshold = afterDiscount >= FREE_SHIPPING_THRESHOLD;
    const freeByCode = Boolean(appliedDiscount?.freeShipping);

    shipping = freeByThreshold || freeByCode ? 0 : SHIPPING_BASE;
  }

  return {
    subtotal,
    discount,
    shipping,
    total: afterDiscount + shipping,
  };
}

/** Membuat kode pesanan unik, contoh: "GGN-7K2M4P". */
export function createOrderCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let suffix = "";

  for (let index = 0; index < 6; index += 1) {
    suffix += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }

  return `GGN-${suffix}`;
}

/** Urutan tahapan status pesanan untuk dashboard admin. */
export const ORDER_STATUSES = [
  "baru",
  "diproses",
  "dikirim",
  "selesai",
  "batal",
] as const;
