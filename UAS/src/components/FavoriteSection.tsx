import React from "react";
import SectionContainer from "./SectionContainer";
import SectionHeading from "./SectionHeading";
import { MenuItem } from "@/types";

interface FavoriteSectionProps {
  favorites: string[];
  menus: MenuItem[];
  onRemoveFavorite: (name: string) => void;
  children?: React.ReactNode;
}

/**
 * Komponen Fungsional FavoriteSection (Poin 10 & Poin 11: Functional Component, Props & Children)
 */
export default function FavoriteSection({
  favorites,
  menus,
  onRemoveFavorite,
  children,
}: FavoriteSectionProps) {
  const favoriteMenus = favorites
    .map((name) => menus.find((item) => item.name === name))
    .filter((item): item is MenuItem => Boolean(item));

  return (
    <SectionContainer id="favorit" className="favorite-section">
      <SectionHeading
        label="MENU FAVORIT"
        title="Yang Kamu Tandai ❤️"
        description="Simpan gado-gado yang menarik perhatianmu dengan menekan ikon hati."
      />

      <div className="favorite-box" id="favoriteBox">
        {favoriteMenus.length === 0 ? (
          <div className="empty-favorite" id="emptyFavorite">
            <div>♡</div>
            <h3>Belum ada favorit</h3>
            <p>Tekan ikon hati pada menu yang ingin kamu tandai.</p>
          </div>
        ) : (
          <div className="favorite-list" id="favoriteList">
            {favoriteMenus.map((menu) => (
              <div className="favorite-item" key={menu.name}>
                <img src={menu.image} alt={menu.name} />
                <button
                  type="button"
                  className="remove-favorite"
                  data-name={menu.name}
                  aria-label={`Hapus ${menu.name} dari favorit`}
                  onClick={() => onRemoveFavorite(menu.name)}
                >
                  ♥
                </button>
                <div className="favorite-item-content">
                  <small>{menu.region}</small>
                  <h4>{menu.name}</h4>
                </div>
              </div>
            ))}
          </div>
        )}
        {children}
      </div>
    </SectionContainer>
  );
}
