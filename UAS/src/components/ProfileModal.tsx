"use client";

import React from "react";
import Link from "next/link";
import ModalWrapper from "./ModalWrapper";
import { UserAccount } from "@/types";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount | null;
  favoriteCount: number;
  choiceCount: number;
  onLogout: () => void;
  children?: React.ReactNode;
}

export default function ProfileModal({
  isOpen,
  onClose,
  user,
  favoriteCount,
  choiceCount,
  onLogout,
  children,
}: ProfileModalProps) {
  return (
    <ModalWrapper
      isOpen={isOpen && Boolean(user)}
      onClose={onClose}
      modalClassName="profile-modal"
    >
      <button
        className="modal-close"
        id="profileClose"
        type="button"
        onClick={onClose}
      >
        ×
      </button>

      {user && (
        <>
          <div className="profile-icon">👤</div>
          <p className="section-label">PROFIL</p>
          <h2 id="profileName">{user.name}</h2>
          <p id="profileUsername">@{user.username}</p>

          <span className="role-badge" id="profileRole">
            {user.role.toUpperCase()}
          </span>

          <div className="profile-stats">
            <div>
              <strong id="profileFavorite">{favoriteCount}</strong>
              <span>Favorit</span>
            </div>
            <div>
              <strong id="profileChoice">{choiceCount}</strong>
              <span>Pilihan</span>
            </div>
          </div>

          {children}

          {user.role === "admin" && (
            <Link
              href="/admin"
              className="admin-profile-button"
              onClick={onClose}
            >
              <span>▦</span>
              Dashboard Admin
              <span className="admin-profile-arrow">→</span>
            </Link>
          )}

          <a
            href="#menu"
            className="primary-button"
            id="profileExplore"
            onClick={onClose}
          >
            Jelajahi Menu
          </a>

          <button
            type="button"
            className="logout-button"
            id="logoutButton"
            onClick={() => {
              onLogout();
              onClose();
            }}
          >
            Logout
          </button>
        </>
      )}
    </ModalWrapper>
  );
}
