"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UserAccount } from "@/types";

interface HeaderProps {
  activeSection?: string;
  favoriteCount: number;
  currentUser: UserAccount | null;
  onProfileClick: () => void;
  children?: React.ReactNode;
}

const navItems = [
  { id: "home", label: "Home", href: "/#home" },
  { id: "menu", label: "Menu", href: "/#menu" },
  { id: "favorit", label: "Favorit", href: "/#favorit" },
  { id: "about", label: "About", href: "/#about" },
  { id: "cuaca", label: "Cuaca Daerah", href: "/#cuaca" },
  { id: "faq", label: "FAQ", href: "/#faq" },
];

/**
 * Komponen Fungsional Header (Poin 10 & Poin 11: Functional Component, Props & Children)
 */
export default function Header({
  activeSection = "home",
  favoriteCount,
  currentUser,
  onProfileClick,
  children,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container nav-wrapper">
        <Link href="/#home" className="logo">
          <span className="logo-icon">🥜</span>
          <span>
            <strong>Gado-Gado</strong>
            <small>NUSANTARA</small>
          </span>
        </Link>

        <nav className="navbar">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`nav-link ${activeSection === item.id ? "active" : ""}`.trim()}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          {children}

          <a
            href="/#favorit"
            className="icon-button favorite-nav"
            title="Favorit"
          >
            <span>♡</span>
            <b id="favoriteCounter">{favoriteCount}</b>
          </a>

          <button
            type="button"
            className="profile-button"
            id="profileButton"
            title={currentUser ? `Profil (${currentUser.name})` : "Login / Register"}
            onClick={onProfileClick}
          >
            👤
          </button>

          <button
            type="button"
            className="menu-toggle"
            id="menuToggle"
            aria-label="Toggle navigasi mobile"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            ☰
          </button>
        </div>
      </div>

      <div
        className={`mobile-nav ${mobileMenuOpen ? "show" : ""}`.trim()}
        id="mobileNav"
      >
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            onClick={() => setMobileMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </div>
    </header>
  );
}
