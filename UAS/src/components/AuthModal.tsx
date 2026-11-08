"use client";

import React, { useState } from "react";
import ModalWrapper from "./ModalWrapper";
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

interface LoginResponse {
  user?: {
    name: string;
    username: string;
    role: string;
  };
  error?: string;
}

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
  const [loginLoading, setLoginLoading] = useState(false);

  // Register State
  const [registerName, setRegisterName] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerError, setRegisterError] = useState("");

  // LOGIN
  const handleLoginSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loginLoading) return;

    const username = loginUsername.trim().toLowerCase();
    const password = loginPassword;

    setLoginError("");

    if (!username || !password) {
      setLoginError("Username dan password harus diisi.");
      return;
    }

    setLoginLoading(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "login",
          username,
          password,
        }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok || !data.user) {
        setLoginError(
          data.error || "Username atau password salah."
        );
        return;
      }

      const authenticatedUser: UserAccount = {
        name: data.user.name,
        username: data.user.username,
        role: data.user.role as UserAccount["role"],
        password: "",
      };

      onLoginSuccess(authenticatedUser);

      setLoginUsername("");
      setLoginPassword("");
      setLoginError("");

      onClose();

      if (authenticatedUser.role === "admin") {
        onShowToast("Login sebagai Admin berhasil.");
      } else {
        onShowToast(`Selamat datang, ${authenticatedUser.name}!`);
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(
        "Tidak dapat menghubungi server. Periksa koneksi dan coba lagi."
      );
    } finally {
      setLoginLoading(false);
    }
  };

  // REGISTER
  const handleRegisterSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
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
      (account) => account.username.toLowerCase() === username
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
    setLoginPassword("");

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
        aria-label="Tutup modal"
      >
        ×
      </button>

      {mode === "login" ? (
        <div id="loginSection">
          <p className="section-label">AKUN</p>

          <h2>Login</h2>

          <p className="auth-description">
            Masuk ke akun Gado-Gado Nusantara. (Admin demo:{" "}
            <b>admin</b> / <b>admin123</b>)
          </p>

          <form id="loginForm" onSubmit={handleLoginSubmit}>
            <label htmlFor="loginUsername">Username</label>

            <input
              type="text"
              id="loginUsername"
              placeholder="Masukkan username"
              value={loginUsername}
              onChange={(event) =>
                setLoginUsername(event.target.value)
              }
              autoComplete="username"
              required
              disabled={loginLoading}
            />

            <label htmlFor="loginPassword">Password</label>

            <input
              type="password"
              id="loginPassword"
              placeholder="Masukkan password"
              value={loginPassword}
              onChange={(event) =>
                setLoginPassword(event.target.value)
              }
              autoComplete="current-password"
              required
              disabled={loginLoading}
            />

            <p className="auth-error" id="loginError">
              {loginError}
            </p>

            <button
              type="submit"
              className="primary-button auth-submit"
              disabled={loginLoading}
            >
              {loginLoading ? "Memeriksa..." : "Login"}
            </button>
          </form>

          <p className="auth-switch">
            Belum punya akun?{" "}
            <button
              type="button"
              id="showRegister"
              className="auth-link"
              onClick={() => {
                setLoginError("");
                setMode("register");
              }}
              disabled={loginLoading}
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
              onChange={(event) =>
                setRegisterName(event.target.value)
              }
              autoComplete="name"
              required
            />

            <label htmlFor="registerUsername">Username</label>

            <input
              type="text"
              id="registerUsername"
              placeholder="Buat username"
              value={registerUsername}
              onChange={(event) =>
                setRegisterUsername(event.target.value)
              }
              autoComplete="username"
              required
            />

            <label htmlFor="registerPassword">Password</label>

            <input
              type="password"
              id="registerPassword"
              placeholder="Minimal 6 karakter"
              value={registerPassword}
              onChange={(event) =>
                setRegisterPassword(event.target.value)
              }
              autoComplete="new-password"
              required
            />

            <label htmlFor="registerConfirmPassword">
              Konfirmasi Password
            </label>

            <input
              type="password"
              id="registerConfirmPassword"
              placeholder="Ulangi password"
              value={registerConfirmPassword}
              onChange={(event) =>
                setRegisterConfirmPassword(event.target.value)
              }
              autoComplete="new-password"
              required
            />

            <p className="auth-error" id="registerError">
              {registerError}
            </p>

            <button
              type="submit"
              className="primary-button auth-submit"
            >
              Register
            </button>
          </form>

          <p className="auth-switch">
            Sudah punya akun?{" "}
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
