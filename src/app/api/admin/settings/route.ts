import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

const settingsSchema = z.object({
  storeName: z.string().min(1).optional(),
  businessEmail: z.string().email().optional(),
  whatsappNumber: z.string().min(6).optional(),
  currency: z.string().min(1).optional(),
  shippingFee: z.number().min(0).optional(),
  freeShippingThreshold: z.number().min(0).optional(),
  codAvailable: z.boolean().optional(),
  lowStockThreshold: z.number().int().min(0).optional(),
  announcement: z.string().optional(),
  deliveryEstimate: z.string().optional(),
  facebookUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  tiktokUrl: z.string().optional(),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await db.select().from(settings).where(eq(settings.id, "main"));
  return NextResponse.json({ settings: rows[0] });
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid settings" }, { status: 400 });

  await db.update(settings).set(parsed.data).where(eq(settings.id, "main"));
  return NextResponse.json({ ok: true });
}
