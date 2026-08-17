import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ---------- Admins ----------
export const admins = sqliteTable("admins", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// ---------- Categories ----------
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  sortOrder: integer("sort_order").default(0),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// ---------- Products ----------
export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  salePrice: real("sale_price"),
  categoryId: text("category_id").notNull(),
  sku: text("sku").notNull().unique(),
  stock: integer("stock").notNull().default(0),
  lowStockThreshold: integer("low_stock_threshold").notNull().default(5),
  brand: text("brand").default("NOVAWEARS"),
  images: text("images", { mode: "json" }).$type<string[]>().notNull(),
  features: text("features", { mode: "json" }).$type<string[]>().default(sql`'[]'`),
  specifications: text("specifications", { mode: "json" })
    .$type<{ label: string; value: string }[]>()
    .default(sql`'[]'`),
  colors: text("colors", { mode: "json" }).$type<string[]>().default(sql`'[]'`),
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
  isNewArrival: integer("is_new_arrival", { mode: "boolean" }).default(false),
  isBestSeller: integer("is_best_seller", { mode: "boolean" }).default(false),
  isDemo: integer("is_demo", { mode: "boolean" }).default(false),
  status: text("status", { enum: ["draft", "published", "hidden"] }).default("published"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// ---------- Customers ----------
export const customers = sqliteTable("customers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// ---------- Orders ----------
export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerId: text("customer_id").notNull(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  postalCode: text("postal_code"),
  notes: text("notes"),
  paymentMethod: text("payment_method").default("cod"),
  subtotal: real("subtotal").notNull(),
  shippingFee: real("shipping_fee").notNull(),
  total: real("total").notNull(),
  status: text("status", {
    enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"],
  })
    .notNull()
    .default("pending"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// ---------- Order Items ----------
export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull(),
  productId: text("product_id").notNull(),
  productName: text("product_name").notNull(),
  color: text("color"),
  unitPrice: real("unit_price").notNull(),
  quantity: integer("quantity").notNull(),
  lineTotal: real("line_total").notNull(),
});

// ---------- Settings (single row) ----------
export const settings = sqliteTable("settings", {
  id: text("id").primaryKey().default("main"),
  storeName: text("store_name").notNull().default("NOVAWEARS"),
  businessEmail: text("business_email").notNull().default("novawears2729@gmail.com"),
  whatsappNumber: text("whatsapp_number").notNull().default("923016584975"),
  currency: text("currency").notNull().default("PKR"),
  shippingFee: real("shipping_fee").notNull().default(250),
  freeShippingThreshold: real("free_shipping_threshold").notNull().default(5000),
  codAvailable: integer("cod_available", { mode: "boolean" }).notNull().default(true),
  lowStockThreshold: integer("low_stock_threshold").notNull().default(5),
  announcement: text("announcement")
    .notNull()
    .default("PREMIUM MOBILE ACCESSORIES • CASH ON DELIVERY ACROSS PAKISTAN"),
  deliveryEstimate: text("delivery_estimate").notNull().default("3–7 business days"),
  facebookUrl: text("facebook_url").default(""),
  instagramUrl: text("instagram_url").default(""),
  tiktokUrl: text("tiktok_url").default(""),
});
