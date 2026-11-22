"use client";

import "./admin.css";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Utensils,
  MessageCircle,
  FileText,
  CircleHelp,
  House,
  LogOut,
  Salad,
  Save,
  ArrowRight,
} from "lucide-react";

import {
  CommentItem,
  FaqItem,
  MenuItem,
  SiteContent,
} from "@/types";

type TabType =
  | "overview"
  | "menus"
    | "comments"
    | "content"
  | "faq";

/** Urutan tampilan daftar menu pada dashboard. */
type MenuSortOption =
  | "abjad-asc"
  | "abjad-desc"
  | "kategori"
  | "harga-asc"
  | "harga-desc";

const menuSortOptions: Array<{ value: MenuSortOption; label: string }> = [
  { value: "abjad-asc", label: "Nama A → Z" },
  { value: "abjad-desc", label: "Nama Z → A" },
  { value: "kategori", label: "Kategori A → Z" },
  { value: "harga-asc", label: "Harga termurah" },
  { value: "harga-desc", label: "Harga termahal" },
];

type MenuFilterOption = "semua" | "gado-gado" | "minuman" | "kue";

const menuFilterOptions: Array<{ value: MenuFilterOption; label: string }> = [
  { value: "semua", label: "Semua Menu" },
  { value: "gado-gado", label: "Gado-Gado" },
  { value: "minuman", label: "Minuman" },
  { value: "kue", label: "Kue Tradisional" },
];

const getMenuFilterCategory = (menu: MenuItem): Exclude<MenuFilterOption, "semua"> | "lainnya" => {
  const group = (menu.group || "").toLowerCase();
  const details = `${menu.kategori || ""} ${menu.categoryLabel || ""} ${menu.name || ""}`.toLowerCase();

  if (group === "minuman" || /minuman|minum|es cendol|es doger|es teler|wedang|jamu/.test(details)) {
    return "minuman";
  }

  if (group === "dessert" || /kue|dessert|camilan|jajanan pasar/.test(details)) {
    return "kue";
  }

  if (group === "betawi" || group === "sunda" || group === "jawa" || group === "tradisional" || /gado.?gado/.test(details)) {
    return "gado-gado";
  }

  return "lainnya";
};


type MenuFormState = {
  name: string;
  price: string;
  image: string;
  kategori: string;
  group: string;
  region: string;
  regionBadge: string;
  categoryLabel: string;
  shortDescription: string;
  description: string;
  ingredients: string;
  cardIngredients: string;
  location: string;
  city: string;
  condiments: string;
  benefits: string;
  rating: string;
};

const emptyMenuForm: MenuFormState = {
  name: "",
  price: "",
  image: "",
  kategori: "Gado-Gado",
  group: "tradisional",
  region: "",
  regionBadge: "",
  categoryLabel: "",
  shortDescription: "",
  description: "",
  ingredients: "",
  cardIngredients: "",
  location: "",
  city: "",
  condiments: "",
  benefits: "",
  rating: "4.8",
};


/** Mengambil angka dari label harga, untuk keperluan pengurutan. */
const priceToNumber = (value: string) =>
  Number.parseInt((value || "").replace(/[^0-9]/g, "").slice(0, 9), 10) || 0;

const makeSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const splitLines = (value: string) =>
  value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

