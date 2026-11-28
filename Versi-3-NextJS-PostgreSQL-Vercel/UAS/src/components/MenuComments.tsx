"use client";

import React, { FormEvent, useEffect, useState } from "react";

interface MenuComment {
  id: number;
  name: string;
  menuSlug: string;
  rating: number;
  message: string;
  reply?: string;
  createdAt: string;
}

interface MenuCommentsProps {
  menuSlug: string;
  menuName: string;
}

export default function MenuComments({
  menuSlug,
  menuName,
}: MenuCommentsProps) {
  const [comments, setComments] = useState<MenuComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;

    async function loadComments() {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/comments?menuSlug=${encodeURIComponent(menuSlug)}`
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil komentar.");
        }

        const data = await response.json();

        if (active) {
          setComments(data.comments || []);
        }
      } catch (err) {
        console.error(err);
        if (active) setError("Komentar gagal dimuat.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadComments();

    return () => {
      active = false;
    };
  }, [menuSlug]);

  const averageRating =
    comments.length > 0
      ? (
          comments.reduce((total, item) => total + item.rating, 0) /
          comments.length
        ).toFixed(1)
      : "0.0";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setNotice("");

    if (name.trim().length < 2) {
      setError("Nama minimal 2 karakter.");
      return;
    }

    if (message.trim().length < 10) {
      setError("Komentar minimal 10 karakter.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          menuSlug,
          topic: "Rasa Menu",
          rating,
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mengirim komentar.");
      }

      setComments((previous) => [data.comment, ...previous]);
      setMessage("");
      setRating(5);
      setNotice("Komentar berhasil dikirim. Terima kasih!");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengirim komentar."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <section
      style={{
        marginTop: "35px",
        paddingTop: "25px",
        borderTop: "1px solid #e5dcc8",
        width: "100%",
      }}
    >
      <div style={{ marginBottom: "22px" }}>
        <span
          style={{
            color: "#a87828",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "1px",
          }}
        >
          ULASAN PELANGGAN
        </span>

        <h3 style={{ fontSize: "24px", margin: "8px 0" }}>
          Komentar {menuName}
        </h3>

        <div style={{ color: "#b27c24", fontSize: "15px" }}>
          ★★★★★{" "}
          <strong style={{ color: "#244b36" }}>
            {averageRating}
          </strong>
          <span style={{ color: "#777", marginLeft: "8px" }}>
            ({comments.length} komentar)
          </span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#f7f1e4",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "25px",
        }}
      >
        <h4 style={{ marginTop: 0, marginBottom: "15px" }}>
          Bagikan Pengalamanmu
        </h4>

        <label style={{ display: "block", marginBottom: "14px" }}>
          <span style={{ display: "block", marginBottom: "6px" }}>
            Nama
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama kamu"
            maxLength={60}
            required
            style={inputStyle}
          />
        </label>

        <div style={{ marginBottom: "14px" }}>
          <span>Rating</span>

          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`Rating ${value} bintang`}
                aria-pressed={rating === value}
                onClick={() => setRating(value)}
                style={{
                  border: 0,
                  background: "transparent",
                  fontSize: "27px",
                  cursor: "pointer",
                  color: value <= rating ? "#d49a27" : "#c9c2b5",
                  padding: "2px",
                }}
              >
                ★
              </button>
            ))}
            <span style={{ fontSize: "13px" }}>{rating}/5</span>
          </div>
        </div>

        <label style={{ display: "block", marginBottom: "14px" }}>
          <span style={{ display: "block", marginBottom: "6px" }}>
            Komentar
          </span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Bagaimana pendapat kamu tentang ${menuName}?`}
            rows={4}
            maxLength={800}
            required
            style={{
              ...inputStyle,
              resize: "vertical",
            }}
          />
          <small>{message.length}/800 karakter</small>
        </label>

        {error && (
          <p style={{ color: "#b42318", fontSize: "14px" }}>{error}</p>
        )}

        {notice && (
          <p style={{ color: "#247344", fontSize: "14px" }}>{notice}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            background: "#19432d",
            color: "white",
            padding: "12px 22px",
            border: 0,
            borderRadius: "30px",
            cursor: submitting ? "not-allowed" : "pointer",
            fontWeight: 700,
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? "Mengirim..." : "Kirim Komentar"}
        </button>
      </form>

      <div>
        {loading ? (
          <p>Memuat komentar...</p>
        ) : comments.length === 0 ? (
          <div
            style={{
              padding: "22px",
              textAlign: "center",
              background: "#faf8f2",
              borderRadius: "10px",
              color: "#777",
            }}
          >
            Belum ada komentar untuk menu ini. Jadilah yang pertama!
          </div>
        ) : (
          <div style={{ display: "grid", gap: "14px" }}>
            {comments.map((comment) => (
              <article
                key={comment.id}
                style={{
                  padding: "17px",
                  border: "1px solid #eee5d5",
                  borderRadius: "10px",
                  background: "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <strong>{comment.name}</strong>
                  <span style={{ color: "#c18b2c" }}>
                    {"★".repeat(comment.rating)}
                    <span style={{ color: "#d5d0c6" }}>
                      {"★".repeat(5 - comment.rating)}
                    </span>
                  </span>
                </div>

                <small style={{ color: "#888" }}>
                  {formatDate(comment.createdAt)}
                </small>

                <p style={{ marginBottom: 0, lineHeight: 1.6 }}>
                  {comment.message}
                </p>

                {comment.reply && (
                  <div
                    style={{
                      marginTop: "13px",
                      padding: "12px",
                      background: "#f5f1e7",
                      borderRadius: "8px",
                    }}
                  >
                    <strong style={{ fontSize: "13px" }}>
                      Balasan Admin
                    </strong>
                    <p style={{ marginBottom: 0 }}>{comment.reply}</p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "12px",
  border: "1px solid #ded5c4",
  borderRadius: "8px",
  background: "#fff",
  color: "#263b30",
  fontSize: "14px",
  boxSizing: "border-box",
};
