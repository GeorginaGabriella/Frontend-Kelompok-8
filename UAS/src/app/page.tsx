"use client";

import React, { useCallback, useEffect, useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import IntroSection from "@/components/IntroSection";
import MenuSection from "@/components/MenuSection";
import ChoiceSection from "@/components/ChoiceSection";
import FavoriteSection from "@/components/FavoriteSection";
import AboutSection from "@/components/AboutSection";
import WeatherSection from "@/components/WeatherSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import DetailModal from "@/components/DetailModal";
import AuthModal from "@/components/AuthModal";
import ProfileModal from "@/components/ProfileModal";
import AdminModal from "@/components/AdminModal";
import Toast from "@/components/Toast";
import {
  defaultFaqs,
  defaultSiteContent,
  initialMenus,
} from "@/data/gadoGadoData";
import {
  FaqItem,
  MenuItem,
  SavedAdminData,
  SiteContent,
  UserAccount,
} from "@/types";

export default function HomePage() {
  const [menus, setMenus] = useState<MenuItem[]>(initialMenus);
  const [siteContent, setSiteContent] =
    useState<SiteContent>(defaultSiteContent);
  const [faqs, setFaqs] = useState<FaqItem[]>(defaultFaqs);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [choices, setChoices] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  const [activeSection, setActiveSection] = useState("home");
  const [toastMessage, setToastMessage] = useState(
    "Menu berhasil ditambahkan."
  );
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  }, []);

  useEffect(() => {
    if (!toastVisible) return;
    const timer = setTimeout(() => {
      setToastVisible(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, [toastVisible]);

  // Load saved data from localStorage on mount
  useEffect(() => {
    try {
      const savedFavs = JSON.parse(
        localStorage.getItem("gadoGadoFavorites") || "[]"
      );
      if (Array.isArray(savedFavs)) setFavorites(savedFavs);

      const savedChoices = JSON.parse(
        localStorage.getItem("gadoGadoChoices") || "[]"
      );
      if (Array.isArray(savedChoices)) setChoices(savedChoices);

      const savedAccounts = JSON.parse(
        localStorage.getItem("gadoGadoAccounts") || "[]"
      );
      if (Array.isArray(savedAccounts)) setAccounts(savedAccounts);

      const savedUser = JSON.parse(
        localStorage.getItem("gadoGadoCurrentUser") || "null"
      );
      if (savedUser && savedUser.username) setCurrentUser(savedUser);

      const savedAdmin: SavedAdminData = JSON.parse(
        localStorage.getItem("gadoGadoAdminData") || "{}"
      );

      if (savedAdmin.menus) {
        setMenus((prevMenus) =>
          prevMenus.map((item) =>
            savedAdmin.menus && savedAdmin.menus[item.name]
              ? { ...item, ...savedAdmin.menus[item.name] }
              : item
          )
        );
      }

      if (savedAdmin.content) {
        setSiteContent((prev) => ({ ...prev, ...savedAdmin.content }));
      }

      if (Array.isArray(savedAdmin.faqs)) {
        setFaqs(savedAdmin.faqs);
      }
    } catch {
      // Ignore storage parse errors
    }
  }, []);

  // Scroll spy for active nav link
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const sections = document.querySelectorAll("section[id]");
      sections.forEach((section) => {
        const el = section as HTMLElement;
        const top = el.offsetTop - 130;
        const bottom = top + el.offsetHeight;
        const id = el.getAttribute("id");
        if (id && scrollY >= top && scrollY < bottom) {
          setActiveSection(id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when any modal is open
  useEffect(() => {
    const anyModalOpen =
      Boolean(selectedMenu) ||
      authModalOpen ||
      profileModalOpen ||
      adminModalOpen;
    document.body.style.overflow = anyModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedMenu, authModalOpen, profileModalOpen, adminModalOpen]);

  const persistAdminState = (
    updatedMenus: MenuItem[],
    updatedContent: SiteContent,
    updatedFaqs: FaqItem[]
  ) => {
    const menuRecord: Record<string, MenuItem> = {};
    updatedMenus.forEach((m) => {
      menuRecord[m.name] = m;
    });
    localStorage.setItem(
      "gadoGadoAdminData",
      JSON.stringify({
        menus: menuRecord,
        content: updatedContent,
        faqs: updatedFaqs,
      })
    );
  };

  const handleToggleFavorite = (name: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(name);
      const next = exists
        ? prev.filter((item) => item !== name)
        : [...prev, name];
      localStorage.setItem("gadoGadoFavorites", JSON.stringify(next));
      showToast(
        exists
          ? `${name} dihapus dari favorit.`
          : `${name} ditambahkan ke favorit.`
      );
      return next;
    });
  };

  const handleRemoveFavorite = (name: string) => {
    setFavorites((prev) => {
      const next = prev.filter((item) => item !== name);
      localStorage.setItem("gadoGadoFavorites", JSON.stringify(next));
      showToast(`${name} dihapus dari favorit.`);
      return next;
    });
  };

  const handleAddChoice = (name: string) => {
    if (choices.includes(name)) {
      showToast(`${name} sudah ada di Pilihan Saya.`);
      return;
    }
    const next = [...choices, name];
    setChoices(next);
    localStorage.setItem("gadoGadoChoices", JSON.stringify(next));
    showToast(`${name} ditambahkan ke Pilihan Saya.`);

    const pilihanSection = document.getElementById("pilihan");
    if (pilihanSection) {
      pilihanSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRemoveChoice = (name: string) => {
    const next = choices.filter((item) => item !== name);
    setChoices(next);
    localStorage.setItem("gadoGadoChoices", JSON.stringify(next));
    showToast(`${name} berhasil dihapus.`);
  };

  const handleProfileButtonClick = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
    } else {
      setProfileModalOpen(true);
    }
  };

  const handleRegisterAccount = (newUser: UserAccount) => {
    const next = [...accounts, newUser];
    setAccounts(next);
    localStorage.setItem("gadoGadoAccounts", JSON.stringify(next));
  };

  const handleLoginSuccess = (user: UserAccount) => {
    const sessionUser: UserAccount = {
      name: user.name,
      username: user.username,
      role: user.role,
    };
    setCurrentUser(sessionUser);
    localStorage.setItem("gadoGadoCurrentUser", JSON.stringify(sessionUser));
  };

  const handleLogout = () => {
    localStorage.removeItem("gadoGadoCurrentUser");
    setCurrentUser(null);
    showToast("Berhasil logout.");
  };

  const handleOpenAdmin = () => {
    if (!currentUser || currentUser.role !== "admin") {
      showToast("Akses hanya untuk Admin.");
      return;
    }
    setAdminModalOpen(true);
  };

  const handleSaveSiteContent = (newContent: SiteContent) => {
    setSiteContent(newContent);
    persistAdminState(menus, newContent, faqs);
  };

  const handleSaveMenu = (name: string, updated: Partial<MenuItem>) => {
    const nextMenus = menus.map((item) =>
      item.name === name ? { ...item, ...updated } : item
    );
    setMenus(nextMenus);
    persistAdminState(nextMenus, siteContent, faqs);
  };

  const handleAddFaq = (faq: FaqItem) => {
    const nextFaqs = [...faqs, faq];
    setFaqs(nextFaqs);
    persistAdminState(menus, siteContent, nextFaqs);
  };

  const handleRemoveFaq = (index: number) => {
    const nextFaqs = faqs.filter((_, idx) => idx !== index);
    setFaqs(nextFaqs);
    persistAdminState(menus, siteContent, nextFaqs);
  };

  const handleClearChoices = () => {
    setChoices([]);
    localStorage.setItem("gadoGadoChoices", JSON.stringify([]));
    showToast("Pilihan Saya berhasil dikosongkan.");
  };

  const handleClearFavorites = () => {
    setFavorites([]);
    localStorage.setItem("gadoGadoFavorites", JSON.stringify([]));
    showToast("Favorit Saya berhasil dikosongkan.");
  };

  return (
    <>
      <Header
        activeSection={activeSection}
        favoriteCount={favorites.length}
        currentUser={currentUser}
        onProfileClick={handleProfileButtonClick}
      />

      <main>
        <HeroSection heroDescription={siteContent.heroDescription} />
        <IntroSection />
        <MenuSection
          menus={menus}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onOpenDetail={(menu) => setSelectedMenu(menu)}
          onAddChoice={handleAddChoice}
        />
        <ChoiceSection
          choices={choices}
          onRemoveChoice={handleRemoveChoice}
        />
        <FavoriteSection
          favorites={favorites}
          menus={menus}
          onRemoveFavorite={handleRemoveFavorite}
        />
        <AboutSection aboutDescription={siteContent.aboutDescription} />
        <WeatherSection defaultCity="Jakarta" />
        <FaqSection faqs={faqs} />
      </main>

      <Footer currentUser={currentUser} onOpenAdmin={handleOpenAdmin} />

      <DetailModal
        menu={selectedMenu}
        onClose={() => setSelectedMenu(null)}
        onAddChoice={handleAddChoice}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        accounts={accounts}
        onRegisterAccount={handleRegisterAccount}
        onLoginSuccess={handleLoginSuccess}
        onShowToast={showToast}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={currentUser}
        favoriteCount={favorites.length}
        choiceCount={choices.length}
        onLogout={handleLogout}
      />

      <AdminModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        menus={menus}
        choices={choices}
        favorites={favorites}
        siteContent={siteContent}
        faqs={faqs}
        onSaveSiteContent={handleSaveSiteContent}
        onSaveMenu={handleSaveMenu}
        onAddFaq={handleAddFaq}
        onRemoveFaq={handleRemoveFaq}
        onClearChoices={handleClearChoices}
        onClearFavorites={handleClearFavorites}
        onShowToast={showToast}
      />

      <Toast message={toastMessage} visible={toastVisible} />
    </>
  );
}
