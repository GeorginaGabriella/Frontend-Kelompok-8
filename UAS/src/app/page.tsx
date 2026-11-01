"use client";

import React, { useCallback, useEffect, useState } from "react";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import IntroSection from "@/components/IntroSection";
import MenuSection from "@/components/MenuSection";
import ChoiceSection from "@/components/ChoiceSection";
import FavoriteSection from "@/components/FavoriteSection";
import AboutSection from "@/components/AboutSection";
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
  const [currentUser, setCurrentUser] =
    useState<UserAccount | null>(null);

  const [selectedMenu, setSelectedMenu] =
    useState<MenuItem | null>(null);

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

  const getUsername = () =>
    currentUser?.username || "guest";

  const loadPersonalData = async (username: string) => {
    try {
      const [favResponse, choiceResponse] = await Promise.all([
        fetch(
          `/api/favorites?username=${encodeURIComponent(username)}`
        ),
        fetch(
          `/api/choices?username=${encodeURIComponent(username)}`
        ),
      ]);

      if (!favResponse.ok || !choiceResponse.ok) {
        throw new Error("Gagal mengambil data pengguna.");
      }

      const favData = await favResponse.json();
      const choiceData = await choiceResponse.json();

      setFavorites(favData.favorites || []);
      setChoices(choiceData.choices || []);
    } catch (error) {
      console.error(error);
      showToast("Gagal memuat data favorit dan pilihan.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          menuResponse,
          contentResponse,
          faqResponse,
          authResponse,
        ] = await Promise.all([
          fetch("/api/menus"),
          fetch("/api/content"),
          fetch("/api/faqs"),
          fetch("/api/auth"),
        ]);

        if (
          !menuResponse.ok ||
          !contentResponse.ok ||
          !faqResponse.ok ||
          !authResponse.ok
        ) {
          throw new Error("Gagal mengambil data database.");
        }

        const menuData = await menuResponse.json();
        const contentData = await contentResponse.json();
        const faqData = await faqResponse.json();
        const authData = await authResponse.json();

        setMenus(menuData.menus || initialMenus);
        setSiteContent(
          contentData.content || defaultSiteContent
        );
        setFaqs(
          (faqData.faqs || defaultFaqs).map(
            ({ question, answer }: FaqItem) => ({
              question,
              answer,
            })
          )
        );
        setAccounts(authData.users || []);

        const savedUser = localStorage.getItem(
          "gadoGadoCurrentUser"
        );

        if (savedUser) {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
          await loadPersonalData(user.username);
        } else {
          await loadPersonalData("guest");
        }
      } catch (error) {
        console.error(error);
        showToast("Gagal menghubungkan ke database SQLite.");
      }
    };

    loadData();
  }, [showToast]);

  useEffect(() => {
    if (!toastVisible) return;

    const timer = setTimeout(() => {
      setToastVisible(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, [toastVisible]);

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

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
  }, [
    selectedMenu,
    authModalOpen,
    profileModalOpen,
    adminModalOpen,
  ]);

  const handleToggleFavorite = async (name: string) => {
    try {
      const exists = favorites.includes(name);

      const response = await fetch("/api/favorites", {
        method: exists ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: getUsername(),
          menu_name: name,
        }),
      });

      if (!response.ok) throw new Error();

      const next = exists
        ? favorites.filter((item) => item !== name)
        : [...favorites, name];

      setFavorites(next);

      showToast(
        exists
          ? `${name} dihapus dari favorit.`
          : `${name} ditambahkan ke favorit.`
      );
    } catch {
      showToast("Gagal memperbarui favorit.");
    }
  };

  const handleRemoveFavorite = async (name: string) => {
    try {
      const response = await fetch("/api/favorites", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: getUsername(),
          menu_name: name,
        }),
      });

      if (!response.ok) throw new Error();

      setFavorites((prev) =>
        prev.filter((item) => item !== name)
      );

      showToast(`${name} dihapus dari favorit.`);
    } catch {
      showToast("Gagal menghapus favorit.");
    }
  };

  const handleAddChoice = async (name: string) => {
    if (choices.includes(name)) {
      showToast(`${name} sudah ada di Pilihan Saya.`);
      return;
    }

    try {
      const response = await fetch("/api/choices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: getUsername(),
          menu_name: name,
        }),
      });

      if (!response.ok) throw new Error();

      setChoices((prev) => [...prev, name]);
      showToast(`${name} ditambahkan ke Pilihan Saya.`);

      document.getElementById("pilihan")?.scrollIntoView({
        behavior: "smooth",
      });
    } catch {
      showToast("Gagal menambahkan pilihan.");
    }
  };

  const handleRemoveChoice = async (name: string) => {
    try {
      const response = await fetch("/api/choices", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: getUsername(),
          menu_name: name,
        }),
      });

      if (!response.ok) throw new Error();

      setChoices((prev) =>
        prev.filter((item) => item !== name)
      );

      showToast(`${name} berhasil dihapus.`);
    } catch {
      showToast("Gagal menghapus pilihan.");
    }
  };

  const handleProfileButtonClick = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
    } else {
      setProfileModalOpen(true);
    }
  };

  const handleRegisterAccount = async (newUser: UserAccount) => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "register",
          name: newUser.name,
          username: newUser.username,
          password: newUser.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.error || "Register gagal.");
        return;
      }

      const accountsResponse = await fetch("/api/auth");
      const accountsData = await accountsResponse.json();

      setAccounts(accountsData.users || []);
      showToast("Register berhasil.");
    } catch {
      showToast("Gagal menghubungkan ke database.");
    }
  };

  const handleLoginSuccess = (user: UserAccount) => {
    const sessionUser: UserAccount = {
      name: user.name,
      username: user.username,
      role: user.role,
    };

    setCurrentUser(sessionUser);

    localStorage.setItem(
      "gadoGadoCurrentUser",
      JSON.stringify(sessionUser)
    );

    loadPersonalData(sessionUser.username);
  };

  const handleLogout = () => {
    localStorage.removeItem("gadoGadoCurrentUser");

    setCurrentUser(null);
    setFavorites([]);
    setChoices([]);

    loadPersonalData("guest");

    showToast("Berhasil logout.");
  };

  const handleOpenAdmin = () => {
    if (!currentUser || currentUser.role !== "admin") {
      showToast("Akses hanya untuk Admin.");
      return;
    }

    setAdminModalOpen(true);
  };

  const handleSaveSiteContent = async (
    newContent: SiteContent
  ) => {
    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContent),
      });

      if (!response.ok) throw new Error();

      setSiteContent(newContent);
      showToast("Konten berhasil diperbarui.");
    } catch {
      showToast("Gagal menyimpan konten.");
    }
  };

  const handleSaveMenu = async (
    name: string,
    updated: Partial<MenuItem>
  ) => {
    try {
      const response = await fetch("/api/menus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, updated }),
      });

      if (!response.ok) throw new Error();

      setMenus((prev) =>
        prev.map((item) =>
          item.name === name ? { ...item, ...updated } : item
        )
      );

      showToast("Menu berhasil diperbarui.");
    } catch {
      showToast("Gagal menyimpan menu.");
    }
  };

  const handleAddFaq = async (faq: FaqItem) => {
    try {
      const response = await fetch("/api/faqs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(faq),
      });

      if (!response.ok) throw new Error();

      setFaqs((prev) => [...prev, faq]);
      showToast("FAQ berhasil ditambahkan.");
    } catch {
      showToast("Gagal menambahkan FAQ.");
    }
  };

  const handleRemoveFaq = async (index: number) => {
    const faq = faqs[index];

    if (!faq) return;

    try {
      const response = await fetch("/api/faqs", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: faq.question,
        }),
      });

      if (!response.ok) throw new Error();

      setFaqs((prev) =>
        prev.filter((_, idx) => idx !== index)
      );

      showToast("FAQ berhasil dihapus.");
    } catch {
      showToast("Gagal menghapus FAQ.");
    }
  };

  const handleClearChoices = async () => {
    try {
      const response = await fetch("/api/choices", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: getUsername(),
        }),
      });

      if (!response.ok) throw new Error();

      setChoices([]);
      showToast("Pilihan Saya berhasil dikosongkan.");
    } catch {
      showToast("Gagal menghapus pilihan.");
    }
  };

  const handleClearFavorites = async () => {
    try {
      const response = await fetch("/api/favorites", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: getUsername(),
        }),
      });

      if (!response.ok) throw new Error();

      setFavorites([]);
      showToast("Favorit Saya berhasil dikosongkan.");
    } catch {
      showToast("Gagal menghapus favorit.");
    }
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
        <HeroSection
          heroDescription={siteContent.heroDescription}
        />

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

        <AboutSection
          aboutDescription={siteContent.aboutDescription}
        />

        <FaqSection faqs={faqs} />
      </main>

      <Footer
        currentUser={currentUser}
        onOpenAdmin={handleOpenAdmin}
      />

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

      <Toast
        message={toastMessage}
        visible={toastVisible}
      />
    </>
  );
}
