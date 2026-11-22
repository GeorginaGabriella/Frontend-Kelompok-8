export function parsePriceLabel(priceLabel: string): number {
  if (!priceLabel) return 0;

  const firstNumber = priceLabel.match(/\d[\d.]*/)?.[0] ?? "";
  const parsed = Number.parseInt(firstNumber.replace(/\D/g, ""), 10);

  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatRupiah(value: number): string {
  const safeValue = Number.isFinite(value) ? Math.round(value) : 0;

  return `Rp ${safeValue.toLocaleString("id-ID")}`;
}
