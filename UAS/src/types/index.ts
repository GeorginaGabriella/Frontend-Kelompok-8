import React from "react";

export type FilterGroup =
  | "semua"
  | "gado-gado"
  | "minuman-tradisional"
  | "dessert";

export type MenuGroup =
  | "Makanan"
  | "Minuman Tradisional"
  | "dessert"
  | "lainnya";

export interface MenuItem {
  slug: string;
  name: string;
  searchName: string;
  kategori: string;
  group: MenuGroup;
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
  onAddToCart?: (menu: MenuItem) => void;
  children?: React.ReactNode;
}

// ═══════════════════════════ SLIDING BANNER (PROMO) ═══════════════════════════

export type PromoAccent = "emerald" | "gold" | "clove" | "ember";

export interface PromoSlide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  code: string;
  ctaLabel: string;
  image: string;
  accent: PromoAccent;
}

export interface PromoBannerProps {
  slides: PromoSlide[];
  interval?: number;
  onUseCode?: (code: string) => void;
  children?: React.ReactNode;
}

// ═══════════════════════════════ CART & ORDER ════════════════════════════════

export interface CartItem {
  slug: string;
  name: string;
  image: string;
  priceLabel: string;
  unitPrice: number;
  quantity: number;
}

export type DiscountType = "percent" | "amount" | "shipping";

export interface DiscountCodeSeed {
  code: string;
  label: string;
  type: DiscountType;
  value: number;
  minSpend: number;
  maxDiscount: number;
  freeShipping: boolean;
}

export interface DiscountCodeItem extends DiscountCodeSeed {
  id?: number;
  active?: boolean;
}

export interface AppliedDiscount {
  code: string;
  label: string;
  amount: number;
  freeShipping: boolean;
}

export interface ShippingAddress {
  recipient: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  note: string;
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export interface OrderItem {
  slug: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface OrderRecord {
  id: number;
  orderCode: string;
  username: string;
  recipient: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  note: string;
  items: OrderItem[];
  subtotal: number;
  discountCode: string;
  discountAmount: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export type OrderStatus = "baru" | "diproses" | "dikirim" | "selesai" | "batal";

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  address: ShippingAddress;
  onAddressChange: (field: keyof ShippingAddress, value: string) => void;
  onIncrease: (slug: string) => void;
  onDecrease: (slug: string) => void;
  onRemove: (slug: string) => void;
  onClear: () => void;
  discountInput: string;
  onDiscountInputChange: (value: string) => void;
  appliedDiscount: AppliedDiscount | null;
  discountError: string;
  onApplyDiscount: () => void;
  onRemoveDiscount: () => void;
  totals: OrderTotals;
  shippingBase: number;
  freeShippingThreshold: number;
  submitting: boolean;
  onCheckout: () => void;
  lastOrder: OrderRecord | null;
  onDismissLastOrder: () => void;
  children?: React.ReactNode;
}

// ═══════════════════════ CUSTOMER SERVICE (KOMENTAR) ════════════════════════

export interface CommentItem {
  id: number;
  name: string;
  topic: string;
  rating: number;
  message: string;
  reply: string;
  published: boolean;
  createdAt: string;
}

export interface CustomerServiceSectionProps {
  comments: CommentItem[];
  loading?: boolean;
  submitting?: boolean;
  defaultName?: string;
  onSubmitComment: (payload: {
    name: string;
    topic: string;
    rating: number;
    message: string;
  }) => Promise<boolean>;
  children?: React.ReactNode;
}
