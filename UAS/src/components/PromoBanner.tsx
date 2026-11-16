"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { PromoBannerProps } from "@/types";

/**
 * Sliding banner promo yang bergeser otomatis.
 * - Berganti sendiri setiap `interval` milidetik.
 * - Berhenti saat kursor berada di atas banner atau saat tab tidak aktif.
 * - Bisa digeser manual lewat panah dan titik indikator.
 */
export default function PromoBanner({
  slides,
  interval = 4500,
  onUseCode,
  children,
}: PromoBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const total = slides.length;

  const goTo = useCallback(
    (index: number) => {
      if (total === 0) return;
      setActiveIndex(((index % total) + total) % total);
    },
    [total]
  );

  const goNext = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const goPrevious = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  // Banner geser otomatis.
  useEffect(() => {
    if (paused || total <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((previous) => (previous + 1) % total);
    }, interval);

    return () => window.clearInterval(timer);
  }, [paused, total, interval]);

  if (total === 0) return null;

  return (
    <section className="promo-banner-section" aria-label="Banner promo">
      <div className="container">
        <div
          className="promo-banner"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            const start = touchStartX.current;
            const end = event.changedTouches[0]?.clientX ?? null;

            if (start !== null && end !== null) {
              const distance = end - start;

              if (Math.abs(distance) > 45) {
                if (distance < 0) goNext();
                else goPrevious();
              }
            }

            touchStartX.current = null;
          }}
        >
          <div
            className="promo-track"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <article
                key={slide.id}
                className={`promo-slide promo-${slide.accent}`}
                aria-hidden={index !== activeIndex}
              >
                <div className="promo-slide-text">
                  <span className="promo-eyebrow">{slide.eyebrow}</span>
                  <h3>{slide.title}</h3>
                  <p>{slide.description}</p>

                  <div className="promo-actions">
                    <button
                      type="button"
                      className="promo-cta"
                      onClick={() => onUseCode?.(slide.code)}
                    >
                      {slide.ctaLabel}
                      <span aria-hidden="true">→</span>
                    </button>

                    <span className="promo-code">
                      KODE: <strong>{slide.code}</strong>
                    </span>
                  </div>
                </div>

                <div className="promo-slide-image">
                  <div className="promo-glow" />
                  <img src={slide.image} alt={slide.title} />
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            className="promo-arrow promo-arrow-prev"
            aria-label="Banner sebelumnya"
            onClick={goPrevious}
          >
            ‹
          </button>

          <button
            type="button"
            className="promo-arrow promo-arrow-next"
            aria-label="Banner berikutnya"
            onClick={goNext}
          >
            ›
          </button>

          <div className="promo-dots" role="tablist" aria-label="Pilih banner">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Banner ${index + 1}`}
                className={`promo-dot ${
                  index === activeIndex ? "active" : ""
                }`.trim()}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        </div>

        {children}
      </div>
    </section>
  );
}
