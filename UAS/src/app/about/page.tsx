import React from "react";
import Link from "next/link";
import AboutSection from "@/components/AboutSection";
import IntroSection from "@/components/IntroSection";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { defaultSiteContent } from "@/data/gadoGadoData";

export default function AboutPage() {
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
            <Link href="/#menu" className="nav-link">
              Menu
            </Link>
            <Link href="/about" className="nav-link active">
              About
            </Link>
          </nav>

          <div className="nav-actions">
            <Button href="/" variant="modulePrimary" size="sm">
              ← Kembali ke Beranda
            </Button>
          </div>
        </div>
      </header>

      <main>
        <AboutSection aboutDescription={defaultSiteContent.aboutDescription} />
        <IntroSection
          title="Arsitektur Modern,"
          highlight="Next.js App Router"
        >
          <p>
            Proyek Gado-Gado Nusantara ini telah dikonversi dari arsitektur
            statis (HTML, CSS, dan jQuery) pada UTS menjadi aplikasi web modern
            berbasis <strong>Next.js 14 App Router</strong> dengan{" "}
            <strong>TypeScript</strong>.
          </p>
          <p>
            Seluruh bagian antarmuka dibangun menggunakan{" "}
            <strong>Functional Components</strong> yang modular serta menerapkan
            konsep <strong>Props &amp; Children</strong> untuk pertukaran data
            dan komposisi antarmuka yang bersih.
          </p>
        </IntroSection>
      </main>

      <Footer />
    </>
  );
}
