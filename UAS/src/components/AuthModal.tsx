"use client";

import React, { useState } from "react";
import ModalWrapper from "./ModalWrapper";
import { adminAccount } from "@/data/gadoGadoData";
import { UserAccount } from "@/types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: UserAccount[];
  onRegisterAccount: (newUser: UserAccount) => void;
  onLoginSuccess: (user: UserAccount) => void;
  onShowToast: (message: string) => void;
  children?: React.ReactNode;
}

/**
 * Komponen Fungsional AuthModal (Poin 10 & Poin 11: Functional Component, Props & Children)
 */
export default function AuthModal({
  isOpen,
  onClose,
  accounts,
  onRegisterAccount,
  onLoginSuccess,
  onShowToast,
  children,
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");

  // Login State
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Register State
  const [registerName, setRegisterName] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerError, setRegisterError] = useState("");

  const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = loginUsername.trim().toLowerCase();
    const password = loginPassword;
    setLoginError("");

    if (!username || !password) {
      setLoginError("Username dan password harus diisi.");
      return;
    }

    let foundUser: UserAccount | undefined;

    if (
      username === adminAccount.username &&
      password === adminAccount.password
    ) {
      foundUser = adminAccount;
    } else {
      foundUser = accounts.find(
        (acc) =>
          acc.username.toLowerCase() === username && acc.password === password
      );
    }

    if (!foundUser) {
      setLoginError("Username atau password salah.");
      return;
    }

    onLoginSuccess(foundUser);
    setLoginUsername("");
    setLoginPassword("");
    onClose();

    if (foundUser.role === "admin") {
      onShowToast("Login sebagai Admin berhasil.");
    } else {
      onShowToast(`Selamat datang, ${foundUser.name}!`);
    }
  };

  const handleRegisterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = registerName.trim();
    const username = registerUsername.trim().toLowerCase();
    const password = registerPassword;
    const confirmPassword = registerConfirmPassword;
    setRegisterError("");

    if (!name || !username || !password || !confirmPassword) {
      setRegisterError("Semua data harus diisi.");
      return;
    }

    if (password.length < 6) {
      setRegisterError("Password minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setRegisterError("Konfirmasi password tidak sama.");
      return;
    }

    if (username === "admin") {
      setRegisterError("Username sudah digunakan.");
      return;
    }

    const exists = accounts.some(
      (acc) => acc.username.toLowerCase() === username
    );
    if (exists) {
      setRegisterError("Username sudah digunakan.");
      return;
    }

    const newUser: UserAccount = {
      name,
      username,
      password,
      role: "user",
    };

    onRegisterAccount(newUser);
    setRegisterName("");
    setRegisterUsername("");
    setRegisterPassword("");
    setRegisterConfirmPassword("");
    setMode("login");
    setLoginUsername(username);
    onShowToast("Register berhasil. Silakan login.");
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      modalClassName="auth-modal"
    >
      <button
        className="modal-close"
        id="authClose"
        type="button"
        onClick={onClose}
      >
        ×
      </button>

      {mode === "login" ? (
        <div id="loginSection">
          <p className="section-label">AKUN</p>
          <h2>Login</h2>
          <p className="auth-description">
            Masuk ke akun Gado-Gado Nusantara. (Admin demo: <b>admin</b> /{" "}
            <b>admin123</b>)
          </p>

          <form id="loginForm" onSubmit={handleLoginSubmit}>
            <label htmlFor="loginUsername">Username</label>
            <input
              type="text"
              id="loginUsername"
              placeholder="Masukkan username"
              value={loginUsername}
              onChange={(event) => setLoginUsername(event.target.value)}
              required
            />

            <label htmlFor="loginPassword">Password</label>
            <input
              type="password"
              id="loginPassword"
              placeholder="Masukkan password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              required
            />

            <p className="auth-error" id="loginError">
              {loginError}
            </p>

            <button type="submit" className="primary-button auth-submit">
              Login
            </button>
          </form>

          <p className="auth-switch">
            Belum punya akun?
            <button
              type="button"
              id="showRegister"
              className="auth-link"
              onClick={() => {
                setLoginError("");
                setMode("register");
              }}
            >
              Register
            </button>
          </p>
        </div>
      ) : (
        <div id="registerSection">
          <p className="section-label">DAFTAR AKUN</p>
          <h2>Register</h2>
          <p className="auth-description">
            Buat akun baru untuk menggunakan website.
          </p>

          <form id="registerForm" onSubmit={handleRegisterSubmit}>
            <label htmlFor="registerName">Nama</label>
            <input
              type="text"
              id="registerName"
              placeholder="Masukkan nama"
              value={registerName}
              onChange={(event) => setRegisterName(event.target.value)}
              required
            />

            <label htmlFor="registerUsername">Username</label>
            <input
              type="text"
              id="registerUsername"
              placeholder="Buat username"
              value={registerUsername}
              onChange={(event) => setRegisterUsername(event.target.value)}
              required
            />

            <label htmlFor="registerPassword">Password</label>
            <input
              type="password"
              id="registerPassword"
              placeholder="Minimal 6 karakter"
              value={registerPassword}
              onChange={(event) => setRegisterPassword(event.target.value)}
              required
            />

            <label htmlFor="registerConfirmPassword">Konfirmasi Password</label>
            <input
              type="password"
              id="registerConfirmPassword"
              placeholder="Ulangi password"
              value={registerConfirmPassword}
              onChange={(event) =>
                setRegisterConfirmPassword(event.target.value)
              }
              required
            />

            <p className="auth-error" id="registerError">
              {registerError}
            </p>

            <button type="submit" className="primary-button auth-submit">
              Register
            </button>
          </form>

          <p className="auth-switch">
            Sudah punya akun?
            <button
              type="button"
              id="showLogin"
              className="auth-link"
              onClick={() => {
                setRegisterError("");
                setMode("login");
              }}
            >
              Login
            </button>
          </p>
        </div>
      )}

      {children}
    </ModalWrapper>
  );
}
