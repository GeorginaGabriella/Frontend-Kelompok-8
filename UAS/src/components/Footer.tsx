import React from "react";
import Link from "next/link";
import { UserAccount } from "@/types";

interface FooterProps {
  currentUser?: UserAccount | null;
  onOpenAdmin?: () => void;
  children?: React.ReactNode;
}

/**
 * Komponen Fungsional Footer (Poin 10 & Poin 11: Functional Component, Props & Children)
 */
export default function Footer({
  currentUser,
  onOpenAdmin,
  children,
}: FooterProps) {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <Link href="/#home" className="logo footer-logo">
            <span className="logo-icon">🥜</span>
            <span>
              <strong>Gado-Gado</strong>
              <small>NUSANTARA</small>
            </span>
          </Link>

          <p>Jelajahi rasa, kenali Nusantara.</p>
          {children}
        </div>

        <div className="footer-links">
          <h4>Navigasi</h4>
          <a href="/#home">Home</a>
          <a href="/#menu">Menu</a>
          <a href="/#favorit">Favorit</a>
          <a href="/#about">About</a>
          <Link href="/about">Halaman About</Link>
        </div>

        <div className="footer-links">
          <h4>Fitur</h4>
          <a href="/#menu">Search</a>
          <a href="/#menu">Filter</a>
          <a href="/#favorit">Favorit</a>
          <a href="/#pilihan">Pilihan Saya</a>
          <a href="/#cuaca">Cuaca Kuliner</a>
        </div>

        <div className="footer-contact">
          <h4>Gado-Gado Nusantara</h4>
          <p>
            Website kuliner interaktif berbasis Next.js untuk mengenal
            keberagaman gado-gado Indonesia.
          </p>
          {currentUser?.role === "admin" && onOpenAdmin && (
            <button
              className="admin-open"
              id="adminOpen"
              type="button"
              onClick={onOpenAdmin}
            >
              ⚙ Kelola Konten
            </button>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Gado-Gado Nusantara. Project UAS Frontend (Next.js).</p>
      </div>
    </footer>
  );
}
