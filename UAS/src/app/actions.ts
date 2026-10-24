"use server";

import { WeatherData } from "@/types/weather";

const fallbackCityProfiles: Record<string, WeatherData> = {
  jakarta: {
    name: "Jakarta",
    region: "DKI JAKARTA — ASAL GADO-GADO BETAWI",
    main: { temp: 31, feels_like: 34, humidity: 72 },
    weather: [{ main: "Clouds", description: "cerah berawan", icon: "02d" }],
    wind: { speed: 3.4 },
    culinaryRecommendation:
      "Cuaca hangat Jakarta sangat pas dinikmati bersama Gado-Gado Betawi atau Gado-Gado Sederhana dengan saus kacang segar.",
    source: "nusantara-fallback",
  },
  surabaya: {
    name: "Surabaya",
    region: "JAWA TIMUR — ASAL GADO-GADO SURABAYA",
    main: { temp: 33, feels_like: 36, humidity: 68 },
    weather: [{ main: "Clear", description: "cerah terik", icon: "01d" }],
    wind: { speed: 4.1 },
    culinaryRecommendation:
      "Siang yang cerah di Surabaya paling cocok menyantap Gado-Gado Surabaya lengkap dengan lontong dan kerupuk udang.",
    source: "nusantara-fallback",
  },
  malang: {
    name: "Malang",
    region: "JAWA TIMUR — ASAL GADO-GADO MALANG",
    main: { temp: 25, feels_like: 26, humidity: 78 },
    weather: [{ main: "Clouds", description: "sejuk berawan", icon: "03d" }],
    wind: { speed: 2.5 },
    culinaryRecommendation:
      "Udara sejuk Kota Malang berpadu nikmat dengan Gado-Gado Malang berbumbu kacang gurih manis.",
    source: "nusantara-fallback",
  },
  bandung: {
    name: "Bandung",
    region: "JAWA BARAT — ASAL GADO-GADO SUNDA",
    main: { temp: 24, feels_like: 25, humidity: 80 },
    weather: [{ main: "Clouds", description: "berawan sejuk", icon: "03d" }],
    wind: { speed: 2.2 },
    culinaryRecommendation:
      "Suasana sejuk Bandung sangat cocok untuk menikmati Gado-Gado Sunda dengan aroma kencur dan jeruk limau.",
    source: "nusantara-fallback",
  },
  cirebon: {
    name: "Cirebon",
    region: "JAWA BARAT — ASAL GADO-GADO AYAM CIREBON",
    main: { temp: 31, feels_like: 34, humidity: 74 },
    weather: [{ main: "Clear", description: "cerah hangat", icon: "01d" }],
    wind: { speed: 3.8 },
    culinaryRecommendation:
      "Gado-Gado Ayam Cirebon dengan suwiran ayam gurih siap menemani wisata kuliner pesisir Cirebon.",
    source: "nusantara-fallback",
  },
  solo: {
    name: "Solo (Surakarta)",
    region: "JAWA TENGAH — ASAL GADO-GADO SOLO",
    main: { temp: 30, feels_like: 32, humidity: 73 },
    weather: [{ main: "Clouds", description: "cerah berawan", icon: "02d" }],
    wind: { speed: 2.9 },
    culinaryRecommendation:
      "Nikmati Gado-Gado Solo dengan karakter bumbu kacang lembut khas Jawa Tengah.",
    source: "nusantara-fallback",
  },
  surakarta: {
    name: "Solo (Surakarta)",
    region: "JAWA TENGAH — ASAL GADO-GADO SOLO",
    main: { temp: 30, feels_like: 32, humidity: 73 },
    weather: [{ main: "Clouds", description: "cerah berawan", icon: "02d" }],
    wind: { speed: 2.9 },
    culinaryRecommendation:
      "Nikmati Gado-Gado Solo dengan karakter bumbu kacang lembut khas Jawa Tengah.",
    source: "nusantara-fallback",
  },
  padang: {
    name: "Padang",
    region: "SUMATRA BARAT — ASAL GADO-GADO PADANG",
    main: { temp: 29, feels_like: 32, humidity: 79 },
    weather: [{ main: "Clouds", description: "berawan hangat", icon: "02d" }],
    wind: { speed: 3.6 },
    culinaryRecommendation:
      "Gado-Gado Padang dengan rempah khas dan kerupuk merah sangat pas disantap di tepi pantai Padang.",
    source: "nusantara-fallback",
  },
  denpasar: {
    name: "Denpasar",
    region: "BALI — ASAL GADO-GADO KHAS BALI",
    main: { temp: 30, feels_like: 33, humidity: 76 },
    weather: [{ main: "Clear", description: "cerah tropis", icon: "01d" }],
    wind: { speed: 4.3 },
    culinaryRecommendation:
      "Cuaca tropis Bali paling pas ditemani Gado-Gado Khas Bali dengan sentuhan rempah kencur dan jeruk limau.",
    source: "nusantara-fallback",
  },
  bali: {
    name: "Denpasar",
    region: "BALI — ASAL GADO-GADO KHAS BALI",
    main: { temp: 30, feels_like: 33, humidity: 76 },
    weather: [{ main: "Clear", description: "cerah tropis", icon: "01d" }],
    wind: { speed: 4.3 },
    culinaryRecommendation:
      "Cuaca tropis Bali paling pas ditemani Gado-Gado Khas Bali dengan sentuhan rempah kencur dan jeruk limau.",
    source: "nusantara-fallback",
  },
  pangkalpinang: {
    name: "Pangkalpinang",
    region: "BANGKA BELITUNG — ASAL GADO-GADO BANGKA",
    main: { temp: 29, feels_like: 32, humidity: 77 },
    weather: [{ main: "Clouds", description: "cerah berawan", icon: "02d" }],
    wind: { speed: 3.5 },
    culinaryRecommendation:
      "Segarnya perasan jeruk kunci pada Gado-Gado Bangka sangat menyegarkan di cuaca Pangkalpinang.",
    source: "nusantara-fallback",
  },
  bangka: {
    name: "Pangkalpinang",
    region: "BANGKA BELITUNG — ASAL GADO-GADO BANGKA",
    main: { temp: 29, feels_like: 32, humidity: 77 },
    weather: [{ main: "Clouds", description: "cerah berawan", icon: "02d" }],
    wind: { speed: 3.5 },
    culinaryRecommendation:
      "Segarnya perasan jeruk kunci pada Gado-Gado Bangka sangat menyegarkan di cuaca Pangkalpinang.",
    source: "nusantara-fallback",
  },
};

