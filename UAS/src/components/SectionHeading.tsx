import React from "react";
import { SectionHeadingProps } from "@/types";

/**
 * Komponen Fungsional SectionHeading (Poin 10 & Poin 11: Props & Children)
 * Menampilkan label, judul section, dan deskripsi atau konten tambahan melalui `children`.
 */
export default function SectionHeading({
  label,
  title,
  highlight,
  description,
  className = "section-heading",
  children,
}: SectionHeadingProps) {
  return (
    <div className={className}>
      <div>
        <p className="section-label">{label}</p>
        <h2>
          {title} {highlight && <span>{highlight}</span>}
        </h2>
      </div>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
}
