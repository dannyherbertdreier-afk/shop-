export interface Variant {
  id: string;
  title: string;
  price: number; // cents
  compareAtPrice: number | null; // cents
  available: boolean;
  image: string | null;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  type: string;
  tags: string[];
  createdAt: string;
  descriptionHtml: string;
  optionName: string;
  images: string[];
  variants: Variant[];
  bestsellerRank: number | null;
}

export interface CartLine {
  variantId: string;
  handle: string;
  quantity: number;
}

export interface ResolvedLine extends CartLine {
  product: Product;
  variant: Variant;
  lineTotal: number;
}

export interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
}

export interface Order {
  number: string;
  createdAt: string;
  email: string;
  address: Address;
  shippingMethod: string;
  paymentMethod: string;
  lines: { title: string; variantTitle: string; image: string | null; quantity: number; unitPrice: number }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}
