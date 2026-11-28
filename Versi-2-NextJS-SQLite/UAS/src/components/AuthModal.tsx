"use client";

import React, { useState } from "react";
import ModalWrapper from "./ModalWrapper";
import { UserAccount } from "@/types";
import {
  UserRound,
  LockKeyhole,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Utensils,
  X,
  UserPlus,
  LogIn,
} from "lucide-react";

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

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [registerName, setRegisterName] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerError, setRegisterError] = useState("");

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        setLoginError(data.error || "Username atau password salah.");
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

  const switchMode = (nextMode: "login" | "register") => {
    setLoginError("");
    setRegisterError("");
    setMode(nextMode);
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      modalClassName="auth-modal"
    >
      <div className="auth-modal-content">
        <button
          className="auth-close-button"
          id="authClose"
          type="button"
          onClick={onClose}
          aria-label="Tutup modal"
        >
          <X size={19} />
        </button>

        <div className="auth-brand-icon">
          {mode === "login" ? (
            <UserRound size={34} strokeWidth={1.6} />
          ) : (
            <UserPlus size={34} strokeWidth={1.6} />
          )}
        </div>

        <div className="auth-heading">
          <span className="auth-eyebrow">GADO-GADO NUSANTARA</span>

          <h2>
            {mode === "login" ? "Selamat Datang!" : "Buat Akun Baru"}
          </h2>

          <p>
            {mode === "login"
              ? "Masuk dan lanjutkan perjalanan kulinermu."
              : "Bergabung dan jelajahi kelezatan Nusantara."}
          </p>
        </div>

        <div className="auth-mode-indicator">
          <span className={mode === "login" ? "active" : ""}>
            <LogIn size={15} /> Login
          </span>
          <span className={mode === "register" ? "active" : ""}>
            <UserPlus size={15} /> Register
          </span>
        </div>

        {mode === "login" ? (
          <div id="loginSection" className="auth-form-section">
            <form id="loginForm" onSubmit={handleLoginSubmit}>
              <label htmlFor="loginUsername">Username</label>

              <div className="auth-input-wrap">
                <User size={18} />
                <input
                  type="text"
                  id="loginUsername"
                  placeholder="Masukkan username"
                  value={loginUsername}
                  onChange={(event) => setLoginUsername(event.target.value)}
                  autoComplete="username"
                  required
                  disabled={loginLoading}
                />
              </div>

              <label htmlFor="loginPassword">Password</label>

              <div className="auth-input-wrap">
                <LockKeyhole size={18} />
                <input
                  type={showLoginPassword ? "text" : "password"}
                  id="loginPassword"
                  placeholder="Masukkan password"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={loginLoading}
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  aria-label="Tampilkan password"
                >
                  {showLoginPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {loginError && (
                <p className="auth-error" id="loginError">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                className="auth-submit-button"
                disabled={loginLoading}
              >
                {loginLoading ? "Memeriksa..." : "Masuk ke Akun"}
                {!loginLoading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="auth-demo-info">
              <ShieldCheck size={18} />
              <div>
                <strong>Akun Admin Demo</strong>
                <span>Username: admin · Password: admin123</span>
              </div>
            </div>

            <p className="auth-switch">
              Belum punya akun?
              <button
                type="button"
                id="showRegister"
                className="auth-link"
                onClick={() => switchMode("register")}
                disabled={loginLoading}
              >
                Daftar Sekarang
              </button>
            </p>
          </div>
        ) : (
          <div id="registerSection" className="auth-form-section">
            <form id="registerForm" onSubmit={handleRegisterSubmit}>
              <label htmlFor="registerName">Nama Lengkap</label>

              <div className="auth-input-wrap">
                <User size={18} />
                <input
                  type="text"
                  id="registerName"
                  placeholder="Masukkan nama lengkap"
                  value={registerName}
                  onChange={(event) => setRegisterName(event.target.value)}
                  autoComplete="name"
                  required
                />
              </div>

              <label htmlFor="registerUsername">Username</label>

              <div className="auth-input-wrap">
                <UserRound size={18} />
                <input
                  type="text"
                  id="registerUsername"
                  placeholder="Buat username"
                  value={registerUsername}
                  onChange={(event) => setRegisterUsername(event.target.value)}
                  autoComplete="username"
                  required
                />
              </div>

              <label htmlFor="registerPassword">Password</label>

              <div className="auth-input-wrap">
                <LockKeyhole size={18} />
                <input
                  type={showRegisterPassword ? "text" : "password"}
                  id="registerPassword"
                  placeholder="Minimal 6 karakter"
                  value={registerPassword}
                  onChange={(event) => setRegisterPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  aria-label="Tampilkan password"
                >
                  {showRegisterPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              <label htmlFor="registerConfirmPassword">
                Konfirmasi Password
              </label>

              <div className="auth-input-wrap">
                <LockKeyhole size={18} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="registerConfirmPassword"
                  placeholder="Ulangi password"
                  value={registerConfirmPassword}
                  onChange={(event) =>
                    setRegisterConfirmPassword(event.target.value)
                  }
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Tampilkan konfirmasi password"
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {registerError && (
                <p className="auth-error" id="registerError">
                  {registerError}
                </p>
              )}

              <button type="submit" className="auth-submit-button">
                Buat Akun
                <ArrowRight size={18} />
              </button>
            </form>

            <p className="auth-switch">
              Sudah punya akun?
              <button
                type="button"
                id="showLogin"
                className="auth-link"
                onClick={() => switchMode("login")}
              >
                Login Sekarang
              </button>
            </p>
          </div>
        )}

        <div className="auth-footer">
          <Utensils size={14} />
          <span>Jelajahi Rasa, Kenali Nusantara</span>
        </div>
      </div>

      {children}
    </ModalWrapper>
  );
}
