import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gado-Gado Nusantara — Jelajahi Rasa, Kenali Nusantara",
  description:
    "Gado-Gado Nusantara - Jelajahi berbagai gado-gado khas Indonesia dengan Next.js Functional Components, Props & Children.",
};

/**
 * RootLayout Next.js App Router (Poin 9 & Poin 11: Instalasi Next.js, Props & Children)
 * Menerima prop `children` bertipe React.ReactNode untuk merender seluruh halaman.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
