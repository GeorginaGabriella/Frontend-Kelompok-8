import React from "react";

interface ToastProps {
  message: string;
  visible: boolean;
  children?: React.ReactNode;
}

/**
 * Komponen Fungsional Toast (Poin 10 & Poin 11: Functional Component, Props & Children)
 */
export default function Toast({ message, visible, children }: ToastProps) {
  return (
    <div className={`toast ${visible ? "show" : ""}`.trim()} id="toast">
      <span>✓</span>
      <p id="toastMessage">{children ?? message}</p>
    </div>
  );
}
