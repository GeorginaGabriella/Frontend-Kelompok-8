"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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
import CartDrawer from "@/components/CartDrawer";
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
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_BASE,
  calculateTotals,
  formatRupiah,
  parsePriceLabel,
} from "@/lib/order";

import {
  AppliedDiscount,
  CartItem,
  FaqItem,
  MenuItem,
  OrderRecord,
  ShippingAddress,
  SiteContent,
  UserAccount,
} from "@/types";

const CART_STORAGE_KEY = "gadoGadoCart";
const ADDRESS_STORAGE_KEY = "gadoGadoAddress";

const emptyAddress: ShippingAddress = {
  recipient: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  note: "",
};

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

  // KERANJANG DAN PESANAN
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartReady, setCartReady] = useState(false);

  const [address, setAddress] = useState<ShippingAddress>(emptyAddress);

  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] =
    useState<AppliedDiscount | null>(null);
  const [discountError, setDiscountError] = useState("");

  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [lastOrder, setLastOrder] = useState<OrderRecord | null>(null);

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

      const savedUser = localStorage.getItem("gadoGadoCurrentUser");

      if (savedUser) {
        try {
          const user: UserAccount = JSON.parse(savedUser);

          setCurrentUser(user);
          await loadPersonalData(user.username);
        } catch {
          localStorage.removeItem("gadoGadoCurrentUser");
          setCurrentUser(null);
          await loadPersonalData("guest");
        }
      } else {
        await loadPersonalData("guest");
      }
    } catch (error) {
      console.error(error);
      showToast("Gagal menghubungkan ke database.");
    }
  }, [loadPersonalData, showToast]);

  useEffect(() => {
    loadMainData();
  }, [loadMainData]);

  // MEMUAT KERANJANG DAN ALAMAT
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      if (savedCart) {
        const parsed = JSON.parse(savedCart);

        if (Array.isArray(parsed)) {
          setCartItems(
            parsed.filter(
              (item): item is CartItem =>
                Boolean(item?.slug) && Number(item?.quantity) > 0
            )
          );
        }
      }

      const savedAddress = localStorage.getItem(ADDRESS_STORAGE_KEY);

      if (savedAddress) {
        setAddress({ ...emptyAddress, ...JSON.parse(savedAddress) });
      }
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(ADDRESS_STORAGE_KEY);
    } finally {
      setCartReady(true);
    }
  }, []);

  useEffect(() => {
    if (!cartReady) return;

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Keranjang tetap berjalan di memori.
    }
  }, [cartItems, cartReady]);

  useEffect(() => {
    if (!cartReady) return;

    try {
      localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(address));
    } catch {
      // Abaikan bila penyimpanan lokal tidak tersedia.
    }
  }, [address, cartReady]);

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
      profileModalOpen ||
      cartOpen;

    document.body.style.overflow = anyModalOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedMenu, authModalOpen, profileModalOpen, cartOpen]);

  // ALAMAT OTOMATIS
  useEffect(() => {
    if (currentUser && !address.recipient) {
      setAddress((previous) => ({
        ...previous,
        recipient: currentUser.name,
      }));
    }
  }, [currentUser, address.recipient]);

  // TOTAL KERANJANG
  const totals = useMemo(
    () => calculateTotals(cartItems, appliedDiscount),
    [cartItems, appliedDiscount]
  );

  // VALIDASI DISKON
  const revalidateDiscount = useCallback(
    async (code: string, subtotal: number, silent = false) => {
      if (!code) return;

      try {
        const response = await fetch("/api/discounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "validate", code, subtotal }),
        });

        const data = await response.json();

        if (!response.ok) {
          setAppliedDiscount(null);
          setDiscountError(data.error || "Kode diskon tidak berlaku.");
          return;
        }

        setAppliedDiscount(data.discount);
        setDiscountError("");

        if (!silent) {
          showToast(`Kode ${data.discount.code} berhasil dipakai.`);
        }
      } catch {
        setDiscountError("Gagal memeriksa kode diskon.");
      }
    },
    [showToast]
  );

  // MENAMBAHKAN MENU KE KERANJANG
  const handleAddToCart = (menu: MenuItem) => {
    setCartItems((previous) => {
      const existing = previous.find((item) => item.slug === menu.slug);

      if (existing) {
        return previous.map((item) =>
          item.slug === menu.slug
            ? { ...item, quantity: Math.min(item.quantity + 1, 99) }
            : item
        );
      }

      return [
        ...previous,
        {
          slug: menu.slug,
          name: menu.name,
          image: menu.image,
          priceLabel: menu.price,
          unitPrice: parsePriceLabel(menu.price),
          quantity: 1,
        },
      ];
    });

    setLastOrder(null);
    showToast(`${menu.name} masuk keranjang.`);
  };

  const handleIncrease = (slug: string) => {
    setCartItems((previous) =>
      previous.map((item) =>
        item.slug === slug
          ? { ...item, quantity: Math.min(item.quantity + 1, 99) }
          : item
      )
    );
  };

  const handleDecrease = (slug: string) => {
    setCartItems((previous) =>
      previous
        .map((item) =>
          item.slug === slug
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (slug: string) => {
    setCartItems((previous) =>
      previous.filter((item) => item.slug !== slug)
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
    setAppliedDiscount(null);
    setDiscountInput("");
    setDiscountError("");
    showToast("Keranjang dikosongkan.");
  };

  // VALIDASI ULANG DISKON SAAT KERANJANG BERUBAH
  useEffect(() => {
    if (!appliedDiscount) return;

    const subtotal = cartItems.reduce(
      (total, item) => total + item.unitPrice * item.quantity,
      0
    );

    if (subtotal === 0) {
      setAppliedDiscount(null);
      return;
    }

    revalidateDiscount(appliedDiscount.code, subtotal, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

  const handleApplyDiscount = async () => {
    const code = discountInput.trim().toUpperCase();

    if (!code) {
      setDiscountError("Masukkan kode diskon terlebih dahulu.");
      return;
    }

    if (cartItems.length === 0) {
      setDiscountError("Keranjang masih kosong.");
      return;
    }

    await revalidateDiscount(code, totals.subtotal);
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountInput("");
    setDiscountError("");
  };

  // ALAMAT PENGIRIMAN
  const handleAddressChange = (
    field: keyof ShippingAddress,
    value: string
  ) => {
    setAddress((previous) => ({ ...previous, [field]: value }));
  };

  // CHECKOUT
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      showToast("Keranjang masih kosong.");
      return;
    }

    if (
      !address.recipient.trim() ||
      !address.phone.trim() ||
      !address.address.trim()
    ) {
      showToast("Lengkapi nama, telepon, dan alamat pengiriman.");
      return;
    }

    setSubmittingOrder(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: currentUser?.username || "guest",
          recipient: address.recipient,
          phone: address.phone,
          address: address.address,
          city: address.city,
          postalCode: address.postalCode,
          note: address.note,
          discountCode: appliedDiscount?.code || "",
          items: cartItems.map((item) => ({
            slug: item.slug,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.error || "Gagal membuat pesanan.");
        return;
      }

      setLastOrder(data.order);
      setCartItems([]);
      setAppliedDiscount(null);
      setDiscountInput("");
      setDiscountError("");

      showToast(
        `Pesanan ${data.order.orderCode} dibuat · ${formatRupiah(
          data.order.total
        )}`
      );
    } catch {
      showToast("Gagal menghubungkan ke server pesanan.");
    } finally {
      setSubmittingOrder(false);
    }
  };

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
          onAddToCart={handleAddToCart}
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
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        address={address}
        onAddressChange={handleAddressChange}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        onRemove={handleRemoveFromCart}
        onClear={handleClearCart}
        discountInput={discountInput}
        onDiscountInputChange={setDiscountInput}
        appliedDiscount={appliedDiscount}
        discountError={discountError}
        onApplyDiscount={handleApplyDiscount}
        onRemoveDiscount={handleRemoveDiscount}
        totals={totals}
        shippingBase={SHIPPING_BASE}
        freeShippingThreshold={FREE_SHIPPING_THRESHOLD}
        submitting={submittingOrder}
        onCheckout={handleCheckout}
        lastOrder={lastOrder}
        onDismissLastOrder={() => {
          setLastOrder(null);
          setCartOpen(false);
        }}
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
