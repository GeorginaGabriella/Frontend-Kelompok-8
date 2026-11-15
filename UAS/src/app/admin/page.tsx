"use client";

import "./admin.css";

import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { MenuItem, FaqItem, SiteContent } from "@/types";

type TabType = "overview" | "menus" | "content" | "faq";

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

type AdminUser = {
  id?: number;
  name: string;
  username: string;
  role: string;
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
  const [users, setUsers] = useState<AdminUser[]>([]);
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
        authResponse,
        faqResponse,
        contentResponse,
      ] = await Promise.all([
        fetch("/api/menus"),
        fetch("/api/auth"),
        fetch("/api/faqs"),
        fetch("/api/content"),
      ]);

      if (
        !menuResponse.ok ||
        !authResponse.ok ||
        !faqResponse.ok ||
        !contentResponse.ok
      ) {
        throw new Error("Gagal mengambil data dashboard.");
      }

      const menuData = await menuResponse.json();
      const authData = await authResponse.json();
      const faqData = await faqResponse.json();
      const contentData = await contentResponse.json();

      setMenus(menuData.menus || []);
      setUsers(authData.users || []);
      setFaqs(faqData.faqs || []);

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

  const handleAddFaq = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!faqQuestion.trim() || !faqAnswer.trim()) {
      notify(
        "Pertanyaan dan jawaban FAQ wajib diisi.",
        true
      );
      return;
    }

    try {
      const response = await fetch("/api/faqs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: faqQuestion.trim(),
          answer: faqAnswer.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Gagal menambahkan FAQ."
        );
      }

      setFaqQuestion("");
      setFaqAnswer("");

      notify("FAQ berhasil ditambahkan.");
      await loadDashboard();
    } catch (error) {
      notify(
        error instanceof Error
          ? error.message
          : "Gagal menambahkan FAQ.",
        true
      );
    }
  };

  const handleDeleteFaq = async (faq: FaqItem) => {
    const confirmed = window.confirm(
      "Yakin ingin menghapus pertanyaan FAQ ini?"
    );

    if (!confirmed) return;

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Gagal menghapus FAQ."
        );
      }

      notify("FAQ berhasil dihapus.");
      await loadDashboard();
    } catch (error) {
      notify(
        error instanceof Error
          ? error.message
          : "Gagal menghapus FAQ.",
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
          <span className="admin-brand-icon">🍽️</span>
          <span>
            <strong>Gado-Gado</strong>
            <small>NUSANTARA ADMIN</small>
          </span>
        </Link>

        <div className="admin-sidebar-label">
          MENU UTAMA
        </div>

        <nav className="admin-navigation">
          <button
            type="button"
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            <span>📊</span>
            Overview
          </button>

          <button
            type="button"
            className={activeTab === "menus" ? "active" : ""}
            onClick={() => setActiveTab("menus")}
          >
            <span>🍽️</span>
            Kelola Menu
            <span className="admin-nav-count">
              {menus.length}
            </span>
          </button>

          <button
            type="button"
            className={activeTab === "content" ? "active" : ""}
            onClick={() => setActiveTab("content")}
          >
            <span>📝</span>
            Konten Website
          </button>

          <button
            type="button"
            className={activeTab === "faq" ? "active" : ""}
            onClick={() => setActiveTab("faq")}
          >
            <span>❓</span>
            Kelola FAQ
            <span className="admin-nav-count">
              {faqs.length}
            </span>
          </button>
        </nav>

        <div className="admin-sidebar-bottom">
          <Link href="/" className="admin-back-link">
            <span>🏠</span>
            Lihat Website
          </Link>

          <button
            type="button"
            className="admin-logout"
            onClick={handleLogout}
          >
            <span>🚪</span>
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
          <section className="admin-section">
            <div className="admin-welcome">
              <div>
                <span className="admin-eyebrow">
                  ADMINISTRATOR PANEL
                </span>

                <h2>
                  Selamat datang, {adminName}!
                </h2>

                <p>
                  Kelola informasi kuliner Nusantara dan
                  konten website Gado-Gado Nusantara
                  dengan mudah melalui dashboard ini.
                </p>

                <button
                  type="button"
                  className="admin-welcome-button"
                  onClick={openCreateForm}
                >
                  + Tambahkan Menu
                </button>
              </div>

              <div className="admin-welcome-icon">
                🥗
              </div>
            </div>

            <div className="admin-stat-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <div className="admin-stat-icon menu-icon">
                    🍽️
                  </div>
                  <span className="admin-stat-label">
                    MENU
                  </span>
                </div>
                <span>Total Menu</span>
                <strong>{menus.length}</strong>
                <small>Menu tersedia di website</small>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <div className="admin-stat-icon user-icon">
                    👤
                  </div>
                  <span className="admin-stat-label">
                    USER
                  </span>
                </div>
                <span>Total Pengguna</span>
                <strong>{users.length}</strong>
                <small>Akun terdaftar</small>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <div className="admin-stat-icon faq-icon">
                    ❓
                  </div>
                  <span className="admin-stat-label">
                    FAQ
                  </span>
                </div>
                <span>Total FAQ</span>
                <strong>{faqs.length}</strong>
                <small>Pertanyaan website</small>
              </div>
            </div>

            <div className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <span className="admin-section-kicker">
                    DATABASE
                  </span>
                  <h3>Menu Terbaru</h3>
                  <p>
                    Daftar menu yang tersimpan di database.
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
                      {menus.slice(0, 5).map((menu) => (
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
                          <td>{menu.price}</td>

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
                    ×
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
                      <option value="tradisional">Tradisional</option>
                      <option value="modern">Modern</option>
                      <option value="daerah">Daerah</option>
                    </select>
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
                  <h3>Semua Menu ({menus.length})</h3>
                  <p>
                    Data menu yang tersimpan di database SQLite.
                  </p>
                </div>
              </div>

              {menus.length === 0 ? (
                <div className="admin-empty">
                  Belum ada menu yang tersedia.
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
                      {menus.map((menu) => (
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
                  className="admin-primary-button"
                  onClick={handleSaveContent}
                >
                  💾 Simpan Konten
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

            <form
              className="admin-form"
              onSubmit={handleAddFaq}
            >
              <div className="admin-form-heading">
                <div>
                  <h3>Tambah Pertanyaan</h3>
                  <p>
                    Buat pertanyaan baru untuk pengunjung website.
                  </p>
                </div>
              </div>

              <label className="admin-field admin-field-full">
                <span>Pertanyaan</span>
                <input
                  value={faqQuestion}
                  onChange={(event) =>
                    setFaqQuestion(event.target.value)
                  }
                  placeholder="Masukkan pertanyaan..."
                  required
                />
              </label>

              <label className="admin-field admin-field-full">
                <span>Jawaban</span>
                <textarea
                  rows={4}
                  value={faqAnswer}
                  onChange={(event) =>
                    setFaqAnswer(event.target.value)
                  }
                  placeholder="Masukkan jawaban..."
                  required
                />
              </label>

              <div className="admin-form-actions">
                <button
                  type="submit"
                  className="admin-primary-button"
                >
                  ➕ Tambah FAQ
                </button>
              </div>
            </form>

            <div className="admin-faq-list">
              {faqs.map((faq, index) => (
                <div
                  className="admin-faq-item"
                  key={`${faq.question}-${index}`}
                >
                  <div>
                    <strong>{faq.question}</strong>
                    <p>{faq.answer}</p>
                  </div>

                  <button
                    type="button"
                    className="admin-delete-button"
                    onClick={() => handleDeleteFaq(faq)}
                  >
                    🗑️ Hapus
                  </button>
                </div>
              ))}

              {faqs.length === 0 && (
                <div className="admin-empty">
                  Belum ada pertanyaan FAQ.
                </div>
              )}
            </div>
          </section>
        )}

        <footer className="admin-footer">
          © 2026 Gado-Gado Nusantara · Admin Dashboard
        </footer>
      </main>
    </div>
  );
}
