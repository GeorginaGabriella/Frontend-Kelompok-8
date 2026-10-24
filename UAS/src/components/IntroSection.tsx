import React from "react";
import SectionContainer from "./SectionContainer";

interface IntroSectionProps {
  title?: string;
  highlight?: string;
  children?: React.ReactNode;
}

/**
 * Komponen Fungsional IntroSection (Poin 10 & Poin 11: Functional Component, Props & Children)
 */
export default function IntroSection({
  title = "Satu Hidangan,",
  highlight = "Beragam Cerita",
  children,
}: IntroSectionProps) {
  return (
    <SectionContainer
      className="intro-section"
      containerClassName="intro-grid"
    >
      <div className="intro-image">
        <div className="image-frame">
          <img src="/images/hero.png" alt="Gado-Gado Indonesia" />
        </div>

        <div className="intro-stamp">
          <span>🇮🇩</span>
          <strong>Kuliner</strong>
          <small>Nusantara</small>
        </div>
      </div>

      <div className="intro-text">
        <p className="section-label">KENALI KULINERNYA</p>

        <h2>
          {title}
          <span>{highlight}</span>
        </h2>

        {children ?? (
          <>
            <p>
              Gado-gado merupakan hidangan yang memadukan berbagai sayuran
              dengan saus kacang. Setiap daerah memiliki karakteristik dan
              komponen yang membuatnya berbeda.
            </p>

            <p>
              Melalui Gado-Gado Nusantara, kamu dapat mengenal berbagai variasi
              gado-gado dari berbagai daerah Indonesia secara lebih menarik dan
              interaktif.
            </p>
          </>
        )}

        <a href="#menu" className="text-button">
          Lihat Semua Menu →
        </a>
      </div>
    </SectionContainer>
  );
}
