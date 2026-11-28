"use client";

import { useCallback, useEffect, useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PromoBanner from "@/components/PromoBanner";
import IntroSection from "@/components/IntroSection";
import MenuSection from "@/components/MenuSection";
import HistorySection from "@/components/HistorySection";
import FavoriteSection from "@/components/FavoriteSection";
import AboutSection from "@/components/AboutSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import DetailModal from "@/components/DetailModal";
import AuthModal from "@/components/AuthModal";
import Toast from "@/components/Toast";
import CustomerServiceSection from "@/components/CustomerServiceSection";
import {
  defaultFaqs,
  defaultSiteContent,
  initialMenus,
} from "@/data/gadoGadoData";
import type { FaqItem, MenuItem, SiteContent } from "@/types";

export default function HomePage() {
  const [menus] = useState<MenuItem[]>(initialMenus);
  const [siteContent] = useState<SiteContent>(defaultSiteContent);
  const [faqs] = useState<FaqItem[]>(defaultFaqs);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  }, []);

  useEffect(() => {
    if (!toastVisible) return;

    const timer = window.setTimeout(() => {
      setToastVisible(false);
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [toastVisible]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      document.querySelectorAll("section[id]").forEach((section) => {
        const element = section as HTMLElement;
        const top = element.offsetTop - 130;
        const id = element.getAttribute("id");

        if (
          id &&
          scrollY >= top &&
          scrollY < top + element.offsetHeight
        ) {
          setActiveSection(id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      selectedMenu || authModalOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedMenu, authModalOpen]);

  const handleToggleFavorite = (name: string) => {
    const exists = favorites.includes(name);

    setFavorites((items) =>
      exists
        ? items.filter((item) => item !== name)
        : [...items, name]
    );

    showToast(
      exists
        ? `${name} dihapus dari favorit.`
        : `${name} ditambahkan ke favorit.`
    );
  };

  const handleAddFavorite = (name: string) => {
    if (favorites.includes(name)) {
      showToast(`${name} sudah ada di favorit.`);
      return;
    }

    setFavorites((items) => [...items, name]);
    showToast(`${name} berhasil ditambahkan ke favorit.`);
  };

  const handleRemoveFavorite = (name: string) => {
    setFavorites((items) => items.filter((item) => item !== name));
    showToast(`${name} dihapus dari favorit.`);
  };

  return (
    <>
      <Header
        activeSection={activeSection}
        favoriteCount={favorites.length}
        currentUser={null}
        onProfileClick={() => setAuthModalOpen(true)}
      />

      <main>
        <HeroSection heroDescription={siteContent.heroDescription} />

        <HistorySection />

        <IntroSection />

        <MenuSection
          menus={menus}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onOpenDetail={(menu) => setSelectedMenu(menu)}
          onAddFavorite={handleAddFavorite}
        />

        <PromoBanner
          menus={menus}
          onOpenDetail={(menu) => setSelectedMenu(menu)}
        />

        <FavoriteSection
          favorites={favorites}
          menus={menus}
          onRemoveFavorite={handleRemoveFavorite}
        />

        <AboutSection aboutDescription={siteContent.aboutDescription} />

        <CustomerServiceSection />

        <FaqSection faqs={faqs} />
      </main>

      <Footer />

      <DetailModal
        menu={selectedMenu}
        onClose={() => setSelectedMenu(null)}
        onAddFavorite={handleAddFavorite}
        isFavorite={
          selectedMenu
            ? favorites.includes(selectedMenu.name)
            : false
        }
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        accounts={[]}
        onRegisterAccount={() => {
          showToast("Register belum tersedia pada Versi 1.");
        }}
        onLoginSuccess={() => {
          showToast("Login belum tersedia pada Versi 1.");
        }}
        onShowToast={showToast}
      />

      <Toast message={toastMessage} visible={toastVisible} />
    </>
  );
}