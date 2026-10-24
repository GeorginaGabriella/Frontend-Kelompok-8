import { FaqItem, MenuItem, SiteContent, UserAccount } from "@/types";

export const initialMenus: MenuItem[] = [
  {
    slug: "gado-gado-surabaya",
    name: "Gado-Gado Surabaya",
    searchName: "gado-gado surabaya",
    kategori: "surabaya",
    group: "lainnya",
    regionBadge: "SURABAYA",
    categoryLabel: "JAWA TIMUR",
    region: "SURABAYA",
    rating: "4.8",
    image: "/images/surabaya.png",
    shortDescription:
      "Sayuran segar dengan lontong, tahu, tempe, dan saus kacang yang khas.",
    description:
      "Sayuran segar dengan lontong, tahu, tempe, dan saus kacang yang khas. Gado-gado Surabaya menjadi salah satu variasi kuliner yang menarik untuk dikenali.",
    cardIngredients: ["🥬 Sayuran", "🥜 Kacang", "🍘 Lontong"],
    ingredients: ["🥬 Sayuran", "🥜 Saus Kacang", "🍘 Lontong", "🍢 Tahu", "🌱 Tauge"],
    price: "Rp 15.000–25.000",
    location: "Surabaya, Jawa Timur",
    city: "Surabaya",
    condiments: "Bumbu kacang, bawang putih, cabai, petis, jeruk limau",
    benefits:
      "Sayuran menyediakan serat; kacang dan tahu menyumbang protein nabati.",
  },
  {
    slug: "gado-gado-sederhana",
    name: "Gado-Gado Sederhana",
    searchName: "gado-gado sederhana",
    kategori: "sederhana",
    group: "lainnya",
    regionBadge: "NUSANTARA",
    categoryLabel: "TRADISIONAL",
    region: "NUSANTARA",
    rating: "4.7",
    image: "/images/sederhana.png",
    shortDescription:
      "Pilihan sederhana dengan sayuran rebus, tahu, tempe, dan saus kacang.",
    description:
      "Pilihan gado-gado sederhana dengan bahan yang mudah ditemukan seperti sayuran rebus, tahu, tempe, dan saus kacang.",
    cardIngredients: ["🥬 Sayuran", "🥜 Kacang", "🍘 Tahu"],
    ingredients: ["🥬 Sayuran", "🥜 Saus Kacang", "🍘 Tahu", "🍢 Tempe"],
    price: "Rp 12.000–20.000",
    location: "Jakarta dan kota-kota Indonesia",
    city: "Jakarta",
    condiments: "Bumbu kacang, bawang putih, cabai, gula merah, air asam jawa",
    benefits:
      "Sayuran beragam memberi serat dan mikronutrien; tahu atau tempe menambah protein nabati.",
  },
  {
    slug: "gado-gado-fusilli",
    name: "Gado-Gado Fusilli",
    searchName: "resep gado-gado fusilli",
    kategori: "fusilli",
    group: "lainnya",
    regionBadge: "MODERN",
    categoryLabel: "KREASI",
    region: "KREASI MODERN",
    rating: "4.6",
    image: "/images/fusilli.png",
    shortDescription:
      "Kreasi gado-gado dengan tambahan pasta fusilli yang memberikan sensasi berbeda.",
    description:
      "Kreasi gado-gado dengan tambahan pasta fusilli. Perpaduan kuliner tradisional dan sentuhan modern.",
    cardIngredients: ["🥬 Sayuran", "🥜 Kacang", "🍝 Fusilli"],
    ingredients: ["🥬 Sayuran", "🥜 Saus Kacang", "🍝 Fusilli", "🥚 Telur"],
    price: "Rp 20.000–32.000",
    location: "Kawasan kuliner modern di kota besar",
    city: "Jakarta",
    condiments: "Bumbu kacang, bawang putih, cabai, kecap manis, jeruk limau",
    benefits:
      "Sayuran memberi serat, sementara fusilli menjadi sumber energi dari karbohidrat.",
  },
  {
    slug: "gado-gado-malang",
    name: "Gado-Gado Malang",
    searchName: "gado-gado malang",
    kategori: "malang",
    group: "lainnya",
    regionBadge: "MALANG",
    categoryLabel: "JAWA TIMUR",
    region: "MALANG",
    rating: "4.8",
    image: "/images/malang.png",
    shortDescription:
      "Perpaduan sayuran, tahu, tempe, dan bahan pelengkap dengan karakter khas Malang.",
    description:
      "Perpaduan sayuran, tahu, tempe, dan bahan pelengkap dengan karakter khas Malang.",
    cardIngredients: ["🥬 Sayuran", "🍘 Tahu", "🥜 Kacang"],
    ingredients: ["🥬 Sayuran", "🍘 Tahu", "🥜 Saus Kacang", "🥚 Telur"],
    price: "Rp 15.000–25.000",
    location: "Malang, Jawa Timur",
    city: "Malang",
    condiments: "Bumbu kacang, bawang putih, cabai, gula merah, air asam jawa",
    benefits:
      "Sayuran menyumbang serat dan tahu atau tempe menyediakan protein nabati.",
  },
  {
    slug: "gado-gado-betawi",
    name: "Gado-Gado Betawi",
    searchName: "gado-gado betawi",
    kategori: "betawi",
    group: "betawi",
    regionBadge: "BETAWI",
    categoryLabel: "JAKARTA",
    region: "BETAWI",
    rating: "4.9",
    image: "/images/betawi.png",
    shortDescription:
      "Sayuran segar dengan lontong, tahu, tempe, telur, dan saus kacang khas Betawi.",
    description:
      "Gado-gado dengan sayuran segar, lontong, tahu, tempe, telur, dan saus kacang yang menjadi bagian dari kuliner khas Betawi.",
    cardIngredients: ["🥬 Sayuran", "🥚 Telur", "🥜 Kacang"],
    ingredients: ["🥬 Sayuran", "🥚 Telur", "🥜 Saus Kacang", "🍘 Lontong", "🍢 Tahu"],
    price: "Rp 18.000–30.000",
    location: "Pasar Santa dan kawasan kuliner Jakarta",
    city: "Jakarta",
    condiments: "Bumbu kacang, bawang putih, cabai, gula merah, air asam jawa",
    benefits: "Sayuran menyediakan serat; telur dan kacang menyumbang protein.",
  },
  {
    slug: "gado-gado-ayam-cirebon",
    name: "Gado-Gado Ayam Cirebon",
    searchName: "gado-gado ayam cirebon",
    kategori: "cirebon",
    group: "lainnya",
    regionBadge: "CIREBON",
    categoryLabel: "JAWA BARAT",
    region: "CIREBON",
    rating: "4.7",
    image: "/images/cirebon.png",
    shortDescription:
      "Gado-gado dengan tambahan ayam sebagai pelengkap protein.",
    description:
      "Gado-gado dengan tambahan ayam sebagai sumber protein dan pelengkap hidangan.",
    cardIngredients: ["🥬 Sayuran", "🍗 Ayam", "🥜 Kacang"],
    ingredients: ["🥬 Sayuran", "🍗 Ayam", "🥜 Saus Kacang", "🥚 Telur"],
    price: "Rp 20.000–32.000",
    location: "Cirebon, Jawa Barat",
    city: "Cirebon",
    condiments: "Bumbu kacang, bawang putih, cabai, kecap manis, jeruk limau",
    benefits: "Sayuran memberi serat dan ayam menjadi sumber protein hewani.",
  },
  {
    slug: "gado-gado-solo",
    name: "Gado-Gado Solo",
    searchName: "gado-gado solo",
    kategori: "jawa",
    group: "jawa",
    regionBadge: "SOLO",
    categoryLabel: "JAWA TENGAH",
    region: "SOLO",
    rating: "4.8",
    image: "/images/solo.png",
    shortDescription:
      "Hidangan sayuran dengan karakter rasa yang khas dari daerah Solo.",
    description:
      "Hidangan sayuran dengan karakter rasa yang khas dari daerah Solo dan berbagai bahan pelengkap.",
    cardIngredients: ["🥬 Sayuran", "🥜 Kacang", "🍘 Lontong"],
    ingredients: ["🥬 Sayuran", "🥜 Saus Kacang", "🍘 Lontong", "🍢 Tahu"],
    price: "Rp 15.000–25.000",
    location: "Solo, Jawa Tengah",
    city: "Surakarta",
    condiments: "Bumbu kacang, bawang putih, cabai, gula merah, air asam jawa",
    benefits:
      "Sayuran memberi serat; kacang dan tahu menyumbang protein nabati.",
  },
  {
    slug: "gado-gado-bangka",
    name: "Gado-Gado Bangka",
    searchName: "gado-gado bangka",
    kategori: "bangka",
    group: "lainnya",
    regionBadge: "BANGKA",
    categoryLabel: "SUMATRA",
    region: "BANGKA",
    rating: "4.6",
    image: "/images/bangka.png",
    shortDescription:
      "Variasi gado-gado dengan cita rasa daerah Bangka yang khas.",
    description:
      "Variasi gado-gado dengan cita rasa daerah Bangka yang menggunakan berbagai bahan pelengkap.",
    cardIngredients: ["🥬 Sayuran", "🥜 Kacang", "🍘 Tahu"],
    ingredients: ["🥬 Sayuran", "🥜 Saus Kacang", "🍘 Tahu", "🌱 Tauge"],
    price: "Rp 15.000–25.000",
    location: "Pangkalpinang dan wilayah Bangka Belitung",
    city: "Pangkalpinang",
    condiments: "Bumbu kacang, bawang putih, cabai, gula merah, jeruk kunci",
    benefits:
      "Sayuran menyediakan serat dan kacang menjadi sumber protein nabati.",
  },
  {
    slug: "gado-gado-padang",
    name: "Gado-Gado Padang",
    searchName: "gado-gado padang",
    kategori: "padang",
    group: "lainnya",
    regionBadge: "PADANG",
    categoryLabel: "SUMATRA BARAT",
    region: "PADANG",
    rating: "4.7",
    image: "/images/padang.png",
    shortDescription:
      "Perpaduan sayuran dengan karakter bumbu yang terinspirasi dari cita rasa Padang.",
    description:
      "Perpaduan sayuran dengan karakter bumbu yang terinspirasi dari cita rasa Padang.",
    cardIngredients: ["🥬 Sayuran", "🥜 Kacang", "🌶️ Bumbu"],
    ingredients: ["🥬 Sayuran", "🥜 Saus Kacang", "🌶️ Bumbu", "🍘 Tahu"],
    price: "Rp 15.000–27.000",
    location: "Padang, Sumatra Barat",
    city: "Padang",
    condiments: "Bumbu kacang, bawang putih, cabai, jeruk nipis, rempah",
    benefits:
      "Sayuran menyumbang serat; kacang dan tahu menambah protein nabati.",
  },
  {
    slug: "gado-gado-khas-bali",
    name: "Gado-Gado Khas Bali",
    searchName: "gado-gado khas bali",
    kategori: "bali",
    group: "lainnya",
    regionBadge: "BALI",
    categoryLabel: "BALI",
    region: "BALI",
    rating: "4.8",
    image: "/images/bali.png",
    shortDescription:
      "Kreasi gado-gado dengan sentuhan bahan dan cita rasa khas Bali.",
    description:
      "Kreasi gado-gado dengan sentuhan bahan dan cita rasa khas Bali serta berbagai komponen sayuran.",
    cardIngredients: ["🥬 Sayuran", "🥜 Kacang", "🌿 Rempah"],
    ingredients: ["🥬 Sayuran", "🥜 Saus Kacang", "🌿 Rempah", "🍘 Tahu"],
    price: "Rp 18.000–30.000",
    location: "Denpasar dan kawasan kuliner Bali",
    city: "Denpasar",
    condiments: "Bumbu kacang, bawang putih, cabai, kencur, jeruk limau",
    benefits:
      "Sayuran memberi serat dan rempah memberi karakter rasa tanpa mengubah manfaat dasarnya.",
  },
  {
    slug: "gado-gado-sunda",
    name: "Gado-Gado Sunda",
    searchName: "gado-gado sunda",
    kategori: "sunda",
    group: "sunda",
    regionBadge: "SUNDA",
    categoryLabel: "JAWA BARAT",
    region: "SUNDA",
    rating: "4.8",
    image: "/images/sunda.png",
    shortDescription:
      "Perpaduan sayuran segar dan bumbu kacang dengan karakter khas Sunda.",
    description:
      "Perpaduan sayuran segar dan bumbu kacang dengan karakter khas Sunda.",
    cardIngredients: ["🥬 Sayuran", "🥜 Kacang", "🌿 Lalapan"],
    ingredients: ["🥬 Sayuran", "🥜 Saus Kacang", "🌿 Lalapan", "🍘 Tahu"],
    price: "Rp 15.000–25.000",
    location: "Bandung dan wilayah Jawa Barat",
    city: "Bandung",
    condiments: "Bumbu kacang, bawang putih, cabai, kencur, jeruk limau",
    benefits:
      "Sayuran segar memberi serat; kacang dan tahu menyumbang protein nabati.",
  },
];

