"use client";

import { useEffect, useState } from "react";
import { MenuItem } from "@/types";
import { isSideMenu } from "@/data/gadoGadoData";

interface PromoBannerProps {
  menus: MenuItem[];
  onOpenDetail: (menu: MenuItem) => void;
}

export default function PromoBanner({
  menus,
  onOpenDetail,
}: PromoBannerProps) {
  // Ambil maksimal 5 menu utama untuk rekomendasi
  const recommendations = menus
    .filter((menu) => !isSideMenu(menu))
    .slice(0, 5);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (recommendations.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((current) =>
        (current + 1) % recommendations.length
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [recommendations.length]);

  if (recommendations.length === 0) return null;

  const activeMenu = recommendations[activeIndex];

  const previousSlide = () => {
    setActiveIndex((current) =>
      (current - 1 + recommendations.length) %
      recommendations.length
    );
  };

  const nextSlide = () => {
    setActiveIndex((current) =>
      (current + 1) % recommendations.length
    );
  };

  return (
    <section className="promo-recommendation">
      <div className="promo-recommendation-inner">

        <div className="promo-recommendation-content">
          <span className="promo-recommendation-label">
            ✦ REKOMENDASI TERATAS
          </span>

          <p className="promo-recommendation-subtitle">
            PILIHAN SPESIAL NUSANTARA
          </p>

          <h2>
            Menu Andalan
            <span> Nusantara</span>
          </h2>

          <p className="promo-recommendation-description">
            Temukan sajian favorit dengan cita rasa khas
            Nusantara yang istimewa dan menggugah selera.
          </p>

          <div className="promo-recommendation-info">
            <span>
              REKOMENDASI {activeIndex + 1} / {recommendations.length}
            </span>

            <h3>{activeMenu.name}</h3>

            <p>{activeMenu.shortDescription}</p>

            <strong>{activeMenu.price}</strong>
          </div>

          <button
            type="button"
            className="promo-recommendation-button"
            onClick={() => onOpenDetail(activeMenu)}
          >
            Lihat Menu <span>→</span>
          </button>

          <div className="promo-recommendation-navigation">
            <button
              type="button"
              onClick={previousSlide}
              aria-label="Rekomendasi sebelumnya"
            >
              ‹
            </button>

            {recommendations.map((menu, index) => (
              <button
                key={menu.slug}
                type="button"
                aria-label={`Pilih rekomendasi ${index + 1}`}
                className={`promo-recommendation-dot ${
                  activeIndex === index ? "active" : ""
                }`}
                onClick={() => setActiveIndex(index)}
              />
            ))}

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Rekomendasi selanjutnya"
            >
              ›
            </button>
          </div>
        </div>

        <div className="promo-recommendation-visual">
          <img
            key={activeMenu.slug}
            src={activeMenu.image}
            alt={activeMenu.name}
          />

          <div className="promo-recommendation-image-caption">
            <span>MENU PILIHAN</span>
            <h3>{activeMenu.name}</h3>
          </div>

          <div className="promo-recommendation-badge">
            TOP {activeIndex + 1}
          </div>
        </div>

      </div>
    </section>
  );
}
