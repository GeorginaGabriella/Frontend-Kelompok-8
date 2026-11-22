
"use client";

import { useCallback, useEffect, useState } from "react";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PromoBanner from "@/components/PromoBanner";
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
import Toast from "@/components/Toast";
import CustomerServiceSection from "@/components/CustomerServiceSection";

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

  const [activeSection, setActiveSection] = useState("home");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  }, []);

  // MEMUAT DATA PERSONAL
  const loadPersonalData = useCallback(
    async (username: string) => {
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
          throw new Error("Gagal mengambil data personal.");
        }

        const favData = await favResponse.json();
        const choiceData = await choiceResponse.json();

        setFavorites(favData.favorites || []);
        setChoices(choiceData.choices || []);
      } catch (error) {
        console.error(error);
        showToast("Gagal memuat data favorit dan pilihan.");
      }
    },
    [showToast]
  );

  // MEMUAT DATA UTAMA
  const loadMainData = useCallback(async () => {
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
      setSiteContent(contentData.content || defaultSiteContent);

      setFaqs(
        (faqData.faqs || defaultFaqs).map(
          ({ question, answer }: FaqItem) => ({
            question,
            answer,
          })
        )
      );

      setAccounts(authData.users || []);

      // Status login dipulihkan secara terpisah dari localStorage.\n      // Kegagalan mengambil data website tidak boleh menghapus sesi login.
    } catch (error) {
      console.error(error);
      showToast("Gagal menghubungkan ke database.");
    }
  }, [loadPersonalData, showToast]);

  // PULIHKAN SESI LOGIN SAAT WEBSITE DIBUKA / DI-REFRESH.
  // Sesi hanya dihapus oleh tombol Logout, kecuali data sesi memang rusak.
  useEffect(() => {
    const savedUser = localStorage.getItem("gadoGadoCurrentUser");

    if (!savedUser) {
      setCurrentUser(null);
      void loadPersonalData("guest");
      return;
    }

    try {
      const parsedUser: UserAccount = JSON.parse(savedUser);

      if (!parsedUser.username || !parsedUser.role) {
        throw new Error("Data sesi login tidak lengkap.");
      }

      const sessionUser: UserAccount = {
        name: parsedUser.name || parsedUser.username,
        username: parsedUser.username,
        role: parsedUser.role,
      };

      setCurrentUser(sessionUser);
      void loadPersonalData(sessionUser.username);
    } catch (error) {
      console.error("Sesi login tidak valid:", error);
      localStorage.removeItem("gadoGadoCurrentUser");
      setCurrentUser(null);
      void loadPersonalData("guest");
    }
  }, [loadPersonalData]);

  useEffect(() => {
    loadMainData();
  }, [loadMainData]);

  // TOAST
  useEffect(() => {
    if (!toastVisible) return;

    const timer = setTimeout(() => {
      setToastVisible(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, [toastVisible]);

  // NAVIGASI AKTIF
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const sections = document.querySelectorAll("section[id]");

      sections.forEach((section) => {
        const element = section as HTMLElement;
        const top = element.offsetTop - 130;
        const bottom = top + element.offsetHeight;
        const id = element.getAttribute("id");

        if (id && scrollY >= top && scrollY < bottom) {
          setActiveSection(id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // MODAL
  useEffect(() => {
    const anyModalOpen =
      Boolean(selectedMenu) ||
      authModalOpen ||
      profileModalOpen;
    document.body.style.overflow = anyModalOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedMenu, authModalOpen, profileModalOpen]);

  // FAVORIT
  const handleToggleFavorite = async (name: string) => {
    try {
      const exists = favorites.includes(name);

      const response = await fetch("/api/favorites", {
        method: exists ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: currentUser?.username || "guest",
          menu_name: name,
        }),
      });

      if (!response.ok) throw new Error();

      setFavorites((previous) =>
        exists
          ? previous.filter((item) => item !== name)
          : [...previous, name]
      );

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
          username: currentUser?.username || "guest",
          menu_name: name,
        }),
      });

      if (!response.ok) throw new Error();

      setFavorites((previous) =>
        previous.filter((item) => item !== name)
      );

      showToast(`${name} dihapus dari favorit.`);
    } catch {
      showToast("Gagal menghapus favorit.");
    }
  };

  // PILIHAN SAYA
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
          username: currentUser?.username || "guest",
          menu_name: name,
        }),
      });

      if (!response.ok) throw new Error();

      setChoices((previous) => [...previous, name]);
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
          username: currentUser?.username || "guest",
          menu_name: name,
        }),
      });

      if (!response.ok) throw new Error();

      setChoices((previous) =>
        previous.filter((item) => item !== name)
      );

      showToast(`${name} berhasil dihapus.`);
    } catch {
      showToast("Gagal menghapus pilihan.");
    }
  };

  // BUKA PROFIL
  const handleProfileButtonClick = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
    } else {
      setProfileModalOpen(true);
    }
  };

  // REGISTER
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

  // LOGIN
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

    setAuthModalOpen(false);

    loadPersonalData(sessionUser.username);

    showToast(
      sessionUser.role === "admin"
        ? "Login admin berhasil. Buka profil untuk Dashboard Admin."
        : "Berhasil login."
    );
  };

  // LOGOUT
  const handleLogout = async () => {
    localStorage.removeItem("gadoGadoCurrentUser");

    setCurrentUser(null);
    setFavorites([]);
    setChoices([]);
    setProfileModalOpen(false);

    await loadPersonalData("guest");

    showToast("Kamu berhasil logout.");
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

        <PromoBanner
         menus={menus}
         onOpenDetail={(menu) => setSelectedMenu(menu)}
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

        <CustomerServiceSection />

        <FaqSection faqs={faqs} />
      </main>

      <Footer />

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

      <Toast
        message={toastMessage}
        visible={toastVisible}
      />
    </>
  );
}

