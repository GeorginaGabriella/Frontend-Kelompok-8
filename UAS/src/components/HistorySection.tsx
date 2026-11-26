"use client";

import { useEffect, useState } from "react";

const historySlides = [
  {
    title: "Asal-usul",
    description:
      "Gado-gado dikenal sebagai kuliner khas Betawi yang lahir dari keberagaman budaya di Jakarta. Perpaduan sayuran, tahu, tempe, dan saus kacang menjadikannya hidangan sederhana yang kaya cita rasa dan terus diwariskan hingga kini.",
    image: "/images/sejarah-asal-usul.png",
    caption: "MENGENAL SEJARAH",
  },
  {
    title: "Keunikan Hidangan",
    description:
      "Gado-gado memiliki keunikan dari perpaduan berbagai sayuran segar, tahu, tempe, lontong, dan telur yang disiram saus kacang. Perpaduan rasa gurih, manis, dan sedikit pedas menciptakan cita rasa khas yang menggugah selera.",
    image: "/images/sejarah-keunikan.png",
    caption: "KAYA RASA NUSANTARA",
  },
  {
    title: "Racikan Tradisional",
    description:
      "Salah satu rahasia kelezatan gado-gado terletak pada saus kacangnya. Kacang tanah dihaluskan bersama bawang putih, cabai, gula merah, dan bumbu lainnya hingga menghasilkan saus yang gurih, manis, dan sedikit pedas.",
    image: "/images/sejarah-racikan.png",
    caption: "WARISAN KULINER",
  },
  {
    title: "Warisan Nusantara",
    description:
      "Gado-gado bukan sekadar hidangan, tetapi juga bagian dari kekayaan kuliner Indonesia. Cita rasanya yang khas membuat makanan ini tetap digemari dari generasi ke generasi.",
    image: "/images/sejarah-warisan.png",
    caption: "KEKAYAAN KULINER INDONESIA",
  },
];

export default function HistorySection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) =>
        (current + 1) % historySlides.length
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const previousSlide = () => {
    setActiveIndex((current) =>
      (current - 1 + historySlides.length) % historySlides.length
    );
  };

  const nextSlide = () => {
    setActiveIndex((current) =>
      (current + 1) % historySlides.length
    );
  };

  const activeSlide = historySlides[activeIndex];

  return (
    <section className="history-hero">
      <div className="history-hero-inner">

        <div className="history-hero-content">
          <span className="history-hero-label">
            ✦ MENGENAL WARISAN KULINER
          </span>

          <h2 className="history-hero-title">
            Jejak Sejarah <span>Gado-Gado</span>
          </h2>

          <div className="history-hero-detail">
            <h3>{activeSlide.title}</h3>
            <p>{activeSlide.description}</p>
          </div>

          <div className="history-hero-navigation">
            <button
              type="button"
              onClick={previousSlide}
              aria-label="Cerita sebelumnya"
            >
              ‹
            </button>

            <div className="history-hero-dots">
              {historySlides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  aria-label={`Pilih cerita ${index + 1}`}
                  className={activeIndex === index ? "active" : ""}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Cerita selanjutnya"
            >
              ›
            </button>
          </div>
        </div>

        <div className="history-hero-right">
          <div className="history-hero-visual">
            <img
              key={activeSlide.image}
              src={activeSlide.image}
              alt={activeSlide.title}
            />

            <span className="history-hero-caption">
              {activeSlide.caption}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
