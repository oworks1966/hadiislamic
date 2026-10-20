export type Category = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  sort_order: number;
  active: boolean;
  arabic_name?: string;
  image_url?: string | null;
  description?: string;
  product_count?: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  category_id: string | null;
  image_url: string | null;
  gallery: string[];
  weight_grams: number;
  stock: number;
  featured: boolean;
  active: boolean;
  sku: string | null;
  created_at?: string;
  badge?: string;
  package_size?: string;
  origin?: string;
  benefits?: string[];
  rating?: number;
  review_count?: number;
  variations?: {
    name: string;
    options: { label: string; price: number; compare_at_price?: number }[];
  }[];
  specs?: Record<string, string>;
};

export type CartLine = {
  product: Product;
  quantity: number;
  selectedVariation?: string;
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  image_url: string | null;
  button_text: string;
  button_url: string;
  active: boolean;
  sort_order: number;
  badge?: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: string;
  author: string;
  excerpt: string;
  content: string[];
  image_url: string;
  read_time: string;
};

export type ShippingZone = {
  id: string;
  name: string;
  provinces: string[];
  active: boolean;
};

export type ShippingRate = {
  id: string;
  zone_id: string;
  max_weight_grams: number;
  price: number;
};

export type Coupon = {
  id: string;
  code: string;
  discount_type: 'percent' | 'fixed';
  amount: number;
  min_subtotal: number;
  max_uses: number | null;
  uses: number;
  starts_at: string | null;
  ends_at: string | null;
  active: boolean;
};

export type Order = {
  id: string;
  created_at: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  province: string;
  postal_code: string | null;
  payment_method: string;
  payment_reference: string | null;
  status: string;
  payment_status: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  items: any[];
};
