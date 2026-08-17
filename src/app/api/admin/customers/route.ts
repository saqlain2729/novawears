import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { desc } from "drizzle-orm";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));

  const byPhone = new Map<
    string,
    { name: string; phone: string; email: string | null; orderCount: number; totalSpent: number; latestOrder: string }
  >();

  for (const o of allOrders) {
    const existing = byPhone.get(o.phone);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += o.total;
    } else {
      byPhone.set(o.phone, {
        name: o.customerName,
        phone: o.phone,
        email: o.email,
        orderCount: 1,
        totalSpent: o.total,
        latestOrder: o.createdAt || "",
      });
    }
  }

  return NextResponse.json({ customers: Array.from(byPhone.values()) });
}
