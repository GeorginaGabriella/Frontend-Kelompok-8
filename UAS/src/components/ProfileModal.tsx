"use client";

import React from "react";
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

/**
 * Komponen Fungsional ProfileModal (Poin 10 & Poin 11: Functional Component, Props & Children)
 */
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
