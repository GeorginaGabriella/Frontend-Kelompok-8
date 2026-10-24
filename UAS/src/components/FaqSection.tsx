import React from "react";
import SectionContainer from "./SectionContainer";
import { FaqItem } from "@/types";

interface FaqSectionProps {
  faqs: FaqItem[];
  children?: React.ReactNode;
}

interface FaqAccordionItemProps {
  question: string;
  answer: string;
  children?: React.ReactNode;
}

/**
 * Komponen Fungsional FaqAccordionItem (Poin 10 & Poin 11: Functional Component, Props & Children)
 */
export function FaqAccordionItem({
  question,
  answer,
  children,
}: FaqAccordionItemProps) {
  return (
    <details className="faq-item">
      <summary>{question}</summary>
      <p>{children ?? answer}</p>
    </details>
  );
}

/**
 * Komponen Fungsional FaqSection (Poin 10 & Poin 11: Functional Component, Props & Children)
 */
export default function FaqSection({ faqs, children }: FaqSectionProps) {
  return (
    <SectionContainer
      id="faq"
      className="faq-section"
      containerClassName="faq-layout"
    >
      <div className="faq-heading">
        <p className="section-label">YANG SERING DITANYAKAN</p>
        <h2>
          Kenali sebelum <span>menjelajah</span>
        </h2>
        <p>
          Informasi singkat tentang menu, harga, dan cara menemukan penjual.
        </p>
        {children}
      </div>

      <div className="faq-list" id="faqList">
        {faqs.map((faq, index) => (
          <FaqAccordionItem
            key={`${faq.question}-${index}`}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </div>
    </SectionContainer>
  );
}
