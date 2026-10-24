import React from "react";
import Button from "./Button";
import { StatBadgeProps } from "@/types";

interface HeroSectionProps {
  heroDescription: string;
  children?: React.ReactNode;
}

/**
 * Komponen Fungsional StatBadge (Poin 10 & Poin 11: Functional Component, Props & Children)
 */
export function StatBadge({ value, label, children }: StatBadgeProps) {
  return (
    <div>
      <strong>{value}</strong>
      <span>{children ?? label}</span>
    </div>
  );
}

/**
 * Komponen Fungsional HeroSection (Poin 10 & Poin 11: Functional Component, Props & Children)
 */
export default function HeroSection({
  heroDescription,
  children,
}: HeroSectionProps) {
  return (
    <section className="hero" id="home">
      <div className="hero-pattern"></div>

      <div className="container hero-content">
        <div className="hero-text">
          <p className="eyebrow">
            <span></span>
            KULINER KHAS INDONESIA
          </p>

          <h1>
            Jelajahi Rasa,
            <em>Kenali Nusantara</em>
          </h1>

          <p className="hero-description">{heroDescription}</p>

          <div className="hero-buttons">
            <Button href="#menu" variant="primary">
              Jelajahi Menu
              <span>→</span>
            </Button>

            <Button href="#about" variant="secondary" label="Tentang Gado-Gado" />
          </div>

          <div className="hero-info">
            <StatBadge value="10+" label="Menu Nusantara" />
            <StatBadge value="8" label="Daerah" />
            <StatBadge value="100%" label="Kuliner Indonesia" />
          </div>

          {children}
        </div>

        <div className="hero-visual">
          <div className="hero-circle"></div>
          <div className="hero-batik batik-top"></div>
          <div className="hero-batik batik-bottom"></div>

          <div className="floating-leaf leaf-one">🌿</div>
          <div className="floating-leaf leaf-two">🍃</div>
          <div className="floating-peanut peanut-one">🥜</div>
          <div className="floating-peanut peanut-two">🥜</div>

          <div className="hero-food">
            <img src="/images/hero.png" alt="Gado-Gado Nusantara" />
          </div>

          <div className="hero-label">
            <span>🍽️</span>
            <div>
              <strong>Gado-Gado</strong>
              <small>Warisan Kuliner Nusantara</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
