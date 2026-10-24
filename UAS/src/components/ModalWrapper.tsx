"use client";

import React from "react";
import { ModalWrapperProps } from "@/types";

/**
 * Komponen Fungsional ModalWrapper (Poin 10 & Poin 11: Props & Children)
 * Menyediakan overlay dialog modal dan merender isi modal melalui prop `children`.
 */
export default function ModalWrapper({
  isOpen,
  onClose,
  overlayClassName = "",
  modalClassName = "",
  ariaLabelledBy,
  children,
}: ModalWrapperProps) {
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`modal-overlay ${overlayClassName} ${isOpen ? "show" : ""}`.trim()}
      onClick={handleBackdropClick}
    >
      <div
        className={modalClassName}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
      >
        {children}
      </div>
    </div>
  );
}
