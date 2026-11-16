"use client";

import React from "react";
import { formatRupiah } from "@/lib/order";
import { CartDrawerProps } from "@/types";

/**
 * Panel keranjang pesanan: daftar item, alamat pengiriman,
 * kode diskon, dan rincian harga total.
 */
export default function CartDrawer({
  isOpen,
  onClose,
  items,
  address,
  onAddressChange,
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
  discountInput,
  onDiscountInputChange,
  appliedDiscount,
  discountError,
  onApplyDiscount,
  onRemoveDiscount,
  totals,
  shippingBase,
  freeShippingThreshold,
  submitting,
  onCheckout,
  lastOrder,
  onDismissLastOrder,
  children,
}: CartDrawerProps) {
  const isEmpty = items.length === 0;
  const remainingForFreeShipping =
    freeShippingThreshold - (totals.subtotal - totals.discount);

  return (
    <>
      <div
        className={`cart-backdrop ${isOpen ? "show" : ""}`.trim()}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`cart-drawer ${isOpen ? "show" : ""}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-label="Keranjang pesanan"
      >
        <header className="cart-head">
          <div>
            <span className="cart-kicker">KERANJANG PESANAN</span>
            <h3>Pesanan Saya</h3>
          </div>

          <button
            type="button"
            className="cart-close"
            onClick={onClose}
            aria-label="Tutup keranjang"
          >
            ×
          </button>
        </header>

        <div className="cart-body">
          {lastOrder ? (
            <div className="cart-success">
              <div className="cart-success-icon">✓</div>
              <h4>Pesanan berhasil dibuat!</h4>

              <p>
                Kode pesanan kamu <strong>{lastOrder.orderCode}</strong>.
                Simpan kode ini untuk menanyakan status pesanan.
              </p>

              <ul className="cart-success-detail">
                <li>
                  <span>Penerima</span>
                  <strong>{lastOrder.recipient}</strong>
                </li>
                <li>
                  <span>Alamat</span>
                  <strong>
                    {lastOrder.address}
                    {lastOrder.city ? `, ${lastOrder.city}` : ""}
                    {lastOrder.postalCode ? ` ${lastOrder.postalCode}` : ""}
                  </strong>
                </li>
                <li>
                  <span>Jumlah item</span>
                  <strong>
                    {lastOrder.items.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}{" "}
                    porsi
                  </strong>
                </li>
                {lastOrder.discountCode && (
                  <li>
                    <span>Kode diskon</span>
                    <strong>
                      {lastOrder.discountCode} (−
                      {formatRupiah(lastOrder.discountAmount)})
                    </strong>
                  </li>
                )}
                <li>
                  <span>Ongkos kirim</span>
                  <strong>
                    {lastOrder.shippingCost === 0
                      ? "Gratis"
                      : formatRupiah(lastOrder.shippingCost)}
                  </strong>
                </li>
                <li className="cart-success-total">
                  <span>Total dibayar</span>
                  <strong>{formatRupiah(lastOrder.total)}</strong>
                </li>
              </ul>

              <button
                type="button"
                className="cart-checkout"
                onClick={onDismissLastOrder}
              >
                Pesan Menu Lagi
              </button>
            </div>
          ) : (
            <>
              {/* ───────────── DAFTAR ITEM ───────────── */}
              <section className="cart-block">
                <div className="cart-block-head">
                  <h4>
                    Item Pesanan <small>({items.length} menu)</small>
                  </h4>

                  {!isEmpty && (
                    <button
                      type="button"
                      className="cart-text-button"
                      onClick={onClear}
                    >
                      Kosongkan
                    </button>
                  )}
                </div>

                {isEmpty ? (
                  <div className="cart-empty">
                    <div>🛒</div>
                    <strong>Keranjang masih kosong</strong>
                    <p>
                      Tekan tombol <b>+ Keranjang</b> pada menu untuk mulai
                      memesan.
                    </p>
                  </div>
                ) : (
                  <ul className="cart-items">
                    {items.map((item) => (
                      <li key={item.slug}>
                        <img src={item.image} alt={item.name} />

                        <div className="cart-item-info">
                          <strong>{item.name}</strong>
                          <small>{formatRupiah(item.unitPrice)} / porsi</small>

                          <div className="cart-qty">
                            <button
                              type="button"
                              onClick={() => onDecrease(item.slug)}
                              aria-label={`Kurangi ${item.name}`}
                            >
                              −
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => onIncrease(item.slug)}
                              aria-label={`Tambah ${item.name}`}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="cart-item-right">
                          <strong>
                            {formatRupiah(item.unitPrice * item.quantity)}
                          </strong>

                          <button
                            type="button"
                            className="cart-remove"
                            onClick={() => onRemove(item.slug)}
                          >
                            Hapus
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* ───────────── ALAMAT PENGIRIMAN ───────────── */}
              <section className="cart-block">
                <div className="cart-block-head">
                  <h4>Alamat Pengiriman</h4>
                </div>

                <div className="cart-form-grid">
                  <label className="cart-field">
                    <span>Nama Penerima *</span>
                    <input
                      value={address.recipient}
                      onChange={(event) =>
                        onAddressChange("recipient", event.target.value)
                      }
                      placeholder="Contoh: Felicia Angeline"
                    />
                  </label>

                  <label className="cart-field">
                    <span>Nomor Telepon *</span>
                    <input
                      value={address.phone}
                      onChange={(event) =>
                        onAddressChange("phone", event.target.value)
                      }
                      placeholder="08xxxxxxxxxx"
                      inputMode="tel"
                    />
                  </label>

                  <label className="cart-field cart-field-full">
                    <span>Alamat Lengkap *</span>
                    <textarea
                      rows={3}
                      value={address.address}
                      onChange={(event) =>
                        onAddressChange("address", event.target.value)
                      }
                      placeholder="Nama jalan, nomor rumah, RT/RW, patokan"
                    />
                  </label>

                  <label className="cart-field">
                    <span>Kota / Kabupaten</span>
                    <input
                      value={address.city}
                      onChange={(event) =>
                        onAddressChange("city", event.target.value)
                      }
                      placeholder="Contoh: Jakarta Barat"
                    />
                  </label>

                  <label className="cart-field">
                    <span>Kode Pos</span>
                    <input
                      value={address.postalCode}
                      onChange={(event) =>
                        onAddressChange("postalCode", event.target.value)
                      }
                      placeholder="11470"
                      inputMode="numeric"
                    />
                  </label>

                  <label className="cart-field cart-field-full">
                    <span>Catatan untuk Penjual</span>
                    <input
                      value={address.note}
                      onChange={(event) =>
                        onAddressChange("note", event.target.value)
                      }
                      placeholder="Contoh: bumbu kacang dipisah, jangan pedas"
                    />
                  </label>
                </div>
              </section>

              {/* ───────────── KODE DISKON ───────────── */}
              <section className="cart-block">
                <div className="cart-block-head">
                  <h4>Kode Diskon</h4>
                </div>

                {appliedDiscount ? (
                  <div className="cart-discount-applied">
                    <div>
                      <strong>{appliedDiscount.code}</strong>
                      <small>{appliedDiscount.label}</small>
                    </div>

                    <div className="cart-discount-value">
                      <span>
                        {appliedDiscount.amount > 0
                          ? `−${formatRupiah(appliedDiscount.amount)}`
                          : "Gratis ongkir"}
                      </span>

                      <button
                        type="button"
                        className="cart-text-button"
                        onClick={onRemoveDiscount}
                      >
                        Lepas
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="cart-discount-form">
                    <input
                      value={discountInput}
                      onChange={(event) =>
                        onDiscountInputChange(
                          event.target.value.toUpperCase()
                        )
                      }
                      placeholder="Masukkan kode, mis. NUSANTARA20"
                      aria-label="Kode diskon"
                    />

                    <button
                      type="button"
                      className="cart-apply"
                      onClick={onApplyDiscount}
                      disabled={isEmpty}
                    >
                      Pakai
                    </button>
                  </div>
                )}

                {discountError && (
                  <p className="cart-discount-error">{discountError}</p>
                )}
              </section>

              {children}
            </>
          )}
        </div>

        {!lastOrder && (
          <footer className="cart-foot">
            {!isEmpty &&
              totals.shipping > 0 &&
              remainingForFreeShipping > 0 && (
                <p className="cart-shipping-hint">
                  Tambah {formatRupiah(remainingForFreeShipping)} lagi untuk
                  gratis ongkir.
                </p>
              )}

            <ul className="cart-summary">
              <li>
                <span>Subtotal</span>
                <strong>{formatRupiah(totals.subtotal)}</strong>
              </li>

              <li>
                <span>Diskon</span>
                <strong className={totals.discount > 0 ? "is-discount" : ""}>
                  {totals.discount > 0
                    ? `−${formatRupiah(totals.discount)}`
                    : formatRupiah(0)}
                </strong>
              </li>

              <li>
                <span>Ongkos kirim</span>
                <strong>
                  {isEmpty
                    ? formatRupiah(0)
                    : totals.shipping === 0
                      ? "Gratis"
                      : formatRupiah(shippingBase)}
                </strong>
              </li>

              <li className="cart-total">
                <span>Harga Total</span>
                <strong>{formatRupiah(totals.total)}</strong>
              </li>
            </ul>

            <button
              type="button"
              className="cart-checkout"
              onClick={onCheckout}
              disabled={isEmpty || submitting}
            >
              {submitting
                ? "Memproses pesanan..."
                : `Buat Pesanan · ${formatRupiah(totals.total)}`}
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}
