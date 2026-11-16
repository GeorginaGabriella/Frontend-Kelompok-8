"use client";

import React, { FormEvent, useEffect, useState } from "react";
import SectionContainer from "./SectionContainer";
import SectionHeading from "./SectionHeading";
import { CustomerServiceSectionProps } from "@/types";

const topics = [
  "Umum",
  "Rasa Menu",
  "Pengiriman",
  "Harga & Promo",
  "Keluhan",
  "Saran",
];

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Bagian Customer Service: pengunjung bisa menuliskan komentar,
 * dan balasan dari admin ditampilkan di bawah komentar terkait.
 */
export default function CustomerServiceSection({
  comments,
  loading = false,
  submitting = false,
  defaultName = "",
  onSubmitComment,
  children,
}: CustomerServiceSectionProps) {
  const [name, setName] = useState(defaultName);
  const [topic, setTopic] = useState(topics[0]);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (defaultName) setName(defaultName);
  }, [defaultName]);

  const averageRating =
    comments.length > 0
      ? (
          comments.reduce((total, item) => total + item.rating, 0) /
          comments.length
        ).toFixed(1)
      : "—";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (name.trim().length < 2) {
      setFormError("Nama minimal 2 karakter.");
      return;
    }

    if (message.trim().length < 10) {
      setFormError("Komentar minimal 10 karakter.");
      return;
    }

    setFormError("");

    const success = await onSubmitComment({
      name: name.trim(),
      topic,
      rating,
      message: message.trim(),
    });

    if (success) {
      setMessage("");
      setRating(5);
      setTopic(topics[0]);
    }
  };

  return (
    <SectionContainer id="customer-service" className="cs-section">
      <SectionHeading
        label="CUSTOMER SERVICE"
        title="Punya Masukan?"
        highlight="Tulis di Sini"
        description="Setiap pengunjung bisa memberikan komentar, pertanyaan, atau keluhan. Tim kami membalas langsung di halaman ini."
      />

      <div className="cs-grid">
        {/* ───────────── FORM KOMENTAR ───────────── */}
        <form className="cs-form" onSubmit={handleSubmit}>
          <div className="cs-form-head">
            <span className="cs-badge">📝 FORM KOMENTAR</span>
            <h3>Kirim komentar kamu</h3>
            <p>
              Tidak perlu login — cukup tulis nama dan pesanmu, komentar akan
              langsung tampil.
            </p>
          </div>

          <label className="cs-field">
            <span>Nama *</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nama kamu"
              maxLength={60}
            />
          </label>

          <label className="cs-field">
            <span>Topik</span>
            <select
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
            >
              {topics.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <div className="cs-field">
            <span>Penilaian</span>

            <div className="cs-rating" role="radiogroup" aria-label="Penilaian">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={rating === value}
                  aria-label={`${value} bintang`}
                  className={`cs-star ${value <= rating ? "active" : ""}`.trim()}
                  onClick={() => setRating(value)}
                >
                  ★
                </button>
              ))}

              <small>{rating} dari 5</small>
            </div>
          </div>

          <label className="cs-field">
            <span>Komentar *</span>
            <textarea
              rows={5}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ceritakan pengalamanmu memesan di Gado-Gado Nusantara..."
              maxLength={800}
            />
            <small>{message.length}/800 karakter</small>
          </label>

          {formError && <p className="cs-error">{formError}</p>}

          <button type="submit" className="cs-submit" disabled={submitting}>
            {submitting ? "Mengirim..." : "Kirim Komentar"}
          </button>

          {children}
        </form>

        {/* ───────────── DAFTAR KOMENTAR ───────────── */}
        <div className="cs-list-wrap">
          <div className="cs-list-head">
            <div>
              <strong>{comments.length}</strong>
              <span>komentar pengunjung</span>
            </div>

            <div>
              <strong>★ {averageRating}</strong>
              <span>rata-rata penilaian</span>
            </div>
          </div>

          {loading ? (
            <div className="cs-empty">Memuat komentar...</div>
          ) : comments.length === 0 ? (
            <div className="cs-empty">
              Belum ada komentar. Jadilah yang pertama memberi masukan!
            </div>
          ) : (
            <ul className="cs-list">
              {comments.map((comment) => (
                <li key={comment.id} className="cs-item">
                  <div className="cs-item-head">
                    <div className="cs-avatar">
                      {comment.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <strong>{comment.name}</strong>
                      <small>
                        {comment.topic} · {formatDate(comment.createdAt)}
                      </small>
                    </div>

                    <span className="cs-item-rating">
                      {"★".repeat(comment.rating)}
                      <i>{"★".repeat(5 - comment.rating)}</i>
                    </span>
                  </div>

                  <p className="cs-item-message">{comment.message}</p>

                  {comment.reply && (
                    <div className="cs-reply">
                      <span>💬 Balasan Gado-Gado Nusantara</span>
                      <p>{comment.reply}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </SectionContainer>
  );
}
