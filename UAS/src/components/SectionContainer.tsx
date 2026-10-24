import React from "react";
import { SectionContainerProps } from "@/types";

/**
 * Komponen Fungsional SectionContainer (Poin 10 & Poin 11: Props & Children)
 * Membungkus setiap section halaman menggunakan prop `children`.
 */
export default function SectionContainer({
  id,
  className = "",
  containerClassName = "",
  children,
}: SectionContainerProps) {
  return (
    <section id={id} className={className}>
      <div className={`container ${containerClassName}`.trim()}>{children}</div>
    </section>
  );
}
