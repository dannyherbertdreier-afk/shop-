export interface Variant {
  id: string;
  title: string; // e.g. "Waldgrün / M"
  options: string[]; // values in the order of Product.options
  price: number; // cents
  compareAtPrice: number | null; // cents
  available: boolean;
  image: string | null;
}

export interface ProductOption {
  name: string; // e.g. "Farbe", "Größe"
  values: string[];
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  category: string; // collection handle
  tags: string[];
  /** Sample data: not a real supplier product. */
  isExample: boolean;
  summary: string;
  descriptionHtml: string;
  options: ProductOption[];
  images: string[];
  variants: Variant[];
  featuredRank: number | null;
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