export default function AdminPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] =
    useState<TabType>("overview");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [adminName, setAdminName] =
    useState("Administrator");

  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  const [siteContent, setSiteContent] =
    useState<SiteContent>({
      heroDescription: "",
      aboutDescription: "",
    });

  const [menuForm, setMenuForm] =
    useState<MenuFormState>(emptyMenuForm);

  const [editingSlug, setEditingSlug] =
    useState<string | null>(null);

  const [showMenuForm, setShowMenuForm] = useState(false);

  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [editingFaqId, setEditingFaqId] = useState<number | null>(null);
  const [faqSaving, setFaqSaving] = useState(false);
  const [faqDeletingId, setFaqDeletingId] = useState<number | null>(null);
  const [faqToDelete, setFaqToDelete] = useState<FaqItem | null>(null);

  // Pengurutan dan pencarian daftar menu (default: sesuai abjad A → Z).
  const [menuSort, setMenuSort] =
    useState<MenuSortOption>("abjad-asc");
  const [menuSearch, setMenuSearch] = useState("");
  const [menuFilter, setMenuFilter] =
    useState<MenuFilterOption>("semua");

  const [comments, setComments] = useState<CommentItem[]>([]);

  const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});


  const notify = (text: string, isError = false) => {
    setMessage(isError ? "" : text);
    setErrorMessage(isError ? text : "");

    window.setTimeout(() => {
      setMessage("");
      setErrorMessage("");
    }, 3000);
  };

  const loadDashboard = useCallback(async () => {
    setLoading(true);

    try {
      const [
        menuResponse,
        faqResponse,
        contentResponse,
        commentResponse,
      ] = await Promise.all([
        fetch("/api/menus"),
        fetch("/api/faqs"),
        fetch("/api/content"),
        fetch("/api/comments"),
      ]);

      if (
        !menuResponse.ok ||
        !faqResponse.ok ||
        !contentResponse.ok
      ) {
        throw new Error("Gagal mengambil data dashboard.");
      }

      const menuData = await menuResponse.json();
      const faqData = await faqResponse.json();
      const contentData = await contentResponse.json();

      setMenus(menuData.menus || []);
      setFaqs(faqData.faqs || []);


      if (commentResponse.ok) {
        const commentData = await commentResponse.json();
        setComments(commentData.comments || []);
      }


      setSiteContent(
        contentData.content || {
          heroDescription: "",
          aboutDescription: "",
        }
      );
    } catch (error) {
      console.error(error);
      notify("Gagal memuat data dashboard.", true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem(
      "gadoGadoCurrentUser"
    );

    if (!savedUser) {
      router.replace("/");
      return;
    }

    try {
      const user = JSON.parse(savedUser);

      if (user.role !== "admin") {
        router.replace("/");
        return;
      }

      setAdminName(user.name || "Administrator");
      loadDashboard();
    } catch {
      localStorage.removeItem("gadoGadoCurrentUser");
      router.replace("/");
    }
  }, [router, loadDashboard]);

  const openCreateForm = () => {
    setEditingSlug(null);
    setMenuForm(emptyMenuForm);
    setShowMenuForm(true);
    setActiveTab("menus");
  };

  const openEditForm = (menu: MenuItem) => {
    setEditingSlug(menu.slug);

    setMenuForm({
      name: menu.name || "",
      price: menu.price || "",
      image: menu.image || "",
      kategori: menu.kategori || "Gado-Gado",
      group: menu.group || "tradisional",
      region: menu.region || "",
      regionBadge: menu.regionBadge || "",
      categoryLabel: menu.categoryLabel || "",
      shortDescription: menu.shortDescription || "",
      description: menu.description || "",
      ingredients: (menu.ingredients || []).join("\n"),
      cardIngredients: (menu.cardIngredients || []).join("\n"),
      location: menu.location || "",
      city: menu.city || "",
      condiments: menu.condiments || "",
      benefits: menu.benefits || "",
      rating: menu.rating || "4.8",
    });

    setShowMenuForm(true);
    setActiveTab("menus");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleMenuFormChange = (
    field: keyof MenuFormState,
    value: string
  ) => {
    setMenuForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSaveMenu = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !menuForm.name.trim() ||
      !menuForm.price.trim() ||
      !menuForm.description.trim()
    ) {
      notify(
        "Nama, harga, dan deskripsi wajib diisi.",
        true
      );
      return;
    }

    const ingredients = splitLines(menuForm.ingredients);

    const cardIngredients = menuForm.cardIngredients.trim()
      ? splitLines(menuForm.cardIngredients)
      : ingredients.slice(0, 3);

    const slug = editingSlug || makeSlug(menuForm.name);

    if (!slug) {
      notify("Nama menu tidak valid.", true);
      return;
    }

    const menuPayload: Partial<MenuItem> & {
      slug: string;
      name: string;
    } = {
      slug,
      name: menuForm.name.trim(),
      searchName: menuForm.name.trim().toLowerCase(),
      kategori: menuForm.kategori.trim() || "Gado-Gado",
      group: menuForm.group as MenuItem["group"],
      regionBadge:
        menuForm.regionBadge.trim() || menuForm.region.trim(),
      categoryLabel:
        menuForm.categoryLabel.trim() ||
        menuForm.kategori.trim(),
      region: menuForm.region.trim(),
      rating: menuForm.rating.trim() || "4.8",
      image:
        menuForm.image.trim() ||
        "/images/default-menu.jpg",
      shortDescription:
        menuForm.shortDescription.trim() ||
        menuForm.description.trim().slice(0, 100),
      description: menuForm.description.trim(),
      cardIngredients,
      ingredients,
      price: menuForm.price.trim(),
      location: menuForm.location.trim(),
      city: menuForm.city.trim(),
      condiments: menuForm.condiments.trim(),
      benefits: menuForm.benefits.trim(),
    };

    setSaving(true);

    try {
      const response = await fetch("/api/menus", {
        method: editingSlug ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          editingSlug
            ? {
                slug: editingSlug,
                updated: menuPayload,
              }
            : menuPayload
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Gagal menyimpan menu."
        );
      }

      notify(
        editingSlug
          ? "Menu berhasil diperbarui."
          : "Menu baru berhasil ditambahkan."
      );

      setMenuForm(emptyMenuForm);
      setEditingSlug(null);
      setShowMenuForm(false);

      await loadDashboard();
    } catch (error) {
      notify(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan menu.",
        true
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMenu = async (menu: MenuItem) => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus menu "${menu.name}"?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch("/api/menus", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: menu.slug,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Gagal menghapus menu."
        );
      }

      notify("Menu berhasil dihapus.");
      await loadDashboard();
    } catch (error) {
      notify(
        error instanceof Error
          ? error.message
          : "Gagal menghapus menu.",
        true
      );
    }
  };

  const handleSaveContent = async () => {
    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(siteContent),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Gagal menyimpan konten."
        );
      }

      notify("Konten website berhasil diperbarui.");
    } catch (error) {
      notify(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan konten website.",
        true
      );
    }
  };

  const handleEditFaq = (faq: FaqItem) => {
    if (faq.id == null) {
      notify("ID FAQ tidak ditemukan.", true);
      return;
    }

    setEditingFaqId(faq.id);
    setFaqQuestion(faq.question);
    setFaqAnswer(faq.answer);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelFaqEdit = () => {
    setEditingFaqId(null);
    setFaqQuestion("");
    setFaqAnswer("");
  };

  const handleSaveFaq = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!faqQuestion.trim() || !faqAnswer.trim()) {
      notify("Pertanyaan dan jawaban FAQ wajib diisi.", true);
      return;
    }

    setFaqSaving(true);

    try {
      const response = await fetch("/api/faqs", {
        method: editingFaqId !== null ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(editingFaqId !== null ? { id: editingFaqId } : {}),
          question: faqQuestion.trim(),
          answer: faqAnswer.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menyimpan FAQ.");
      }

      if (editingFaqId !== null) {
        setFaqs((previous) =>
          previous.map((faq) => faq.id === editingFaqId ? data.faq : faq)
        );
        notify("FAQ berhasil diperbarui.");
      } else {
        setFaqs((previous) => [...previous, data.faq]);
        notify("FAQ berhasil ditambahkan.");
      }

      handleCancelFaqEdit();
    } catch (error) {
      notify(
        error instanceof Error ? error.message : "Gagal menyimpan FAQ.",
        true
      );
    } finally {
      setFaqSaving(false);
    }
  };

  const handleDeleteFaq = async () => {
    if (!faqToDelete || faqToDelete.id == null) return;

    const faqId = faqToDelete.id;
    setFaqDeletingId(faqId);

    try {
      const response = await fetch("/api/faqs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: faqId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menghapus FAQ.");
      }

      setFaqs((previous) => previous.filter((faq) => faq.id !== faqId));
      setFaqToDelete(null);
      notify("FAQ berhasil dihapus.");
    } catch (error) {
      notify(
        error instanceof Error ? error.message : "Gagal menghapus FAQ.",
        true
      );
    } finally {
      setFaqDeletingId(null);
    }
  };

  // Daftar menu diurutkan sesuai abjad secara default, dan bisa diubah
  // melalui dropdown "Urutkan" pada tab Kelola Menu.
  const sortedMenus = useMemo(() => {
    const keyword = menuSearch.trim().toLowerCase();

    const filtered = menus.filter((menu) => {
      const matchesCategory =
        menuFilter === "semua" || getMenuFilterCategory(menu) === menuFilter;

      const matchesSearch =
        !keyword ||
        menu.name.toLowerCase().includes(keyword) ||
        (menu.kategori || "").toLowerCase().includes(keyword) ||
        (menu.region || "").toLowerCase().includes(keyword) ||
        (menu.categoryLabel || "").toLowerCase().includes(keyword);

      return matchesCategory && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      switch (menuSort) {
        case "abjad-desc":
          return b.name.localeCompare(a.name, "id");
        case "kategori":
          return (
            (a.kategori || "").localeCompare(b.kategori || "", "id") ||
            a.name.localeCompare(b.name, "id")
          );
        case "harga-asc":
          return priceToNumber(a.price) - priceToNumber(b.price);
        case "harga-desc":
          return priceToNumber(b.price) - priceToNumber(a.price);
        default:
          return a.name.localeCompare(b.name, "id");
      }
    });
  }, [menus, menuSearch, menuSort, menuFilter]);

  const handleReplyComment = async (comment: CommentItem) => {
    const reply = (replyDrafts[comment.id] ?? comment.reply).trim();

    try {
      const response = await fetch("/api/comments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: comment.id, reply }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menyimpan balasan.");
      }

      setComments((previous) =>
        previous.map((item) =>
          item.id === comment.id ? { ...item, reply } : item
        )
      );

      notify("Balasan komentar tersimpan.");
    } catch (error) {
      notify(
        error instanceof Error ? error.message : "Gagal menyimpan balasan.",
        true
      );
    }
  };

  const handleToggleComment = async (comment: CommentItem) => {
    const published = !comment.published;

    try {
      const response = await fetch("/api/comments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: comment.id, published }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal memperbarui komentar.");
      }

      setComments((previous) =>
        previous.map((item) =>
          item.id === comment.id ? { ...item, published } : item
        )
      );

      notify(
        published
          ? "Komentar ditampilkan di website."
          : "Komentar disembunyikan dari website."
      );
    } catch (error) {
      notify(
        error instanceof Error
          ? error.message
          : "Gagal memperbarui komentar.",
        true
      );
    }
  };

  const handleDeleteComment = async (comment: CommentItem) => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus komentar dari ${comment.name}?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch("/api/comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: comment.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menghapus komentar.");
      }

      setComments((previous) =>
        previous.filter((item) => item.id !== comment.id)
      );

      notify("Komentar berhasil dihapus.");
    } catch (error) {
      notify(
        error instanceof Error
          ? error.message
          : "Gagal menghapus komentar.",
        true
      );
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("gadoGadoCurrentUser");
    router.replace("/");
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        <p>Menyiapkan dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link href="/" className="admin-brand">
          <span className="admin-brand-icon">
            <Salad size={27} strokeWidth={1.8} />
          </span>
          <span>
            <strong>Gado-Gado</strong>
            <small>NUSANTARA ADMIN</small>
          </span>
        </Link>

        <div className="admin-sidebar-label">MENU UTAMA</div>

        <nav className="admin-navigation">
          <button
            type="button"
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            <LayoutDashboard size={19} />
            Overview
          </button>

          <button
            type="button"
            className={activeTab === "menus" ? "active" : ""}
            onClick={() => setActiveTab("menus")}
          >
            <Utensils size={19} />
            Kelola Menu
            <span className="admin-nav-count">{menus.length}</span>
          </button>

          <button
            type="button"
            className={activeTab === "comments" ? "active" : ""}
            onClick={() => setActiveTab("comments")}
          >
            <MessageCircle size={19} />
            Customer Service
            <span className="admin-nav-count">{comments.length}</span>
          </button>

          <button
            type="button"
            className={activeTab === "content" ? "active" : ""}
            onClick={() => setActiveTab("content")}
          >
            <FileText size={19} />
            Konten Website
          </button>

          <button
            type="button"
            className={activeTab === "faq" ? "active" : ""}
            onClick={() => setActiveTab("faq")}
          >
            <CircleHelp size={19} />
            Kelola FAQ
            <span className="admin-nav-count">{faqs.length}</span>
          </button>
        </nav>

        <div className="admin-sidebar-bottom">
          <Link href="/" className="admin-back-link">
            <House size={19} />
            Lihat Website
          </Link>

          <button
            type="button"
            className="admin-logout"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-breadcrumb">
              GADO-GADO NUSANTARA / ADMIN
            </p>

            <h1>
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "menus" && "Kelola Menu"}
              {activeTab === "comments" && "Customer Service"}
              {activeTab === "content" && "Konten Website"}
              {activeTab === "faq" && "Kelola FAQ"}
            </h1>
          </div>

          <div className="admin-account">
            <div className="admin-account-avatar">
              {adminName.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{adminName}</strong>
              <span>Administrator</span>
            </div>
          </div>
        </header>

        {message && (
          <div className="admin-alert admin-alert-success">
            ✓ {message}
          </div>
        )}

        {errorMessage && (
          <div className="admin-alert admin-alert-error">
            ! {errorMessage}
          </div>
        )}

        {activeTab === "overview" && (
          <section className="admin-section admin-overview-section">
            <div className="admin-welcome">
              <div className="admin-welcome-copy">
                <span className="admin-eyebrow">ADMINISTRATOR PANEL</span>
                <h2>Selamat datang, {adminName}!</h2>
                <p>
                  Pantau menu, pertanyaan pelanggan, dan informasi website
                  Gado-Gado Nusantara dari satu tempat.
                </p>
                <div className="admin-welcome-actions">
                  <button
                    type="button"
                    className="admin-welcome-button"
                    onClick={openCreateForm}
                  >
                    <Utensils size={16} /> Tambahkan Menu
                  </button>
                  <button
                    type="button"
                    className="admin-customer-service-button"
                    onClick={() => setActiveTab("comments")}
                  >
                    <MessageCircle size={18} />
                    Lihat Customer Service
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
              <div className="admin-welcome-icon" aria-hidden="true">
                <Salad size={54} strokeWidth={1.35} />
              </div>
            </div>

            <div className="admin-stat-grid admin-stat-grid-compact">
              <button
                type="button"
                className="admin-stat-card admin-stat-card-clickable"
                onClick={() => setActiveTab("menus")}
              >
                <div className="admin-stat-top">
                  <div className="admin-stat-icon menu-icon"><Utensils size={20} /></div>
                  <span className="admin-stat-label">MENU</span>
                </div>
                <span>Total Menu</span>
                <strong>{menus.length}</strong>
                <small>Lihat dan kelola menu <ArrowRight size={12} /></small>
              </button>

              <button
                type="button"
                className="admin-stat-card admin-stat-card-clickable"
                onClick={() => setActiveTab("faq")}
              >
                <div className="admin-stat-top">
                  <div className="admin-stat-icon faq-icon"><CircleHelp size={20} /></div>
                  <span className="admin-stat-label">FAQ</span>
                </div>
                <span>Total FAQ</span>
                <strong>{faqs.length}</strong>
                <small>Kelola informasi pelanggan <ArrowRight size={12} /></small>
              </button>

              <button
                type="button"
                className="admin-stat-card admin-stat-card-clickable"
                onClick={() => setActiveTab("comments")}
              >
                <div className="admin-stat-top">
                  <div className="admin-stat-icon comment-icon"><MessageCircle size={20} /></div>
                  <span className="admin-stat-label">CUSTOMER SERVICE</span>
                </div>
                <span>Belum Dibalas</span>
                <strong>{comments.filter((item) => !item.reply?.trim()).length}</strong>
                <small>Dari {comments.length} komentar masuk <ArrowRight size={12} /></small>
              </button>
            </div>

            <div className="admin-panel admin-overview-menu-panel">
              <div className="admin-panel-heading">
                <div>
                  <span className="admin-section-kicker">DATABASE MENU</span>
                  <h3>Menu Terbaru untuk Dikelola</h3>
                  <p>Berikut lima menu pertama berdasarkan urutan nama A–Z.</p>
                </div>
                <button
                  type="button"
                  className="admin-primary-button"
                  onClick={() => setActiveTab("menus")}
                >
                  Lihat Semua Menu <ArrowRight size={15} />
                </button>
              </div>

              {menus.length === 0 ? (
                <div className="admin-empty">
                  Belum ada menu. Tambahkan menu pertama.
                </div>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Menu</th>
                        <th>Kategori</th>
                        <th>Wilayah</th>
                        <th>Harga</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedMenus.slice(0, 5).map((menu) => (
                        <tr key={menu.slug}>
                          <td>
                            <div className="admin-menu-cell">
                              <img
                                src={menu.image || "/images/default-menu.jpg"}
                                alt={menu.name}
                              />
                              <strong>{menu.name}</strong>
                            </div>
                          </td>
                          <td>{menu.kategori || "-"}</td>
                          <td>{menu.region || "-"}</td>
                          <td>{menu.price || "-"}</td>
                          <td>
                            <button
                              type="button"
                              className="admin-table-action"
                              onClick={() => openEditForm(menu)}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === "menus" && (
          <section className="admin-section">
            <div className="admin-page-heading">
              <div>
                <span className="admin-section-kicker">
                  MENU MANAGEMENT
                </span>
                <h2>Daftar Menu</h2>
                <p>
                  Tambahkan, ubah, dan hapus informasi menu makanan.
                </p>
              </div>

              <button
                type="button"
                className="admin-primary-button"
                onClick={openCreateForm}
              >
                + Tambah Menu
              </button>
            </div>

            {showMenuForm && (
              <form
                className="admin-form"
                onSubmit={handleSaveMenu}
              >
                <div className="admin-form-heading">
                  <div>
                    <span className="admin-section-kicker">
                      MENU EDITOR
                    </span>
                    <h3>
                      {editingSlug
                        ? "Edit Menu"
                        : "Tambah Menu Baru"}
                    </h3>
                    <p>
                      Isi informasi menu yang akan ditampilkan
                      pada website.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="admin-close-form"
                    onClick={() => {
                      setShowMenuForm(false);
                      setEditingSlug(null);
                      setMenuForm(emptyMenuForm);
                    }}
                  >
                    Ã—
                  </button>
                </div>

                <div className="admin-form-grid">
                  <label className="admin-field">
                    <span>Nama Menu *</span>
                    <input
                      value={menuForm.name}
                      onChange={(event) =>
                        handleMenuFormChange("name", event.target.value)
                      }
                      placeholder="Contoh: Gado-Gado Betawi"
                      required
                    />
                  </label>

                  <label className="admin-field">
                    <span>Harga *</span>
                    <input
                      value={menuForm.price}
                      onChange={(event) =>
                        handleMenuFormChange("price", event.target.value)
                      }
                      placeholder="Contoh: Rp 25.000"
                      required
                    />
                  </label>

                  <label className="admin-field admin-field-full">
                    <span>URL / Path Gambar</span>
                    <input
                      value={menuForm.image}
                      onChange={(event) =>
                        handleMenuFormChange("image", event.target.value)
                      }
                      placeholder="/images/gado-gado-betawi.jpg"
                    />
                    <small>
                      Simpan gambar lokal di folder public/images.
                    </small>
                  </label>

                  <label className="admin-field">
                    <span>Kategori</span>
                    <input
                      value={menuForm.kategori}
                      onChange={(event) =>
                        handleMenuFormChange("kategori", event.target.value)
                      }
                    />
                  </label>

                  <label className="admin-field">
                    <span>Group Filter</span>
                    <select
                      value={menuForm.group}
                      onChange={(event) =>
                        handleMenuFormChange("group", event.target.value)
                      }
                    >
                      <option value="betawi">Betawi</option>
                      <option value="sunda">Sunda</option>
                      <option value="jawa">Jawa</option>
                      <option value="minuman">
                        Minuman Tradisional (menu sampingan)
                      </option>
                      <option value="dessert">
                        Kue &amp; Camilan (menu sampingan)
                      </option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                    <small>
                      Pilihan Minuman Tradisional dan Kue &amp; Camilan tampil
                      pada bagian Menu Sampingan di website.
                    </small>
                  </label>

                  <label className="admin-field">
                    <span>Wilayah / Asal</span>
                    <input
                      value={menuForm.region}
                      onChange={(event) =>
                        handleMenuFormChange("region", event.target.value)
                      }
                      placeholder="Contoh: Jakarta"
                    />
                  </label>

                  <label className="admin-field">
                    <span>Nama Kota</span>
                    <input
                      value={menuForm.city}
                      onChange={(event) =>
                        handleMenuFormChange("city", event.target.value)
                      }
                      placeholder="Contoh: Jakarta"
                    />
                  </label>

                  <label className="admin-field">
                    <span>Label Wilayah</span>
                    <input
                      value={menuForm.regionBadge}
                      onChange={(event) =>
                        handleMenuFormChange("regionBadge", event.target.value)
                      }
                    />
                  </label>

                  <label className="admin-field">
                    <span>Label Kategori</span>
                    <input
                      value={menuForm.categoryLabel}
                      onChange={(event) =>
                        handleMenuFormChange("categoryLabel", event.target.value)
                      }
                    />
                  </label>

                  <label className="admin-field">
                    <span>Rating</span>
                    <input
                      value={menuForm.rating}
                      onChange={(event) =>
                        handleMenuFormChange("rating", event.target.value)
                      }
                    />
                  </label>

                  <label className="admin-field admin-field-full">
                    <span>Deskripsi Singkat</span>
                    <textarea
                      rows={2}
                      value={menuForm.shortDescription}
                      onChange={(event) =>
                        handleMenuFormChange("shortDescription", event.target.value)
                      }
                    />
                  </label>

                  <label className="admin-field admin-field-full">
                    <span>Deskripsi Lengkap *</span>
                    <textarea
                      rows={4}
                      value={menuForm.description}
                      onChange={(event) =>
                        handleMenuFormChange("description", event.target.value)
                      }
                      required
                    />
                  </label>

                  <label className="admin-field admin-field-full">
                    <span>Bahan / Komponen Menu</span>
                    <textarea
                      rows={5}
                      value={menuForm.ingredients}
                      onChange={(event) =>
                        handleMenuFormChange("ingredients", event.target.value)
                      }
                      placeholder={"Sayuran segar\nLontong\nTahu\nTempe"}
                    />
                    <small>
                      Pisahkan bahan dengan baris baru atau koma.
                    </small>
                  </label>

                  <label className="admin-field admin-field-full">
                    <span>Bahan yang Ditampilkan di Kartu</span>
                    <textarea
                      rows={3}
                      value={menuForm.cardIngredients}
                      onChange={(event) =>
                        handleMenuFormChange("cardIngredients", event.target.value)
                      }
                    />
                  </label>

                  <label className="admin-field">
                    <span>Lokasi</span>
                    <input
                      value={menuForm.location}
                      onChange={(event) =>
                        handleMenuFormChange("location", event.target.value)
                      }
                    />
                  </label>

                  <label className="admin-field">
                    <span>Bumbu / Pelengkap</span>
                    <input
                      value={menuForm.condiments}
                      onChange={(event) =>
                        handleMenuFormChange("condiments", event.target.value)
                      }
                    />
                  </label>

                  <label className="admin-field admin-field-full">
                    <span>Manfaat / Informasi Tambahan</span>
                    <textarea
                      rows={3}
                      value={menuForm.benefits}
                      onChange={(event) =>
                        handleMenuFormChange("benefits", event.target.value)
                      }
                    />
                  </label>
                </div>

                <div className="admin-form-actions">
                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={() => {
                      setShowMenuForm(false);
                      setEditingSlug(null);
                      setMenuForm(emptyMenuForm);
                    }}
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="admin-primary-button"
                    disabled={saving}
                  >
                    {saving
                      ? "Menyimpan..."
                      : editingSlug
                        ? "Simpan Perubahan"
                        : "Tambah Menu"}
                  </button>
                </div>
              </form>
            )}

            <div className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <h3>Semua Menu ({sortedMenus.length})</h3>
                  <p>
                    Data menu tersimpan di database PostgreSQL dan
                    ditampilkan urut abjad.
                  </p>
                </div>

                <div className="admin-toolbar">
                  <input
                    className="admin-search"
                    value={menuSearch}
                    onChange={(event) => setMenuSearch(event.target.value)}
                    placeholder="Cari nama, kategori, wilayah..."
                    aria-label="Cari menu"
                  />

                  <label className="admin-sort">
                    <span>Urutkan</span>
                    <select
                      value={menuSort}
                      onChange={(event) =>
                        setMenuSort(event.target.value as MenuSortOption)
                      }
                    >
                      {menuSortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="admin-filter-row" aria-label="Filter kategori menu">
                <span className="admin-filter-label">Kategori:</span>
                <div className="admin-filter-buttons">
                  {menuFilterOptions.map((option) => {
                    const count =
                      option.value === "semua"
                        ? menus.length
                        : menus.filter((menu) => getMenuFilterCategory(menu) === option.value).length;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        className={`admin-filter-button ${menuFilter === option.value ? "active" : ""}`}
                        onClick={() => setMenuFilter(option.value)}
                        aria-pressed={menuFilter === option.value}
                      >
                        {option.label}
                        <span>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {sortedMenus.length === 0 ? (
                <div className="admin-empty">
                  Tidak ada menu yang cocok dengan filter atau pencarian.
                </div>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Menu</th>
                        <th>Kategori</th>
                        <th>Wilayah</th>
                        <th>Harga</th>
                        <th>Bahan</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>

                    <tbody>
                      {sortedMenus.map((menu) => (
                        <tr key={menu.slug}>
                          <td>
                            <div className="admin-menu-cell">
                              <img
                                src={
                                  menu.image ||
                                  "/images/default-menu.jpg"
                                }
                                alt={menu.name}
                              />
                              <strong>{menu.name}</strong>
                            </div>
                          </td>

                          <td>{menu.kategori || "-"}</td>
                          <td>{menu.region || "-"}</td>
                          <td>{menu.price || "-"}</td>
                          <td>
                            {menu.ingredients?.length || 0} bahan
                          </td>

                          <td>
                            <div className="admin-row-actions">
                              <button
                                type="button"
                                className="admin-table-action"
                                onClick={() => openEditForm(menu)}
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                className="admin-delete-button"
                                onClick={() => handleDeleteMenu(menu)}
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}


        {activeTab === "comments" && (
          <section className="admin-section">
            <div className="admin-page-heading">
              <div>
                <span className="admin-section-kicker">
                  CUSTOMER SERVICE
                </span>
                <h2>Komentar Pengunjung</h2>
                <p>
                  Balas komentar pengunjung, sembunyikan komentar yang tidak
                  pantas, atau hapus komentar spam.
                </p>
              </div>

              <button
                type="button"
                className="admin-secondary-button"
                onClick={loadDashboard}
              >
                ⟳ Muat Ulang
              </button>
            </div>

            {comments.length === 0 ? (
              <div className="admin-empty">
                Belum ada komentar dari pengunjung.
              </div>
            ) : (
              <div className="admin-comment-list">
                {comments.map((comment) => (
                  <article className="admin-comment-card" key={comment.id}>
                    <header>
                      <div className="admin-comment-avatar">
                        {comment.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <strong>{comment.name}</strong>
                        <small>
                          {comment.topic} ·{" "}
                          {new Date(comment.createdAt).toLocaleDateString(
                            "id-ID"
                          )}{" "}
                          · {"★".repeat(comment.rating)}
                        </small>
                      </div>

                      <span
                        className={`admin-status ${
                          comment.published
                            ? "admin-status-selesai"
                            : "admin-status-batal"
                        }`}
                      >
                        {comment.published ? "Tampil" : "Disembunyikan"}
                      </span>
                    </header>

                    <p className="admin-comment-message">{comment.message}</p>

                    <label className="admin-field admin-field-full">
                      <span>Balasan Admin</span>
                      <textarea
                        rows={3}
                        value={replyDrafts[comment.id] ?? comment.reply}
                        onChange={(event) =>
                          setReplyDrafts((previous) => ({
                            ...previous,
                            [comment.id]: event.target.value,
                          }))
                        }
                        placeholder="Tulis balasan untuk pengunjung..."
                      />
                    </label>

                    <footer>
                      <button
                        type="button"
                        className="admin-primary-button"
                        onClick={() => handleReplyComment(comment)}
                      >
                        💬 Simpan Balasan
                      </button>

                      <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={() => handleToggleComment(comment)}
                      >
                        {comment.published
                          ? "🙈 Sembunyikan"
                          : "👁️ Tampilkan"}
                      </button>

                      <button
                        type="button"
                        className="admin-delete-button"
                        onClick={() => handleDeleteComment(comment)}
                      >
                        🗑️ Hapus
                      </button>
                    </footer>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}


        {activeTab === "content" && (
          <section className="admin-section">
            <div className="admin-page-heading">
              <div>
                <span className="admin-section-kicker">
                  WEBSITE SETTINGS
                </span>
                <h2>Konten Website</h2>
                <p>
                  Atur tulisan yang ditampilkan di halaman utama.
                </p>
              </div>
            </div>

            <div className="admin-form">
              <div className="admin-form-heading">
                <div>
                  <h3>Pengaturan Konten</h3>
                  <p>
                    Ubah deskripsi bagian utama dan tentang website.
                  </p>
                </div>
              </div>

              <label className="admin-field admin-field-full">
                <span>Deskripsi Hero</span>
                <textarea
                  rows={5}
                  value={siteContent.heroDescription || ""}
                  onChange={(event) =>
                    setSiteContent((previous) => ({
                      ...previous,
                      heroDescription: event.target.value,
                    }))
                  }
                />
              </label>

              <label className="admin-field admin-field-full">
                <span>Deskripsi About</span>
                <textarea
                  rows={7}
                  value={siteContent.aboutDescription || ""}
                  onChange={(event) =>
                    setSiteContent((previous) => ({
                      ...previous,
                      aboutDescription: event.target.value,
                    }))
                  }
                />
              </label>

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-content-save-button"
                  onClick={handleSaveContent}
                >
                  <Save size={17} /> Simpan Perubahan Konten
                </button>
              </div>
            </div>
          </section>
        )}

        {activeTab === "faq" && (
          <section className="admin-section">
            <div className="admin-page-heading">
              <div>
                <span className="admin-section-kicker">
                  CUSTOMER INFORMATION
                </span>
                <h2>Kelola FAQ</h2>
                <p>
                  Atur pertanyaan dan jawaban untuk pengunjung website.
                </p>
              </div>
            </div>

            <form className="admin-form" onSubmit={handleSaveFaq}>
              <div className="admin-form-heading">
                <div>
                  <h3>
                    {editingFaqId !== null ? "Edit Pertanyaan" : "Tambah Pertanyaan"}
                  </h3>
                  <p>
                    {editingFaqId !== null
                      ? "Perbarui pertanyaan dan jawaban FAQ."
                      : "Buat pertanyaan baru untuk pengunjung website."}
                  </p>
                </div>
              </div>

              <label className="admin-field admin-field-full">
                <span>Pertanyaan</span>
                <input
                  value={faqQuestion}
                  onChange={(event) => setFaqQuestion(event.target.value)}
                  placeholder="Masukkan pertanyaan..."
                  required
                />
              </label>

              <label className="admin-field admin-field-full">
                <span>Jawaban</span>
                <textarea
                  rows={4}
                  value={faqAnswer}
                  onChange={(event) => setFaqAnswer(event.target.value)}
                  placeholder="Masukkan jawaban..."
                  required
                />
              </label>

              <div className="admin-form-actions">
                {editingFaqId !== null && (
                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={handleCancelFaqEdit}
                    disabled={faqSaving}
                  >
                    Batal Edit
                  </button>
                )}

                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={faqSaving}
                >
                  {faqSaving
                    ? "Menyimpan..."
                    : editingFaqId !== null
                      ? "Simpan Perubahan"
                      : "➕ Tambah FAQ"}
                </button>
              </div>
            </form>

            <div className="admin-faq-list">
              {faqs.map((faq, index) => (
                <div
                  className="admin-faq-item"
                  key={faq.id ?? `${faq.question}-${index}`}
                >
                  <div className="admin-faq-content">
                    <strong>{faq.question}</strong>
                    <p>{faq.answer}</p>
                  </div>

                  <div className="admin-row-actions">
                    <button
                      type="button"
                      className="admin-table-action"
                      onClick={() => handleEditFaq(faq)}
                      disabled={faq.id == null || faqDeletingId !== null}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="admin-delete-button"
                      onClick={() => setFaqToDelete(faq)}
                      disabled={faq.id == null || faqDeletingId !== null}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}

              {faqs.length === 0 && (
                <div className="admin-empty">
                  Belum ada pertanyaan FAQ.
                </div>
              )}
            </div>

            {faqToDelete && (
              <div className="admin-confirm-overlay">
                <div
                  className="admin-confirm-dialog"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="faq-confirm-title"
                >
                  <div className="admin-confirm-icon">!</div>
                  <h3 id="faq-confirm-title">Konfirmasi Hapus FAQ</h3>
                  <p>Apakah kamu yakin ingin menghapus pertanyaan ini?</p>
                  <div className="admin-confirm-question">
                    {faqToDelete.question}
                  </div>
                  <div className="admin-confirm-actions">
                    <button
                      type="button"
                      className="admin-secondary-button"
                      onClick={() => setFaqToDelete(null)}
                      disabled={faqDeletingId !== null}
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      className="admin-delete-button"
                      onClick={handleDeleteFaq}
                      disabled={faqDeletingId !== null}
                    >
                      {faqDeletingId !== null ? "Menghapus..." : "Ya, Hapus"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        <footer className="admin-footer">
          © 2026 Gado-Gado Nusantara · Admin Dashboard
        </footer>
      </main>
    </div>
  );
}


