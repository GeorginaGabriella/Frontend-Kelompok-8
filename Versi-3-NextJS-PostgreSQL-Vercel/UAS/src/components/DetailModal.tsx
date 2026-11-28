"use client";

import React from "react";
import Link from "next/link";
import ModalWrapper from "./ModalWrapper";
import Button from "./Button";
import MenuComments from "./MenuComments";
import { MenuItem } from "@/types";

interface DetailModalProps {
  menu: MenuItem | null;
  onClose: () => void;
  onAddFavorite: (name: string) => void;
  isFavorite: boolean;
  children?: React.ReactNode;
}

export default function DetailModal({
  menu,
  onClose,
  onAddFavorite,
  isFavorite,
  children,
}: DetailModalProps) {
  const googleMapsUrl = menu
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `penjual ${menu.name} ${menu.location}`
      )}`
    : "#";

  return (
    <ModalWrapper
      isOpen={Boolean(menu)}
      onClose={onClose}
      modalClassName="detail-modal"
      ariaLabelledBy="modalTitle"
    >
      <button
        type="button"
        className="modal-close"
        id="detailClose"
        onClick={onClose}
        aria-label="Tutup modal detail"
      >
        ×
      </button>

      {menu && (
        <>
          <div className="modal-image">
            <img id="modalImage" src={menu.image} alt={menu.name} />
          </div>

          <div className="modal-content">
            <span className="modal-region" id="modalRegion">
              {menu.region}
            </span>

            <h2 id="modalTitle">{menu.name}</h2>

            <div className="modal-rating">
              <span>★★★★★</span>
              <strong id="modalRating">{menu.rating}</strong>
            </div>

            <p id="modalDescription">{menu.description}</p>

            <div className="modal-ingredients">
              <h4>Komponen Menu</h4>
              <div id="modalIngredients">
                {menu.ingredients.map((ingredient) => (
                  <span key={ingredient}>{ingredient}</span>
                ))}
              </div>
            </div>

            <div className="modal-facts">
              <div>
                <span>Informasi Harga</span>
                <strong id="modalPrice">{menu.price}</strong>
                <small>Harga yang tercantum merupakan informasi menu.</small>
              </div>

              <div>
                <span>Kondimen</span>
                <p id="modalCondiments">{menu.condiments}</p>
              </div>

              <div>
                <span>Manfaat Makanan</span>
                <p id="modalBenefits">{menu.benefits}</p>
                <small>Informasi umum bahan, bukan klaim medis.</small>
              </div>

              <div>
                <span>Area penjual</span>
                <p id="modalLocation">{menu.location}</p>
                <a
                  className="map-link"
                  id="modalLocationLink"
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cari di Google Maps →
                </a>
              </div>
            </div>

            {children}

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Button
                variant="secondary"
                className="modal-add"
                onClick={() => {
                  if (!isFavorite) {
                    onAddFavorite(menu.name);
                  }
                }}
              >
                {isFavorite ? "♥ Sudah di Favorit" : "+ Tambahkan ke Favorit"}
              </Button>

              <Link
                href={`/menu/${menu.slug}`}
                className="secondary-button"
                onClick={onClose}
              >
                Halaman Detail Penuh →
              </Link>
            </div>

            <MenuComments
              key={menu.slug}
              menuSlug={menu.slug}
              menuName={menu.name}
            />
          </div>
        </>
      )}
    </ModalWrapper>
  );
}
