"use client";

import React, { useMemo, useState } from "react";
import SectionContainer from "./SectionContainer";
import SectionHeading from "./SectionHeading";
import MenuCard from "./MenuCard";
import { FilterGroup, MenuItem } from "@/types";

interface MenuSectionProps {
  menus: MenuItem[];
  favorites: string[];
  onToggleFavorite: (name: string) => void;
  onOpenDetail: (menu: MenuItem) => void;
  onAddChoice: (name: string) => void;
  children?: React.ReactNode;
}

const filterOptions: Array<{ value: FilterGroup; label: string }> = [
  { value: "semua", label: "Semua" },
  { value: "betawi", label: "Betawi" },
  { value: "sunda", label: "Sunda" },
  { value: "jawa", label: "Jawa" },
  { value: "lainnya", label: "Lainnya" },
];

/**
 * Komponen Fungsional MenuSection (Poin 10 & Poin 11: Functional Component, Props & Children)
 */
export default function MenuSection({
  menus,
  favorites,
  onToggleFavorite,
  onOpenDetail,
  onAddChoice,
  children,
}: MenuSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterGroup>("semua");

  const filteredMenus = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    return menus.filter((menu) => {
      const matchSearch =
        menu.searchName.toLowerCase().includes(keyword) ||
        menu.name.toLowerCase().includes(keyword) ||
        menu.region.toLowerCase().includes(keyword);
      const matchFilter =
        activeFilter === "semua" || menu.group === activeFilter;
      return matchSearch && matchFilter;
    });
  }, [menus, searchQuery, activeFilter]);

  return (
    <SectionContainer id="menu" className="menu-section">
      <SectionHeading
        label="PILIHAN NUSANTARA"
        title="Menu Gado-Gado"
        description="Temukan gado-gado favoritmu dari berbagai daerah di Indonesia."
      />

      <div className="search-filter">
        <div className="search-box">
          <span>⌕</span>
          <input
            type="text"
            id="cariMenu"
            placeholder="Cari gado-gado..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <button
            type="button"
            id="clearSearch"
            style={{ display: searchQuery.length > 0 ? "block" : "none" }}
            onClick={() => setSearchQuery("")}
            aria-label="Bersihkan pencarian"
          >
            ×
          </button>
        </div>

        <div className="filter-wrapper">
          <span className="filter-title">Filter:</span>

          <div className="filter-buttons">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`filter-btn ${
                  activeFilter === option.value ? "active" : ""
                }`.trim()}
                data-filter={option.value}
                onClick={() => setActiveFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {children}

      <div className="menu-container" id="menuContainer">
        {filteredMenus.map((menu) => (
          <MenuCard
            key={menu.name}
            menu={menu}
            isFavorite={favorites.includes(menu.name)}
            onToggleFavorite={onToggleFavorite}
            onOpenDetail={onOpenDetail}
            onAddChoice={onAddChoice}
          />
        ))}
      </div>

      <div
        className="empty-search"
        id="emptySearch"
        style={{ display: filteredMenus.length === 0 ? "block" : "none" }}
      >
        <div>🔎</div>
        <h3>Menu tidak ditemukan</h3>
        <p>Coba gunakan kata pencarian atau filter yang berbeda.</p>
      </div>

      <div className="load-info">
        <span id="menuCount">{filteredMenus.length}</span> menu tersedia
      </div>
    </SectionContainer>
  );
}
