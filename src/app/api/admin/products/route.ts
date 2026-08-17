import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { productSchema } from "@/lib/validation";
import { randomUUID } from "crypto";
import { desc } from "drizzle-orm";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db.select().from(products).orderBy(desc(products.createdAt));
  return NextResponse.json({ products: rows });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid product data", details: parsed.error.flatten() }, { status: 400 });
  }

  const newId = randomUUID();
  try {
    await db.insert(products).values({
      id: newId,
      ...parsed.data,
      isDemo: false,
      status: parsed.data.status ?? "published",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("UNIQUE")) {
      return NextResponse.json({ error: "A product with this slug or SKU already exists." }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "Could not create product." }, { status: 500 });
  }

  return NextResponse.json({ id: newId }, { status: 201 });
}
