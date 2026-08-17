import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.status, "published")));

  const product = rows[0];
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const related = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.categoryId, product.categoryId),
        ne(products.id, product.id),
        eq(products.status, "published")
      )
    )
    .limit(4);

  return NextResponse.json({ product, related });
}
