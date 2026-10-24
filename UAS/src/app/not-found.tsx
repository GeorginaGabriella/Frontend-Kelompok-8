import React from "react";
import Link from "next/link";
import Button from "@/components/Button";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px",
        background: "#f8f5ea",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: "480px",
          background: "#fffdf8",
          padding: "50px 35px",
          borderRadius: "25px",
          border: "1px solid rgba(49, 87, 44, 0.12)",
        }}
      >
        <div style={{ fontSize: "56px", marginBottom: "12px" }}>🥜</div>
        <p className="section-label">404 NOT FOUND</p>
        <h1
          style={{
            fontFamily: '"Playfair Display", serif',
            color: "#31572c",
            fontSize: "36px",
            margin: "10px 0 14px",
          }}
        >
          Halaman Tidak Ditemukan
        </h1>
        <p style={{ color: "#696d65", fontSize: "14px", lineHeight: 1.7, marginBottom: "24px" }}>
          Menu atau halaman yang kamu cari tidak tersedia di katalog Gado-Gado
          Nusantara.
        </p>
        <Link href="/" style={{ display: "inline-block" }}>
          <Button variant="modulePrimary" label="Kembali ke Beranda" />
        </Link>
      </div>
    </div>
  );
}
