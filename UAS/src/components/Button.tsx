import React from "react";
import Link from "next/link";
import styles from "@/styles/button.module.css";
import { ButtonProps } from "@/types";

/**
 * Komponen Fungsional Reusable Button (Poin 10 & Poin 11: Functional Component, Props & Children)
 * Mendukung CSS Module (button.module.css), prop `label`, maupun `children`.
 */
export default function Button({
  label,
  variant = "primary",
  size = "md",
  href,
  type = "button",
  className = "",
  title,
  onClick,
  children,
}: ButtonProps) {
  const variantClass =
    variant === "modulePrimary"
      ? styles.primary
      : variant === "secondary"
      ? "secondary-button"
      : variant === "outline"
      ? styles.outline
      : variant === "danger"
      ? styles.danger
      : "primary-button";

  const sizeClass =
    size === "sm" ? styles.sm : size === "lg" ? styles.lg : "";

  const combinedClassName = `${variantClass} ${sizeClass} ${className}`.trim();
  const content = children ?? label;

  if (href) {
    if (href.startsWith("/")) {
      return (
        <Link href={href} className={combinedClassName} title={title} onClick={onClick}>
          {content}
        </Link>
      );
    }

    return (
      <a href={href} className={combinedClassName} title={title} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={combinedClassName}
      title={title}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
