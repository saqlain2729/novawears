import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const settings = await getSettings();

  const allOrders = await db.select().from(orders);
  const allProducts = await db.select().from(products);

  const today = new Date().toISOString().slice(0, 10);
  const todaysOrders = allOrders.filter((o) => (o.createdAt || "").slice(0, 10) === today);
  const pendingOrders = allOrders.filter((o) => o.status === "pending");
  const totalRevenue = allOrders
    .filter((o) => o.status !== "cancelled" && o.status !== "returned")
    .reduce((sum, o) => sum + o.total, 0);

  const outOfStock = allProducts.filter((p) => p.stock === 0);
  const lowStock = allProducts.filter(
    (p) => p.stock > 0 && p.stock <= (p.lowStockThreshold || settings.lowStockThreshold)
  );
  const totalInventory = allProducts.reduce((sum, p) => sum + p.stock, 0);

  // last 7 days order counts for a simple sales chart
  const salesByDay: { date: string; orders: number; revenue: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const dayOrders = allOrders.filter((o) => (o.createdAt || "").slice(0, 10) === key);
    salesByDay.push({
      date: key,
      orders: dayOrders.length,
      revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
    });
  }

  return NextResponse.json({
    todaysOrders: todaysOrders.length,
    totalOrders: allOrders.length,
    pendingOrders: pendingOrders.length,
    totalRevenue,
    totalProducts: allProducts.length,
    lowStock: lowStock.length,
    outOfStock: outOfStock.length,
    totalInventory,
    salesByDay,
    currency: settings.currency,
  });
}
