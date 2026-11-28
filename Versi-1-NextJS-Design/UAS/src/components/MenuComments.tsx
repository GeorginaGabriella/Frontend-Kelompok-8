"use client";

import React, { FormEvent, useState } from "react";

interface MenuComment {
  id: number;
  name: string;
  menuSlug: string;
  rating: number;
  message: string;
  createdAt: string;
}

interface MenuCommentsProps { menuSlug: string; menuName: string; }
const temporaryComments: Record<string, MenuComment[]> = {};

export default function MenuComments({ menuSlug, menuName }: MenuCommentsProps) {
  const [comments, setComments] = useState<MenuComment[]>(temporaryComments[menuSlug] || []);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const averageRating = comments.length ? (comments.reduce((sum, item) => sum + item.rating, 0) / comments.length).toFixed(1) : "0.0";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(""); setNotice("");
    if (name.trim().length < 2) return setError("Nama minimal 2 karakter.");
    if (message.trim().length < 10) return setError("Komentar minimal 10 karakter.");
    const comment: MenuComment = { id: Date.now(), name: name.trim(), menuSlug, rating, message: message.trim(), createdAt: new Date().toISOString() };
    const updated = [comment, ...(temporaryComments[menuSlug] || [])];
    temporaryComments[menuSlug] = updated;
    setComments(updated); setMessage(""); setRating(5);
    setNotice("Komentar ditambahkan sementara. Komentar akan hilang setelah refresh.");
  };

  return (
    <section style={{ marginTop: 35, paddingTop: 25, borderTop: "1px solid #e5dcc8", width: "100%" }}>
      <div style={{ marginBottom: 22 }}>
        <span style={{ color: "#a87828", fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>ULASAN PELANGGAN</span>
        <h3 style={{ fontSize: 24, margin: "8px 0" }}>Komentar {menuName}</h3>
        <div style={{ color: "#b27c24", fontSize: 15 }}>★★★★★ <strong style={{ color: "#244b36" }}>{averageRating}</strong> <span style={{ color: "#777", marginLeft: 8 }}>({comments.length} komentar)</span></div>
      </div>
      <form onSubmit={handleSubmit} style={{ background: "#f7f1e4", padding: 20, borderRadius: 12, marginBottom: 25 }}>
        <h4 style={{ marginTop: 0, marginBottom: 15 }}>Bagikan Pengalamanmu</h4>
        <label style={{ display: "block", marginBottom: 14 }}>Nama<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Masukkan nama kamu" maxLength={60} required style={inputStyle} /></label>
        <div style={{ marginBottom: 14 }}>Rating<div style={{ display: "flex", gap: 5 }}>{[1,2,3,4,5].map((value) => <button key={value} type="button" aria-label={`Rating ${value} bintang`} onClick={() => setRating(value)} style={{ border: 0, background: "transparent", fontSize: 27, color: value <= rating ? "#b27c24" : "#aaa", cursor: "pointer" }}>★</button>)}</div></div>
        <label style={{ display: "block", marginBottom: 14 }}>Komentar<textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ceritakan pengalamanmu..." rows={4} required style={{ ...inputStyle, resize: "vertical" }} /></label>
        {error && <p style={{ color: "#b42318" }}>{error}</p>}{notice && <p style={{ color: "#26734d" }}>{notice}</p>}
        <button type="submit" style={submitStyle}>Kirim Komentar</button>
      </form>
      {comments.length === 0 ? <p style={{ color: "#777" }}>Belum ada komentar. Jadilah yang pertama memberikan ulasan!</p> : comments.map((item) => <article key={item.id} style={{ padding: "15px 0", borderBottom: "1px solid #eee" }}><strong>{item.name}</strong><div style={{ color: "#b27c24" }}>{"★".repeat(item.rating)}{"☆".repeat(5-item.rating)}</div><p>{item.message}</p><small style={{ color: "#888" }}>{new Date(item.createdAt).toLocaleString("id-ID")}</small></article>)}
    </section>
  );
}

const inputStyle: React.CSSProperties = { display: "block", width: "100%", marginTop: 6, padding: "11px 12px", border: "1px solid #d8cdb9", borderRadius: 8, background: "white", color: "#263b2e", font: "inherit", boxSizing: "border-box" };
const submitStyle: React.CSSProperties = { border: 0, borderRadius: 8, padding: "11px 20px", background: "#244b36", color: "white", fontWeight: 700, cursor: "pointer" };
