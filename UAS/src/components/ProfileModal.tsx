"use client";

import React from "react";
import Link from "next/link";
import ModalWrapper from "./ModalWrapper";
import { UserAccount } from "@/types";
import {
  UserRound,
  Heart,
  LayoutDashboard,
  ArrowRight,
  Utensils,
  LogOut,
  ShieldCheck,
  X,
  BadgeCheck,
} from "lucide-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount | null;
  favoriteCount: number;
  onLogout: () => void;
  children?: React.ReactNode;
}

export default function ProfileModal({
  isOpen,
  onClose,
  user,
  favoriteCount,
  onLogout,
  children,
}: ProfileModalProps) {
  if (!user) return null;

  const isAdmin = user.role === "admin";

  return (
    <ModalWrapper
      isOpen={isOpen && Boolean(user)}
      onClose={onClose}
      modalClassName="profile-modal"
    >
      <div className="profile-modal-content">
        <button
          className="profile-close-button"
          id="profileClose"
          type="button"
          onClick={onClose}
          aria-label="Tutup profil"
        >
          <X size={19} />
        </button>

        <div className="profile-top-decoration">
          <div className="profile-avatar">
            <UserRound size={43} strokeWidth={1.5} />
          </div>
          <span className="profile-online-indicator" />
        </div>

        <div className="profile-heading">
          <span className="profile-eyebrow">AKUN SAYA</span>
          <h2 id="profileName">{user.name || user.username}</h2>
          <p id="profileUsername">@{user.username}</p>
          <span
            className={`profile-role ${
              isAdmin ? "profile-role-admin" : "profile-role-user"
            }`}
            id="profileRole"
          >
            {isAdmin ? <ShieldCheck size={14} /> : <UserRound size={14} />}
            {isAdmin ? "ADMINISTRATOR" : "MEMBER"}
          </span>
        </div>

        <div className="profile-divider" />

        <div className="profile-stats">
          <div className="profile-stat-card">
            <div className="profile-stat-icon">
              <Heart size={20} />
            </div>
            <strong id="profileFavorite">{favoriteCount}</strong>
            <span>Menu Favorit</span>
          </div>

          <div className="profile-stat-card">
            <div className="profile-stat-icon">
              {isAdmin ? <ShieldCheck size={20} /> : <BadgeCheck size={20} />}
            </div>
            <strong>{isAdmin ? "Admin" : "Member"}</strong>
            <span>Jenis Akun</span>
          </div>
        </div>

        <div className="profile-welcome-card">
          <div className="profile-welcome-icon">
            <Utensils size={19} />
          </div>
          <div>
            <strong>Selamat datang di Gado-Gado Nusantara</strong>
            <p>
              {isAdmin
                ? "Kelola website dan jelajahi koleksi kuliner Nusantara melalui akun administrator."
                : "Jelajahi ragam kuliner Nusantara dan simpan menu favoritmu di sini."}
            </p>
          </div>
        </div>

        {children && (
          <div className="profile-extra-content">{children}</div>
        )}

        <div className="profile-actions">
          {isAdmin && (
            <Link
              href="/admin"
              className="profile-dashboard-button"
              onClick={onClose}
            >
              <span className="profile-action-icon">
                <LayoutDashboard size={19} />
              </span>
              <span>Dashboard Admin</span>
              <ArrowRight size={18} className="profile-action-arrow" />
            </Link>
          )}

          <a
            href="#menu"
            className="profile-explore-button"
            id="profileExplore"
            onClick={onClose}
          >
            <Utensils size={18} />
            Jelajahi Menu
          </a>

          <button
            type="button"
            className="profile-logout-button"
            id="logoutButton"
            onClick={() => {
              onLogout();
              onClose();
            }}
          >
            <LogOut size={18} />
            Logout dari Akun
          </button>
        </div>

        <p className="profile-footer">
          <span>✦</span> Gado-Gado Nusantara
        </p>
      </div>
    </ModalWrapper>
  );
}
