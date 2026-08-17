export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice: number | null;
  categoryId: string;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  brand: string | null;
  images: string[];
  features: string[];
  specifications: { label: string; value: string }[];
  colors: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isDemo: boolean;
  status: "draft" | "published" | "hidden";
  createdAt: string | null;
  updatedAt: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sortOrder: number | null;
}

export interface OrderItemRow {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  color: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  province: string;
  postalCode: string | null;
  notes: string | null;
  paymentMethod: string | null;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: string;
  createdAt: string | null;
  items: OrderItemRow[];
}

export interface StoreSettings {
  id: string;
  storeName: string;
  businessEmail: string;
  whatsappNumber: string;
  currency: string;
  shippingFee: number;
  freeShippingThreshold: number;
  codAvailable: boolean;
  lowStockThreshold: number;
  announcement: string;
  deliveryEstimate: string;
  facebookUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
}
