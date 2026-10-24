import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import SectionContainer from "@/components/SectionContainer";
import { getMenuBySlug, initialMenus } from "@/data/gadoGadoData";

export function generateStaticParams() {
  return initialMenus.map((menu) => ({
    slug: menu.slug,
  }));
}

export default function MenuDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const menu = getMenuBySlug(params.slug);

  if (!menu) {
    notFound();
  }

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `penjual ${menu.name} ${menu.location}`
  )}`;

  return (
    <>
      <header className="header">
        <div className="container nav-wrapper">
          <Link href="/" className="logo">
            <span className="logo-icon">🥜</span>
            <span>
              <strong>Gado-Gado</strong>
              <small>NUSANTARA</small>
            </span>
          </Link>

          <nav className="navbar">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/#menu" className="nav-link active">
              Menu
            </Link>
            <Link href="/about" className="nav-link">
              About
            </Link>
          </nav>

          <div className="nav-actions">
            <Button href="/#menu" variant="modulePrimary" size="sm">
              ← Semua Menu
            </Button>
          </div>
        </div>
      </header>

      <main>
        <SectionContainer className="detail-page-section">
          <div style={{ marginBottom: "22px" }}>
            <Link href="/#menu" className="text-button">
              ← Kembali ke Katalog Menu Gado-Gado
            </Link>
          </div>

          <div className="detail-page-card">
            <div className="detail-page-image">
              <img src={menu.image} alt={menu.name} />
            </div>

            <div className="detail-page-body">
              <span className="modal-region">{menu.region}</span>
              <h1
                style={{
                  fontFamily: '"Playfair Display", serif',
                  color: "#31572c",
                  fontSize: "clamp(32px, 4vw, 44px)",
                  margin: "8px 0",
                }}
              >
                {menu.name}
              </h1>

              <div className="modal-rating">
                <span>★★★★★</span>
                <strong>
                  {menu.rating} • {menu.categoryLabel}
                </strong>
              </div>

              <p
                style={{
                  color: "#6f716b",
                  lineHeight: 1.8,
                  fontSize: "15px",
                }}
              >
                {menu.description}
              </p>

              <div className="modal-ingredients">
                <h4>Komponen Menu</h4>
                <div id="modalIngredients">
                  {menu.ingredients.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>

              <div className="modal-facts">
                <div>
                  <span>Harga pasaran</span>
                  <strong>{menu.price}</strong>
                  <small>
                    Perkiraan per porsi; dapat berbeda menurut penjual dan
                    lokasi.
                  </small>
                </div>
                <div>
                  <span>Kondimen</span>
                  <p>{menu.condiments}</p>
                </div>
                <div>
                  <span>Manfaat Makanan</span>
                  <p>{menu.benefits}</p>
                  <small>Informasi umum bahan, bukan klaim medis.</small>
                </div>
                <div>
                  <span>Area penjual</span>
                  <p>{menu.location}</p>
                  <a
                    className="map-link"
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cari di Google Maps ↗
                  </a>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Button href="/#menu" variant="primary">
                  Pilih di Katalog Utama
                </Button>
                <Button href="/#cuaca" variant="secondary">
                  Cek Cuaca {menu.city}
                </Button>
              </div>
            </div>
          </div>
        </SectionContainer>
      </main>

      <Footer />
    </>
  );
}
