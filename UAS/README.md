# Gado-Gado Nusantara — Proyek UAS Pemrograman Front-End (Next.js)

Proyek ini merupakan hasil konversi proyek UTS **Gado-Gado Nusantara** (Kelompok 8) dari arsitektur statis (**HTML, CSS, dan jQuery**) menjadi aplikasi web modern berbasis **Next.js 14 (App Router) & TypeScript**:

1. **Instalasi Next.js**: Arsitektur project Next.js 14 App Router (`src/app`, `src/components`, `src/styles`, `src/data`, `src/types`, `public/images`).
2. **Next.js: Functional Component**: Dekomposisi halaman monolitik UTS menjadi 15+ komponen fungsional React/Next.js yang modular dan reusable.
3. **Next.js: Props & Children**: Penerapan komunikasi antar-komponen menggunakan TypeScript `Props` dan komposisi tata letak/kontainer menggunakan `children` (`React.ReactNode`).
4. **Modul Praktikum**: Mencakup navigasi halaman (`/`, `/about`), Dynamic Routing (`/menu/[slug]`), Global CSS (`globals.css`), Module CSS (`button.module.css`), serta API katalog menu (`/api/menus`).

---

## Struktur Folder Project (Poin 9)

```text
UAS/
├── public/
│   └── images/                     # Aset gambar 11 variasi Gado-Gado & Hero
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # RootLayout dengan prop { children }
│   │   ├── page.tsx                # Halaman utama Gado-Gado Nusantara
│   │   ├── globals.css             # Global CSS 
│   │   ├── not-found.tsx           # Halaman 404 kustom
│   │   ├── about/
│   │   │   └── page.tsx            # Halaman rute /about
│   │   ├── menu/
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Dynamic Route detail menu (/menu/[slug])
│   │   └── api/
│   │       └── menus/
│   │           └── route.ts        # Endpoint API katalog menu (/api/menus)
│   ├── components/                 # Functional Components 
│   │   ├── Header.tsx              # Navigasi utama, badge favorit, & menu mobile
│   │   ├── HeroSection.tsx         # Hero banner & StatBadge functional component
│   │   ├── IntroSection.tsx        # Seksi pengantar cerita kuliner
│   │   ├── MenuSection.tsx         # Pencarian, filter kategori, & grid menu
│   │   ├── MenuCard.tsx            # Kartu setiap variasi Gado-Gado
│   │   ├── ChoiceSection.tsx       # Daftar "Pilihan Saya"
│   │   ├── FavoriteSection.tsx     # Daftar "Yang Kamu Tandai ❤️"
│   │   ├── AboutSection.tsx        # Seksi tentang kami & FeatureCard
│   │   ├── FaqSection.tsx          # Daftar pertanyaan umum (FAQ)
│   │   ├── Footer.tsx              # Footer & akses panel Admin Konten
│   │   ├── DetailModal.tsx         # Modal detail menu lengkap
│   │   ├── AuthModal.tsx           # Modal Login & Register pengguna/admin
│   │   ├── ProfileModal.tsx        # Modal profil pengguna aktif
│   │   ├── AdminModal.tsx          # Modal pengelolaan konten & menu (Admin)
│   │   ├── Toast.tsx               # Notifikasi pop-up (Toast)
│   │   ├── Button.tsx              # Komponen tombol reusable (CSS Module + Props & Children)
│   │   ├── ModalWrapper.tsx        # Komponen pembungkus modal (Props & Children)
│   │   ├── SectionContainer.tsx    # Komponen pembungkus section (Props & Children)
│   │   └── SectionHeading.tsx      # Komponen judul section (Props & Children)
│   ├── styles/
│   │   └── button.module.css       # CSS Module untuk komponen Button 
│   ├── data/
│   │   └── gadoGadoData.ts         # Data 11 menu Gado-Gado Nusantara, FAQ, & akun Admin
│   └── types/
│       └── index.ts                # Definisi tipe data & interface Props/Children
├── package.json
├── tsconfig.json
└── next.config.mjs
```

---

## Cara Menjalankan Project

1. **Instal dependensi**:
   ```bash
   npm install
   ```

2. **Jalankan server development**:
   ```bash
   npm run dev
   ```

3. **Buka di browser**:
   Akses `http://localhost:3000`

4. **Akun Demo Admin** (untuk membuka fitur **⚙ Kelola Konten** di Footer):
   - **Username**: `admin`
   - **Password**: `admin123`
