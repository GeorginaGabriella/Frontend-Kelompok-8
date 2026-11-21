
import {
  DiscountCodeSeed,
  FaqItem,
  MenuItem,
  PromoSlide,
  SiteContent,
  UserAccount,
} from "@/types";

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
    group: "lainnya",
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
    group: "lainnya",
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
    group: "lainnya",
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

  // MENU SAMPINGAN: MINUMAN DAN DESSERT

  {
    slug: "es-cendol",
    name: "Es Cendol",
    searchName: "es cendol",
    kategori: "minuman-tradisional",
    group: "dessert",
    regionBadge: "NUSANTARA",
    categoryLabel: "DESSERT",
    region: "JAWA BARAT",
    rating: "4.9",
    image: "/images/cendol.png",
    shortDescription:
      "Minuman segar berisi buliran cendol pandan, santan gurih, dan sirup gula merah.",
    description:
      "Es cendol adalah minuman penutup tradisional khas Indonesia yang terbuat dari tepung beras beraroma pandan, disajikan dengan santan segar dan gula aren cair.",
    cardIngredients: ["🍃 Pandan", "🥥 Santan", "🍯 Gula Merah"],
    ingredients: ["🍃 Cendol Pandan", "🥥 Santan", "🍯 Gula Aren", "🧊 Es Batu"],
    price: "Rp 8.000–15.000",
    location: "Bandung dan berbagai kota di Indonesia",
    city: "Bandung",
    condiments: "Sirup gula merah, santan matang, daun pandan, es serut",
    benefits:
      "Memberikan kesegaran instan dan sumber energi cepat dari gula aren alami.",
  },
  {
    slug: "es-teler",
    name: "Es Teler",
    searchName: "es teler",
    kategori: "minuman-tradisional",
    group: "dessert",
    regionBadge: "NUSANTARA",
    categoryLabel: "DESSERT",
    region: "JAWA TENGAH",
    rating: "4.8",
    image: "/images/es-teler.png",
    shortDescription:
      "Perpaduan alpukat, kelapa muda, dan nangka dengan kuah santan manis.",
    description:
      "Es teler merupakan koktail buah khas Indonesia berisi potongan alpukat mentega, daging kelapa muda, dan nangka harum yang disiram santan dan kental manis.",
    cardIngredients: ["🥑 Alpukat", "🥥 Kelapa", "🍈 Nangka"],
    ingredients: ["🥑 Alpukat", "🥥 Kelapa Muda", "🍈 Nangka", "🥛 Kental Manis", "🧊 Es Serut"],
    price: "Rp 12.000–20.000",
    location: "Sukoharjo, Jakarta, dan seluruh Indonesia",
    city: "Jakarta",
    condiments: "Santan, kental manis, sirup gula, es serut",
    benefits:
      "Alpukat menyediakan lemak sehat dan serat, sementara air kelapa membantu hidrasi.",
  },
  {
    slug: "es-doger",
    name: "Es Doger",
    searchName: "es doger",
    kategori: "minuman-tradisional",
    group: "dessert",
    regionBadge: "CIREBON",
    categoryLabel: "DESSERT",
    region: "JAWA BARAT",
    rating: "4.7",
    image: "/images/es-doger.png",
    shortDescription:
      "Es serut santan merah muda dengan isian tape singkong, ketan hitam, dan pacar cina.",
    description:
      "Es doger adalah minuman es serut berbasis santan beraroma coco pandan dari Cirebon/Bandung yang dilengkapi tape singkong, ketan hitam, dan roti tawar.",
    cardIngredients: ["🥥 Santan", "🍚 Ketan Hitam", "🍠 Tape"],
    ingredients: ["🥥 Es Santan", "🍚 Ketan Hitam", "🍠 Tape Singkong", "🔴 Pacar Cina", "🍞 Roti Tawar"],
    price: "Rp 10.000–18.000",
    location: "Cirebon, Bandung, dan Jakarta",
    city: "Cirebon",
    condiments: "Sirup merah coco pandan, santan, kental manis",
    benefits:
      "Tape dan ketan hitam mengandung karbohidrat serta hasil fermentasi tradisional.",
  },
  {
    slug: "kue-pukis",
    name: "Kue Pukis",
    searchName: "kue pukis",
    kategori: "dessert",
    group: "dessert",
    regionBadge: "BANYUMAS",
    categoryLabel: "DESSERT",
    region: "JAWA TENGAH",
    rating: "4.8",
    image: "/images/kue-pukis.png",
    shortDescription:
      "Kue panggang lembut berbentuk setengah bulan dengan taburan cokelat dan keju.",
    description:
      "Kue pukis dibuat dari adonan tepung terigu, telur, ragi, dan santan yang dipanggang dalam cetakan khusus hingga empuk dengan berbagai topping manis.",
    cardIngredients: ["🌾 Terigu", "🥥 Santan", "🧀 Keju"],
    ingredients: ["🌾 Tepung Terigu", "🥚 Telur", "🥥 Santan", "🍫 Meses", "🧀 Keju Parut"],
    price: "Rp 10.000–20.000",
    location: "Banyumas dan jajanan pasar di seluruh Indonesia",
    city: "Banyumas",
    condiments: "Meses cokelat, keju parut, selai, kental manis",
    benefits:
      "Menjadi camilan mengenyangkan yang kaya karbohidrat sebagai pendamping minum teh.",
  },
  {
    slug: "kue-putu",
    name: "Kue Putu",
    searchName: "kue putu",
    kategori: "dessert",
    group: "dessert",
    regionBadge: "NUSANTARA",
    categoryLabel: "DESSERT",
    region: "JAWA",
    rating: "4.8",
    image: "/images/kue-putu.png",
    shortDescription:
      "Kue kukus tepung beras beraroma pandan dengan isian gula merah lumer dan kelapa parut.",
    description:
      "Kue putu adalah kue tradisional yang dikukus di dalam tabung bambu, berisi lelehan gula merah di tengahnya dan disajikan hangat bersama taburan kelapa parut gurih.",
    cardIngredients: ["🍚 Tepung Beras", "🍯 Gula Merah", "🥥 Kelapa"],
    ingredients: ["🍚 Tepung Beras", "🍃 Daun Pandan", "🍯 Gula Merah", "🥥 Kelapa Parut"],
    price: "Rp 8.000–15.000",
    location: "Penjual keliling dan pasar tradisional di Indonesia",
    city: "Jakarta",
    condiments: "Kelapa parut kukus dengan sedikit garam",
    benefits:
      "Dikukus tanpa minyak sehingga lebih ringan dengan rasa manis alami dari gula merah.",
  },
  {
    slug: "kue-onde",
    name: "Kue Onde-Onde",
    searchName: "kue onde onde",
    kategori: "dessert",
    group: "dessert",
    regionBadge: "MOJOKERTO",
    categoryLabel: "DESSERT",
    region: "JAWA TIMUR",
    rating: "4.8",
    image: "/images/kue-onde.png",
    shortDescription:
      "Bola ketan goreng berbalut biji wijen renyah dengan isian pasta kacang hijau manis.",
    description:
      "Onde-onde terbuat dari adonan tepung ketan yang digoreng keemasan dengan lapisan biji wijen di luar dan isian kacang hijau kupas yang lembut di dalam.",
    cardIngredients: ["🌾 Tepung Ketan", "🫘 Kacang Hijau", "🌰 Wijen"],
    ingredients: ["🌾 Tepung Ketan", "🫘 Kacang Hijau", "🌰 Biji Wijen", "🍬 Gula"],
    price: "Rp 10.000–18.000",
    location: "Mojokerto dan toko kue tradisional",
    city: "Mojokerto",
    condiments: "Taburan biji wijen sangrai",
    benefits:
      "Kacang hijau di dalamnya menyumbang protein nabati serta serat.",
  },
  {
    slug: "wedang-ronde",
    name: "Ronde",
    searchName: "wedang ronde",
    kategori: "dessert",
    group: "dessert",
    regionBadge: "SALATIGA",
    categoryLabel: "DESSERT",
    region: "JAWA TENGAH",
    rating: "4.9",
    image: "/images/ronde.png",
    shortDescription:
      "Bola ketan isi kacang tanah tumbuk yang disajikan dalam kuah jahe hangat.",
    description:
      "Ronde adalah hidangan penutup hangat berupa bulatan tepung ketan kenyal berisi kacang sangrai manis yang disiram kuah jahe, serai, dan kolang-kaling.",
    cardIngredients: ["🫚 Jahe", "🌾 Tepung Ketan", "🥜 Kacang"],
    ingredients: ["🫚 Kuah Jahe", "🌾 Bola Ketan", "🥜 Kacang Tanah", "🌴 Kolang-Kaling", "🍞 Roti Tawar"],
    price: "Rp 10.000–18.000",
    location: "Salatiga, Yogyakarta, dan Bandung",
    city: "Salatiga",
    condiments: "Jahe bakar, serai, gula batu atau gula merah",
    benefits:
      "Kuah jahe hangat membantu menghangatkan tubuh dan menenangkan tenggorokan.",
  },
  {
    slug: "kue-balok",
    name: "Kue Balok",
    searchName: "kue balok",
    kategori: "dessert",
    group: "dessert",
    regionBadge: "BANDUNG",
    categoryLabel: "DESSERT",
    region: "JAWA BARAT",
    rating: "4.8",
    image: "/images/kue-balok.png",
    shortDescription:
      "Kue padat berbentuk balok khas Jawa Barat dengan bagian tengah cokelat lumer.",
    description:
      "Kue balok merupakan jajanan klasik khas Bandung dan Garut berbentuk persegi panjang tebal dengan tekstur luar lembut dan isian cokelat lumer di bagian dalam.",
    cardIngredients: ["🍫 Cokelat", "🌾 Terigu", "🥚 Telur"],
    ingredients: ["🌾 Tepung Terigu", "🍫 Cokelat Lumer", "🥚 Telur", "🧈 Mentega", "🍬 Gula"],
    price: "Rp 15.000–25.000",
    location: "Bandung dan Garut, Jawa Barat",
    city: "Bandung",
    condiments: "Saus cokelat lumer, keju, atau taburan gula",
    benefits:
      "Memberikan asupan energi tinggi dan cita rasa cokelat pekat sebagai hidangan penutup.",
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
  {
    question: "Bagaimana cara memesan lewat website ini?",
    answer:
      "Tekan tombol Keranjang pada menu yang kamu mau, buka ikon keranjang di kanan atas, isi alamat pengiriman, lalu tekan Buat Pesanan.",
  },
  {
    question: "Apakah ada kode diskon yang bisa dipakai?",
    answer:
      "Ada. Coba NUSANTARA20 (diskon 20%), GADOGADO10 (diskon 10%), CAMILAN5K (potongan Rp 5.000), atau GRATISONGKIR untuk bebas ongkir di atas Rp 100.000.",
  },
  {
    question: "Berapa ongkos kirimnya?",
    answer:
      "Ongkos kirim Rp 10.000 untuk semua area dan otomatis menjadi Rp 0 bila total pesanan sudah melewati Rp 100.000.",
  },
  {
    question: "Di mana saya bisa menyampaikan komentar atau keluhan?",
    answer:
      "Buka bagian Customer Service di halaman utama. Semua pengunjung bisa menulis komentar dan tim kami akan membalas langsung di sana.",
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

export const SIDE_MENU_GROUPS: ReadonlyArray<MenuItem["group"]> = [
  "dessert",
];

export function isSideMenu(menu: MenuItem): boolean {
  return SIDE_MENU_GROUPS.includes(menu.group);
}

export function getMainMenus(menus: MenuItem[]): MenuItem[] {
  return menus.filter((menu) => !isSideMenu(menu));
}

export function getSideMenus(menus: MenuItem[]): MenuItem[] {
  return menus.filter((menu) => isSideMenu(menu));
}


export const promoSlides: PromoSlide[] = [
  {
    id: "promo-ongkir",
    eyebrow: "GRATIS ONGKIR",
    title: "Ongkir Rp 0 untuk pesanan di atas Rp 100.000",
    description:
      "Pesan gado-gado favoritmu sekaligus menu sampingan, ongkos kirim langsung hilang di keranjang.",
    code: "GRATISONGKIR",
    ctaLabel: "Pesan Sekarang",
    image: "/images/hero1.png",
    accent: "emerald",
  },
  {
    id: "promo-diskon",
    eyebrow: "DISKON 20%",
    title: "Hemat 20% untuk paket Gado-Gado + Es Tradisional",
    description:
      "Pakai kode NUSANTARA20 saat checkout dan nikmati satu porsi gado-gado dengan es cendol atau es teler.",
    code: "NUSANTARA20",
    ctaLabel: "Ambil Promo",
    image: "/images/cendol.png",
    accent: "gold",
  },
  {
    id: "promo-camilan",
    eyebrow: "MENU SAMPINGAN BARU",
    title: "Kue tradisional baru: Putu, Onde-Onde, Ronde & Kue Balok",
    description:
      "Lengkapi pesananmu dengan camilan pasar legendaris yang baru masuk katalog Gado-Gado Nusantara.",
    code: "CAMILAN5K",
    ctaLabel: "Lihat Menu Sampingan",
    image: "/images/kue-putu.png",
    accent: "clove",
  },
  {
    id: "promo-ronde",
    eyebrow: "SPESIAL HARI HUJAN",
    title: "Wedang Ronde hangat, potongan Rp 5.000",
    description:
      "Kuah jahe, kacang tumbuk, dan kolang-kaling — penghangat paling pas setelah seporsi gado-gado.",
    code: "CAMILAN5K",
    ctaLabel: "Tambah ke Keranjang",
    image: "/images/ronde.png",
    accent: "ember",
  },
];


export const defaultDiscountCodes: DiscountCodeSeed[] = [
  {
    code: "NUSANTARA20",
    label: "Diskon 20% seluruh menu",
    type: "percent",
    value: 20,
    minSpend: 30000,
    maxDiscount: 25000,
    freeShipping: false,
  },
  {
    code: "GADOGADO10",
    label: "Diskon 10% tanpa minimum",
    type: "percent",
    value: 10,
    minSpend: 0,
    maxDiscount: 15000,
    freeShipping: false,
  },
  {
    code: "CAMILAN5K",
    label: "Potongan Rp 5.000 untuk menu sampingan",
    type: "amount",
    value: 5000,
    minSpend: 20000,
    maxDiscount: 0,
    freeShipping: false,
  },
  {
    code: "GRATISONGKIR",
    label: "Bebas ongkos kirim",
    type: "shipping",
    value: 0,
    minSpend: 100000,
    maxDiscount: 0,
    freeShipping: true,
  },
];
