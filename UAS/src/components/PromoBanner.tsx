"use client";

import { MenuItem } from "@/types";
import { isSideMenu } from "@/data/gadoGadoData";
import { ArrowRight, Star } from "lucide-react";

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
    .slice(0, 3);

  return (
    <section className="recommendation-section">
      <div className="container">
        <div className="recommendation-heading">
          <div>
            <span>REKOMENDASI KAMI</span>
            <h2>
              Menu <strong>Favorit</strong>
            </h2>
            <p>
              Temukan pilihan gado-gado Nusantara
              yang wajib kamu coba.
            </p>
          </div>

          <a href="#menu" className="recommendation-link">
            Lihat Semua Menu <ArrowRight size={17} />
          </a>
        </div>

        <div className="recommendation-grid">
          {recommendations.map((menu) => (
            <article
              className="recommendation-card"
              key={menu.slug}
            >
              <button
                type="button"
                className="recommendation-image"
                onClick={() => onOpenDetail(menu)}
                aria-label={`Lihat ${menu.name}`}
              >
                <img src={menu.image} alt={menu.name} />
                <span className="recommendation-tag">
                  PILIHAN FAVORIT
                </span>
              </button>

              <div className="recommendation-info">
                <div>
                  <span className="recommendation-category">
                    {menu.categoryLabel}
                  </span>
                  <h3>{menu.name}</h3>
                  <p>{menu.shortDescription}</p>
                </div>

                <div className="recommendation-bottom">
                  <strong>{menu.price}</strong>
                  <span className="recommendation-rating">
                    <Star size={15} fill="currentColor" />
                    {menu.rating}
                  </span>
                </div>

                <button
                  type="button"
                  className="recommendation-button"
                  onClick={() => onOpenDetail(menu)}
                >
                  Lihat Detail <ArrowRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