export const defaultSiteContent: SiteContent = {
  heroDescription:
    "Temukan berbagai macam gado-gado dari berbagai daerah di Indonesia dengan cita rasa, bahan, dan keunikan yang berbeda.",
  aboutDescription:
    "Gado-Gado Nusantara merupakan website katalog interaktif yang memperkenalkan berbagai pilihan gado-gado dari beberapa daerah di Indonesia.",
};

export const defaultFaqs: FaqItem[] = [
  {
    question: "Apa itu gado-gado?",
    answer:
      "Gado-gado adalah hidangan Indonesia berisi sayuran dan pelengkap yang disajikan dengan saus kacang.",
  },
  {
    question: "Berapa kisaran harga satu porsi?",
    answer:
      "Harga bervariasi menurut daerah dan pelengkap. Lihat kisaran indikatif pada detail masing-masing menu.",
  },
  {
    question: "Bagaimana mencari penjual di dekat saya?",
    answer:
      "Buka detail menu dan pilih tombol lokasi untuk melihat hasil pencarian penjual di Google Maps.",
  },
];

export const adminAccount: UserAccount = {
  name: "Administrator",
  username: "admin",
  password: "admin123",
  role: "admin",
};

export function getMenuBySlug(slug: string): MenuItem | undefined {
  return initialMenus.find((item) => item.slug === slug);
}
