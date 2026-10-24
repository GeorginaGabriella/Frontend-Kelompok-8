# Gado-Gado Nusantara

**Gado-Gado Nusantara** adalah aplikasi web katalog dan eksplorasi kuliner interaktif yang memperkenalkan keanekaragaman gado-gado khas dari berbagai daerah di Indonesia. Aplikasi ini dibangun dengan arsitektur web modern berbasis **Next.js** dan **TypeScript** dengan antarmuka yang responsif, interaktif, dan ramah pengguna.

---

## Fitur Utama

- **Katalog Menu Nusantara**: Menampilkan 11 variasi gado-gado autentik dari berbagai daerah seperti Betawi, Surabaya, Solo, Sunda, Padang, Bali, Malang, Cirebon, Bangka, hingga kreasi modern.
- **Pencarian & Filter Interaktif**: Cari menu berdasarkan nama atau saring berdasarkan kategori wilayah (Betawi, Sunda, Jawa, Lainnya).
- **Detail Menu & Rute Dinamis**: Menampilkan rincian bahan/komponen, kisaran harga, kondimen, manfaat nutrisi, serta tautan langsung lokasi di Google Maps.
- **Pilihan Saya**: Pengunjung dapat memilih menu-menu yang ingin dipesan atau dicatat dalam daftar pilihan terorganisir.
- **Favorit**: Tandai menu favorit menggunakan ikon hati untuk kemudahan akses sewaktu-waktu.
- **Sistem Autentikasi & Akun**: Dukungan login, registrasi akun pengguna baru, serta profil pengguna yang tersimpan di browser (*localStorage*).
- **Panel Admin Konten**: Pengelolaan deskripsi situs, data informasi menu, dan manajemen FAQ secara langsung.
- **Informasi Cuaca Daerah Kuliner**: Fitur pengecekan kondisi cuaca kota asal kuliner untuk memudahkan perencanaan wisata kuliner.

---

## Struktur Folder Proyek

```text
UAS/
├── public/
│   └── images/                     # Aset gambar katalog gado-gado & hero
├── src/
│   ├── app/                        # Direktori App Router
│   │   ├── layout.tsx              # Root Layout global
│   │   ├── page.tsx                # Halaman utama katalog
│   │   ├── actions.ts              # Server Action pencarian cuaca daerah
│   │   ├── globals.css             # Penataan gaya visual global
│   │   ├── not-found.tsx           # Halaman 404 kustom
│   │   ├── about/
│   │   │   └── page.tsx            # Halaman Tentang Gado-Gado Nusantara
│   │   ├── menu/
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Halaman rute dinamis detail menu
│   │   └── api/
│   │       └── menus/
│   │           └── route.ts        # Endpoint API data menu
│   ├── components/                 # Komponen antarmuka pengguna (UI)
│   ├── styles/                     # CSS Modules komponen
│   ├── data/                       # Data statis katalog & FAQ
│   └── types/                      # Definisi tipe data TypeScript
├── package.json
├── tsconfig.json
└── next.config.mjs
```

---

## Cara Menjalankan Proyek

1. **Pasang Dependensi**:
   ```bash
   npm install
   ```

2. **Jalankan Server Pengembangan**:
   ```bash
   npm run dev
   ```

3. **Buka di Peramban**:
   Akses `http://localhost:3000` (atau port yang ditunjukkan di terminal).

4. **Kredensial Demo Admin**:
   - **Username**: `admin`
   - **Password**: `admin123`
   *(Login dengan akun admin untuk mengakses tombol **⚙ Kelola Konten** pada bagian footer).*
