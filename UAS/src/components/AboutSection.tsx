import React from "react";
import SectionContainer from "./SectionContainer";
import { FeatureCardProps } from "@/types";

interface AboutSectionProps {
  aboutDescription: string;
  children?: React.ReactNode;
}

/**
 * Komponen Fungsional FeatureCard (Poin 10 & Poin 11: Functional Component, Props & Children)
 */
export function FeatureCard({
  icon,
  title,
  description,
  children,
}: FeatureCardProps) {
  return (
    <div>
      <span>{icon}</span>
      <strong>{title}</strong>
      <p>{children ?? description}</p>
    </div>
  );
}

/**
 * Komponen Fungsional AboutSection (Poin 10 & Poin 11: Functional Component, Props & Children)
 */
export default function AboutSection({
  aboutDescription,
  children,
}: AboutSectionProps) {
  return (
    <SectionContainer
      id="about"
      className="about-section"
      containerClassName="about-grid"
    >
      <div className="about-content">
        <p className="section-label">TENTANG KAMI</p>

        <h2>
          Mengenal Gado-Gado,
          <span>Mengenal Indonesia</span>
        </h2>

        <p id="aboutDescription">{aboutDescription}</p>

        <p>
          Website ini dibuat untuk memberikan pengalaman eksplorasi kuliner yang
          sederhana, informatif, dan interaktif.
        </p>

        <div className="about-features">
          <FeatureCard
            icon="🌿"
            title="Beragam Daerah"
            description="Kenali variasi dari berbagai wilayah."
          />
          <FeatureCard
            icon="🥜"
            title="Cita Rasa"
            description="Setiap menu memiliki karakter berbeda."
          />
          <FeatureCard
            icon="❤️"
            title="Interaktif"
            description="Pilih dan tandai menu favoritmu."
          />
        </div>

        {children}
      </div>

      <div className="about-visual">
        <div className="batik-circle"></div>

        <div className="about-card">
          <span>🇮🇩</span>
          <strong>Rasa Indonesia</strong>
          <p>Beragam rasa dalam satu perjalanan kuliner Nusantara.</p>
        </div>

        <div className="about-food">
          <img src="/images/hero.png" alt="Kuliner Gado-Gado" />
        </div>
      </div>
    </SectionContainer>
  );
}
