"use client";

import React, { useEffect, useState } from "react";
import SectionContainer from "./SectionContainer";
import Button from "./Button";
import { WeatherSearch } from "@/app/actions";
import { WeatherData } from "@/types/weather";

interface WeatherSectionProps {
  defaultCity?: string;
  children?: React.ReactNode;
}

const culinaryCities = [
  "Jakarta",
  "Surabaya",
  "Malang",
  "Bandung",
  "Cirebon",
  "Solo",
  "Padang",
  "Denpasar",
  "Pangkalpinang",
];

/**
 * Komponen Fungsional WeatherSection (Bab XI API Service Next.js + Poin 10-11 Props & Children)
 */
export default function WeatherSection({
  defaultCity = "Jakarta",
  children,
}: WeatherSectionProps) {
  const [cityInput, setCityInput] = useState(defaultCity);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFetchWeather = async (targetCity: string) => {
    setLoading(true);
    setError("");
    const result = await WeatherSearch(targetCity);
    if (result.error) {
      setError(result.error);
      setWeather(null);
    } else if (result.data) {
      setWeather(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleFetchWeather(defaultCity);
  }, [defaultCity]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleFetchWeather(cityInput);
  };

  return (
    <SectionContainer id="cuaca" className="weather-section">
      <div className="weather-card">
        <div>
          <p className="section-label">API SERVICE NEXT.JS — CUACA DAERAH</p>
          <h2
            style={{
              fontFamily: '"Playfair Display", serif',
              color: "#31572c",
              fontSize: "clamp(30px, 3.5vw, 44px)",
              lineHeight: 1.1,
              margin: "10px 0 16px",
            }}
          >
            Cek Cuaca Kota <span style={{ color: "#c65d12" }}>Kuliner</span>
          </h2>
          <p style={{ color: "#696d65", lineHeight: 1.75, fontSize: "14px" }}>
            Rencanakan wisata kuliner Gado-Gado Nusantara dengan memeriksa
            kondisi cuaca terkini di kota asal gado-gado favoritmu.
          </p>

          <form onSubmit={handleSubmit} className="weather-form-group">
            <input
              type="text"
              name="city"
              className="weather-input"
              placeholder="Ketik kota (contoh: Surabaya, Bandung, Padang)..."
              value={cityInput}
              onChange={(event) => setCityInput(event.target.value)}
            />
            <Button type="submit" variant="modulePrimary">
              {loading ? "Memuat..." : "Cek Cuaca"}
            </Button>
          </form>

          <div className="weather-quick-cities">
            {culinaryCities.map((city) => (
              <button
                key={city}
                type="button"
                className={`weather-city-chip ${
                  weather?.name.toLowerCase() === city.toLowerCase()
                    ? "active"
                    : ""
                }`.trim()}
                onClick={() => {
                  setCityInput(city);
                  handleFetchWeather(city);
                }}
              >
                📍 {city}
              </button>
            ))}
          </div>

          {children}
        </div>

        <div className="weather-result-box">
          {error ? (
            <div style={{ textAlign: "center", padding: "25px 10px" }}>
              <div style={{ fontSize: "38px", marginBottom: "8px" }}>🌥️</div>
              <h3 style={{ color: "#b42318", marginBottom: "6px" }}>
                Kota Tidak Ditemukan
              </h3>
              <p style={{ fontSize: "13px", color: "#666" }}>{error}</p>
            </div>
          ) : weather ? (
            <>
              <div className="weather-result-top">
                <div>
                  <span className="section-label">{weather.region}</span>
                  <h3
                    style={{
                      fontFamily: '"Playfair Display", serif',
                      fontSize: "28px",
                      color: "#31572c",
                      marginTop: "4px",
                    }}
                  >
                    {weather.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#666",
                      textTransform: "capitalize",
                    }}
                  >
                    {weather.weather[0]?.description}
                  </p>
                </div>
                <div className="weather-temp">
                  {Math.round(weather.main.temp)}°C
                </div>
              </div>

              <div className="weather-metrics">
                <div className="weather-metric-item">
                  <small>Terasa Seperti</small>
                  <strong>{Math.round(weather.main.feels_like)}°C</strong>
                </div>
                <div className="weather-metric-item">
                  <small>Kelembapan</small>
                  <strong>{weather.main.humidity}%</strong>
                </div>
                <div className="weather-metric-item">
                  <small>Kecepatan Angin</small>
                  <strong>{weather.wind.speed} m/s</strong>
                </div>
              </div>

              <div className="weather-recommendation">
                <strong>🍽️ Rekomendasi Kuliner:</strong>{" "}
                {weather.culinaryRecommendation}
              </div>
            </>
          ) : (
            <p style={{ textAlign: "center", color: "#777", fontSize: "13px" }}>
              Memuat informasi cuaca daerah kuliner...
            </p>
          )}
        </div>
      </div>
    </SectionContainer>
  );
}
