import React from "react";

export type FilterGroup = "semua" | "betawi" | "sunda" | "jawa" | "lainnya";

export interface MenuItem {
  slug: string;
  name: string;
  searchName: string;
  kategori: string;
  group: Exclude<FilterGroup, "semua">;
  regionBadge: string;
  categoryLabel: string;
  region: string;
  rating: string;
  image: string;
  shortDescription: string;
  description: string;
  cardIngredients: string[];
  ingredients: string[];
  price: string;
  location: string;
  city: string;
  condiments: string;
  benefits: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SiteContent {
  heroDescription: string;
  aboutDescription: string;
}

export interface UserAccount {
  name: string;
  username: string;
  password?: string;
  role: "admin" | "user";
}

export interface SavedAdminData {
  menus?: Record<string, Partial<MenuItem>>;
  content?: Partial<SiteContent>;
  faqs?: FaqItem[];
}

/* ============================================================================
 * Poin 11: Next.js Props & Children Interfaces
 * ============================================================================ */

export interface SectionContainerProps {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}

export interface SectionHeadingProps {
  label: string;
  title: string;
  highlight?: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  overlayClassName?: string;
  modalClassName?: string;
  ariaLabelledBy?: string;
  children: React.ReactNode;
}

export interface ButtonProps {
  label?: string;
  variant?: "primary" | "secondary" | "outline" | "danger" | "modulePrimary";
  size?: "sm" | "md" | "lg";
  href?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  title?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  children?: React.ReactNode;
}

export interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export interface StatBadgeProps {
  value: string;
  label: string;
  children?: React.ReactNode;
}

export interface MenuCardProps {
  menu: MenuItem;
  isFavorite: boolean;
  onToggleFavorite: (name: string) => void;
  onOpenDetail: (menu: MenuItem) => void;
  onAddChoice: (name: string) => void;
  children?: React.ReactNode;
}
