"use client";

import { useEffect, useState } from "react";
import { MenuItem } from "@/types";
import { isSideMenu } from "@/data/gadoGadoData";
import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";

interface PromoBannerProps {
  menus: MenuItem[];
  onOpenDetail: (menu: MenuItem) => void;
}

export default function PromoBanner({
  menus,
  onOpenDetail,
}: PromoBannerProps) {
  const recommendations = menus
    .filter((menu) => !isSideMenu(menu))
    .slice(0, 4);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (recommendations.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((current) =>
        (current + 1) % recommendations.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [recommendations.length]);

  if (recommendations.length === 0) return null;

  const currentMenu = recommendations[activeIndex];

  const nextSlide = () => {
    setActiveIndex((current) =>
      (current + 1) % recommendations.length
    );
  };

  const prevSlide = () => {
    setActiveIndex((current) =>
      (current - 1 + recommendations.length) %
      recommendations.length
    );
  };

  const colors = ["promo-emerald", "promo-gold", "promo-clove", "promo-ember"];

  return (
    <section className="promo-banner-section">
      <div className="container">
        <div className="promo-banner">
          <div
            className="promo-track"
            style={{
              transform: `translateX(-${activeIndex * 100}%)`,
            }}
          >
            {recommendations.map((menu, index) => (
              <div
                className={`promo-slide ${colors[index % colors.length]}`}
                key={menu.slug}
              >
                <div className="promo-slide-text">
                  <span className="promo-eyebrow">
                    <Star size={13} fill="currentColor" />
                    REKOMENDASI MENU
                  </span>

                  <h3>{menu.name}</h3>

                  <p>{menu.shortDescription}</p>

                  <div className="promo-actions">
                    <button
                      type="button"
                      className="promo-cta"
                      onClick={() => onOpenDetail(menu)}
                    >
                      Lihat Detail
                      <ArrowRight size={16} />
                    </button>

                    <span className="promo-code">
                      Harga: <strong>{menu.price}</strong>
                    </span>
                  </div>
                </div>

                <div className="promo-slide-image">
                  <div className="promo-glow" />

                  <img
                    src={menu.image}
                    alt={menu.name}
                  />
                </div>
              </div>
            ))}
          </div>

          {recommendations.length > 1 && (
            <>
              <button
                type="button"
                className="promo-arrow promo-arrow-prev"
                onClick={prevSlide}
                aria-label="Menu sebelumnya"
              >
                <ChevronLeft size={22} />
              </button>

              <button
                type="button"
                className="promo-arrow promo-arrow-next"
                onClick={nextSlide}
                aria-label="Menu berikutnya"
              >
                <ChevronRight size={22} />
              </button>

              <div className="promo-dots">
                {recommendations.map((menu, index) => (
                  <button
                    type="button"
                    key={menu.slug}
                    className={`promo-dot ${
                      activeIndex === index ? "active" : ""
                    }`}
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Buka rekomendasi ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
