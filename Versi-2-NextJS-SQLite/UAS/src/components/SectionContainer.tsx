import React from "react";
import { SectionContainerProps } from "@/types";

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
