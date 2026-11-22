import React from "react";
import { formatRupiah, parsePriceLabel } from "@/lib/order";
import { MenuCardProps } from "@/types";

export default function MenuCard({
  menu,
  isFavorite,
  onToggleFavorite,
  onOpenDetail,
  onAddChoice,
  children,
}: MenuCardProps) {
  const displayedIngredients = menu.cardIngredients?.length
    ? menu.cardIngredients.slice(0, 3)
    : menu.ingredients.slice(0, 3);

  const unitPrice = parsePriceLabel(menu.price);

  return (
    <article
      className="menu-card"
      data-kategori={menu.kategori}
      data-group={menu.group}
      data-name={menu.searchName}
    >
      <div className="card-image">
        <img src={menu.image} alt={menu.name} />

        <span className="region-badge">{menu.regionBadge}</span>

        <button
          type="button"
          className={`favorite-button ${
            isFavorite ? "active" : ""
          }`.trim()}
          data-name={menu.name}
          aria-label={`Tandai ${menu.name} sebagai favorit`}
          onClick={() => onToggleFavorite(menu.name)}
        >
          {isFavorite ? "♥" : "♡"}
        </button>
      </div>

      <div className="card-content">
        <div className="card-top">
          <span className="category">{menu.categoryLabel}</span>
          <span className="rating">★ {menu.rating}</span>
        </div>

        <h3>{menu.name}</h3>

        <p>{menu.shortDescription || menu.description}</p>

        <div className="ingredients">
          {displayedIngredients.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <div className="card-price">
          <strong>{formatRupiah(unitPrice)}</strong>
          <small>/ porsi</small>
        </div>

        {children}

        <div className="card-actions">
          <button
            type="button"
            className="detail-button"
            onClick={() => onOpenDetail(menu)}
          >
            Detail
          </button>

          <button
            type="button"
            className="add-button"
            data-name={menu.name}
            onClick={() => onAddChoice(menu.name)}
          >
            Pilihan
          </button>
        </div>
      </div>
    </article>
  );
}
