
"use client";

import React, { useMemo, useState } from "react";
import SectionContainer from "./SectionContainer";
import SectionHeading from "./SectionHeading";
import MenuCard from "./MenuCard";
import { isSideMenu } from "@/data/gadoGadoData";
import { FilterGroup, MenuItem } from "@/types";

interface MenuSectionProps {
  menus: MenuItem[];
  favorites: string[];
  onToggleFavorite: (name: string) => void;
  onOpenDetail: (menu: MenuItem) => void;
  onAddChoice: (name: string) => void;
  onAddToCart?: (menu: MenuItem) => void;
  children?: React.ReactNode;
}

type SortOption = "abjad" | "abjad-desc" | "harga" | "rating";

const filterOptions: Array<{ value: FilterGroup; label: string }> = [
  { value: "semua", label: "Semua" },
  { value: "dessert", label: "Dessert" },
  { value: "lainnya", label: "Lainnya" },
];

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: "abjad", label: "Nama A → Z" },
  { value: "abjad-desc", label: "Nama Z → A" },
  { value: "harga", label: "Harga termurah" },
  { value: "rating", label: "Rating tertinggi" },
];

export default function MenuSection({
  menus,
  favorites,
  onToggleFavorite,
  onOpenDetail,
  onAddChoice,
  onAddToCart,
  children,
}: MenuSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterGroup>("semua");
  const [sortBy, setSortBy] = useState<SortOption>("abjad");

  const filteredMenus = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    const result = menus.filter((menu) => {
      const matchSearch =
        menu.searchName.toLowerCase().includes(keyword) ||
        menu.name.toLowerCase().includes(keyword) ||
        menu.region.toLowerCase().includes(keyword) ||
        menu.categoryLabel.toLowerCase().includes(keyword);

      const matchFilter =
        activeFilter === "semua" || menu.group === activeFilter;

      return matchSearch && matchFilter;
    });

    const toNumber = (value: string) =>
      Number.parseInt(value.replace(/[^0-9]/g, "").slice(0, 9), 10) || 0;

    return [...result].sort((a, b) => {
      if (sortBy === "abjad") {
        return a.name.localeCompare(b.name, "id");
      }

      if (sortBy === "abjad-desc") {
        return b.name.localeCompare(a.name, "id");
      }

      if (sortBy === "harga") {
        return toNumber(a.price) - toNumber(b.price);
      }

      return Number(b.rating) - Number(a.rating);
    });
  }, [menus, searchQuery, activeFilter, sortBy]);

  const mainMenus = filteredMenus.filter((menu) => !isSideMenu(menu));
  const sideMenus = filteredMenus.filter((menu) => isSideMenu(menu));

  const renderCards = (items: MenuItem[]) =>
    items.map((menu) => (
      <MenuCard
        key={menu.slug}
        menu={menu}
        isFavorite={favorites.includes(menu.name)}
        onToggleFavorite={onToggleFavorite}
        onOpenDetail={onOpenDetail}
        onAddChoice={onAddChoice}
        onAddToCart={onAddToCart}
      />
    ));

  return (
    <SectionContainer id="menu" className="menu-section">
      <SectionHeading
        label="PILIHAN NUSANTARA"
        title="Menu Gado-Gado"
        highlight="& Menu Sampingan"
        description="Jelajahi pilihan gado-gado, dessert, dan hidangan favorit khas Nusantara."
      />

      <div className="search-filter">
        <div className="search-box">
          <span>⌕</span>
          <input
            type="text"
            id="cariMenu"
            placeholder="Cari gado-gado, es cendol, kue putu..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />

          <button
            type="button"
            id="clearSearch"
            style={{
              display: searchQuery.length > 0 ? "block" : "none",
            }}
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

          <label className="sort-select">
            <span>Urutkan:</span>

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as SortOption)
              }
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {children}

      {mainMenus.length > 0 && (
        <>
          <div className="menu-group-heading">
            <div>
              <span className="menu-group-kicker">MENU UTAMA</span>
              <h3>Gado-Gado Nusantara</h3>
            </div>

            <small>{mainMenus.length} menu</small>
          </div>

          <div className="menu-container" id="menuContainer">
            {renderCards(mainMenus)}
          </div>
        </>
      )}

      {sideMenus.length > 0 && (
        <>
          <div className="menu-group-heading side">
            <div>
              <span className="menu-group-kicker">MENU SAMPINGAN</span>
              <h3>Minuman Tradisional, Kue &amp; Camilan</h3>
            </div>

            <small>{sideMenus.length} menu</small>
          </div>

          <div className="menu-container" id="sideMenuContainer">
            {renderCards(sideMenus)}
          </div>
        </>
      )}

      <div
        className="empty-search"
        id="emptySearch"
        style={{
          display: filteredMenus.length === 0 ? "block" : "none",
        }}
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
