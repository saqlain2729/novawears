import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getSettings() {
  const rows = await db.select().from(settings).where(eq(settings.id, "main"));
  if (rows[0]) return rows[0];
  // Fallback if seed hasn't run yet — mirrors schema defaults.
  return {
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
}

export function formatMoney(amount: number, currency = "PKR") {
  return `${currency} ${Math.round(amount).toLocaleString("en-PK")}`;
}
