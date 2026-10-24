"use client";

import React, { useEffect, useState } from "react";
import ModalWrapper from "./ModalWrapper";
import { FaqItem, MenuItem, SiteContent } from "@/types";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  menus: MenuItem[];
  choices: string[];
  favorites: string[];
  siteContent: SiteContent;
  faqs: FaqItem[];
  onSaveSiteContent: (content: SiteContent) => void;
  onSaveMenu: (name: string, updated: Partial<MenuItem>) => void;
  onAddFaq: (faq: FaqItem) => void;
  onRemoveFaq: (index: number) => void;
  onClearChoices: () => void;
  onClearFavorites: () => void;
  onShowToast: (message: string) => void;
  children?: React.ReactNode;
}

/**
 * Komponen Fungsional AdminModal (Poin 10 & Poin 11: Functional Component, Props & Children)
 */
export default function AdminModal({
  isOpen,
  onClose,
  menus,
  choices,
  favorites,
  siteContent,
  faqs,
  onSaveSiteContent,
  onSaveMenu,
  onAddFaq,
  onRemoveFaq,
  onClearChoices,
  onClearFavorites,
  onShowToast,
  children,
}: AdminModalProps) {
  const [heroDescription, setHeroDescription] = useState(
    siteContent.heroDescription
  );
  const [aboutDescription, setAboutDescription] = useState(
    siteContent.aboutDescription
  );

  const [selectedMenuName, setSelectedMenuName] = useState(
    menus[0]?.name || ""
  );
  const [menuDescription, setMenuDescription] = useState("");
  const [menuPrice, setMenuPrice] = useState("");
  const [menuLocation, setMenuLocation] = useState("");
  const [menuIngredients, setMenuIngredients] = useState("");
  const [menuCondiments, setMenuCondiments] = useState("");
  const [menuBenefits, setMenuBenefits] = useState("");

  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");

  useEffect(() => {
    setHeroDescription(siteContent.heroDescription);
    setAboutDescription(siteContent.aboutDescription);
  }, [siteContent]);

  useEffect(() => {
    const current = menus.find((item) => item.name === selectedMenuName);
    if (current) {
      setMenuDescription(current.description);
      setMenuPrice(current.price);
      setMenuLocation(current.location);
      setMenuIngredients(current.ingredients.join(", "));
      setMenuCondiments(current.condiments);
      setMenuBenefits(current.benefits);
    }
  }, [selectedMenuName, menus]);

  const handleSaveContent = () => {
    onSaveSiteContent({
      heroDescription: heroDescription.trim(),
      aboutDescription: aboutDescription.trim(),
    });
    onShowToast("Konten utama berhasil disimpan.");
  };

  const handleSaveMenuInfo = () => {
    if (!selectedMenuName) return;
    onSaveMenu(selectedMenuName, {
      description: menuDescription.trim(),
      price: menuPrice.trim(),
      location: menuLocation.trim(),
      ingredients: menuIngredients
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      condiments: menuCondiments.trim(),
      benefits: menuBenefits.trim(),
    });
    onShowToast("Informasi menu berhasil disimpan.");
  };

  const handleAddFaqItem = () => {
    const question = faqQuestion.trim();
    const answer = faqAnswer.trim();
    if (!question || !answer) {
      onShowToast("Isi pertanyaan dan jawaban FAQ terlebih dahulu.");
      return;
    }
    onAddFaq({ question, answer });
    setFaqQuestion("");
    setFaqAnswer("");
    onShowToast("FAQ berhasil ditambahkan.");
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      overlayClassName="admin-overlay"
      modalClassName="admin-modal"
      ariaLabelledBy="adminTitle"
    >
      <button
        className="modal-close"
        id="adminClose"
        type="button"
        aria-label="Tutup panel admin"
        onClick={onClose}
      >
        ×
      </button>

      <header className="admin-header">
        <p className="section-label">PENGELOLAAN WEBSITE</p>
        <h2 id="adminTitle">Admin Konten</h2>
        <p>
          Kelola katalog dan pantau data pengunjung yang tersimpan di browser
          ini.
        </p>
        <small>
          Mode demo frontend Next.js: perubahan tersimpan secara persisten di
          localStorage browser.
        </small>
      </header>

      <section className="admin-dashboard" aria-label="Ringkasan data">
        <div className="admin-stat-row">
          <div className="admin-stat">
            <span>Menu tersedia</span>
            <strong id="adminMenuCount">{menus.length}</strong>
          </div>
          <div className="admin-stat">
            <span>Pilihan Saya</span>
            <strong id="adminChoiceCount">{choices.length}</strong>
          </div>
          <div className="admin-stat">
            <span>Favorit Saya</span>
            <strong id="adminFavoriteCount">{favorites.length}</strong>
          </div>
        </div>

        <div className="admin-data-grid">
          <div className="admin-data-panel">
            <div className="admin-data-heading">
              <h3>Katalog menu</h3>
              <span>Data menu</span>
            </div>
            <ul id="adminMenuList">
              {menus.map((item) => (
                <li key={item.name}>{item.name}</li>
              ))}
            </ul>
          </div>

          <div className="admin-data-panel">
            <div className="admin-data-heading">
              <h3>Pilihan Saya</h3>
              <button
                id="adminClearChoices"
                type="button"
                onClick={onClearChoices}
              >
                Kosongkan
              </button>
            </div>
            {choices.length === 0 ? (
              <p className="admin-empty-state" id="adminEmptyChoices">
                Belum ada menu pilihan tersimpan.
              </p>
            ) : (
              <ul id="adminChoiceList">
                {choices.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="admin-data-panel">
            <div className="admin-data-heading">
              <h3>Favorit Saya</h3>
              <button
                id="adminClearFavorites"
                type="button"
                onClick={onClearFavorites}
              >
                Kosongkan
              </button>
            </div>
            {favorites.length === 0 ? (
              <p className="admin-empty-state" id="adminEmptyFavorites">
                Belum ada menu favorit tersimpan.
              </p>
            ) : (
              <ul id="adminFavoriteList">
                {favorites.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <div className="admin-grid">
        <form
          className="admin-panel"
          onSubmit={(event) => event.preventDefault()}
        >
          <h3>Konten utama</h3>
          <label htmlFor="adminHeroDescription">Deskripsi halaman depan</label>
          <textarea
            id="adminHeroDescription"
            rows={3}
            value={heroDescription}
            onChange={(event) => setHeroDescription(event.target.value)}
          />
          <label htmlFor="adminAboutDescription">
            Tentang Gado-Gado Nusantara
          </label>
          <textarea
            id="adminAboutDescription"
            rows={4}
            value={aboutDescription}
            onChange={(event) => setAboutDescription(event.target.value)}
          />
          <button
            className="primary-button admin-save"
            id="adminSaveContent"
            type="button"
            onClick={handleSaveContent}
          >
            Simpan konten
          </button>
        </form>

        <form
          className="admin-panel"
          onSubmit={(event) => event.preventDefault()}
        >
          <h3>Informasi menu</h3>
          <label htmlFor="adminMenuSelect">Pilih variasi</label>
          <select
            id="adminMenuSelect"
            value={selectedMenuName}
            onChange={(event) => setSelectedMenuName(event.target.value)}
          >
            {menus.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>

          <label htmlFor="adminMenuDescription">Deskripsi</label>
          <textarea
            id="adminMenuDescription"
            rows={3}
            value={menuDescription}
            onChange={(event) => setMenuDescription(event.target.value)}
          />

          <div className="admin-fields-two">
            <div>
              <label htmlFor="adminMenuPrice">Kisaran harga</label>
              <input
                id="adminMenuPrice"
                type="text"
                value={menuPrice}
                onChange={(event) => setMenuPrice(event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="adminMenuLocation">Area penjual</label>
              <input
                id="adminMenuLocation"
                type="text"
                value={menuLocation}
                onChange={(event) => setMenuLocation(event.target.value)}
              />
            </div>
          </div>

          <label htmlFor="adminMenuIngredients">
            Komponen (pisahkan dengan koma)
          </label>
          <input
            id="adminMenuIngredients"
            type="text"
            value={menuIngredients}
            onChange={(event) => setMenuIngredients(event.target.value)}
          />

          <label htmlFor="adminMenuCondiments">Kondimen</label>
          <textarea
            id="adminMenuCondiments"
            rows={2}
            value={menuCondiments}
            onChange={(event) => setMenuCondiments(event.target.value)}
          />

          <label htmlFor="adminMenuBenefits">Manfaat bahan</label>
          <textarea
            id="adminMenuBenefits"
            rows={2}
            value={menuBenefits}
            onChange={(event) => setMenuBenefits(event.target.value)}
          />

          <button
            className="primary-button admin-save"
            id="adminSaveMenu"
            type="button"
            onClick={handleSaveMenuInfo}
          >
            Simpan informasi menu
          </button>
        </form>

        <div className="admin-panel admin-faq-panel">
          <h3>FAQ</h3>
          <label htmlFor="adminFaqQuestion">Pertanyaan baru</label>
          <input
            id="adminFaqQuestion"
            type="text"
            placeholder="Tulis pertanyaan"
            value={faqQuestion}
            onChange={(event) => setFaqQuestion(event.target.value)}
          />
          <label htmlFor="adminFaqAnswer">Jawaban</label>
          <textarea
            id="adminFaqAnswer"
            rows={3}
            placeholder="Tulis jawaban"
            value={faqAnswer}
            onChange={(event) => setFaqAnswer(event.target.value)}
          />
          <button
            className="secondary-button admin-save"
            id="adminAddFaq"
            type="button"
            onClick={handleAddFaqItem}
          >
            ＋ Tambah FAQ
          </button>

          <div id="adminFaqList">
            {faqs.map((faq, index) => (
              <div className="admin-faq-row" key={`${faq.question}-${index}`}>
                <span>{faq.question}</span>
                <button
                  type="button"
                  aria-label="Hapus FAQ"
                  onClick={() => {
                    onRemoveFaq(index);
                    onShowToast("FAQ berhasil dihapus.");
                  }}
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {children}
    </ModalWrapper>
  );
}
