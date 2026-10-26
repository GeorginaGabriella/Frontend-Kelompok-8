import React from "react";

interface ToastProps {
  message: string;
  visible: boolean;
  children?: React.ReactNode;
}

export default function Toast({ message, visible, children }: ToastProps) {
  return (
    <div className={`toast ${visible ? "show" : ""}`.trim()} id="toast">
      <span>✓</span>
      <p id="toastMessage">{children ?? message}</p>
    </div>
  );
}