export async function WeatherSearch(
  city: string
): Promise<{ data?: WeatherData; error?: string }> {
  const cleanedCity = city.trim();
  if (!cleanedCity) {
    return { error: "Silakan masukkan nama kota terlebih dahulu." };
  }

  const normalizedKey = cleanedCity.toLowerCase();
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (apiKey) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cleanedCity
        )}&units=metric&lang=id&appid=${apiKey}`,
        { cache: "no-store" }
      );

      if (res.ok) {
        const raw = await res.json();
        const matchedFallback = fallbackCityProfiles[normalizedKey];
        return {
          data: {
            name: raw.name,
            region: matchedFallback?.region || "KOTA KULINER NUSANTARA",
            main: {
              temp: raw.main.temp,
              humidity: raw.main.humidity,
              feels_like: raw.main.feels_like,
            },
            weather: raw.weather,
            wind: {
              speed: raw.wind.speed,
            },
            culinaryRecommendation:
              matchedFallback?.culinaryRecommendation ||
              `Nikmati kelezatan Gado-Gado Nusantara di tengah cuaca ${raw.name} hari ini.`,
            source: "openweathermap",
          },
        };
      }
    } catch {
      // Fallback to curated Nusantara data if offline
    }
  }

  if (fallbackCityProfiles[normalizedKey]) {
    return { data: fallbackCityProfiles[normalizedKey] };
  }

  return {
    error: `Data cuaca untuk "${cleanedCity}" tidak ditemukan. Coba pilih salah satu kota asal Gado-Gado (Jakarta, Surabaya, Malang, Bandung, Cirebon, Solo, Padang, Denpasar, Pangkalpinang).`,
  };
}
