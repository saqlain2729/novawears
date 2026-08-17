import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { and, desc, eq, like, or, inArray } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q");

  const conditions = [];
  if (status && status !== "all") conditions.push(eq(orders.status, status as never));
  if (q) {
    conditions.push(
      or(
        like(orders.orderNumber, `%${q}%`),
        like(orders.customerName, `%${q}%`),
        like(orders.phone, `%${q}%`)
      )!
    );
  }

  const rows = await db
    .select()
    .from(orders)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(orders.createdAt));

  const orderIds = rows.map((o) => o.id);
  const items = orderIds.length
    ? await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds))
    : [];

  const withItems = rows.map((o) => ({
    ...o,
    items: items.filter((i) => i.orderId === o.id),
  }));

  return NextResponse.json({ orders: withItems });
}
