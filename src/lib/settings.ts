import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";

const DEFAULT_SETTINGS = {
  id: "main",
  storeName: "NOVAWEARS",
  businessEmail: "novawears2729@gmail.com",
  whatsappNumber: "923016584975",
  currency: "PKR",
  shippingFee: 250,
  freeShippingThreshold: 5000,
  codAvailable: true,
  lowStockThreshold: 5,
  announcement: "PREMIUM MOBILE ACCESSORIES • CASH ON DELIVERY ACROSS PAKISTAN",
  deliveryEstimate: "3–7 business days",
  facebookUrl: "",
  instagramUrl: "",
  tiktokUrl: "",
};

export async function getSettings() {
  try {
    const rows = await db.select().from(settings).where(eq(settings.id, "main"));
    if (rows[0]) return rows[0];
  } catch (err) {
    // DB may be unavailable during build (e.g. Vercel build with no
    // DATABASE_URL) — fall through to defaults so pre-rendering succeeds.
    console.warn("[settings] DB unavailable, using defaults:", err);
  }
  // Fallback if seed hasn't run yet — mirrors schema defaults.
  return DEFAULT_SETTINGS;
}

export function formatMoney(amount: number, currency = "PKR") {
  return `${currency} ${Math.round(amount).toLocaleString("en-PK")}`;
}
