import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, and, like, or } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categorySlug = searchParams.get("category");
  const search = searchParams.get("q");
  const featured = searchParams.get("featured");
  const newArrivals = searchParams.get("new");
  const bestSellers = searchParams.get("bestseller");

  const conditions = [eq(products.status, "published")];

  if (categorySlug) {
    const cat = await db.select().from(categories).where(eq(categories.slug, categorySlug));
    if (cat[0]) conditions.push(eq(products.categoryId, cat[0].id));
    else return NextResponse.json({ products: [] });
  }

  if (search) {
    conditions.push(
      or(like(products.name, `%${search}%`), like(products.description, `%${search}%`))!
    );
  }
  if (featured === "true") conditions.push(eq(products.isFeatured, true));
  if (newArrivals === "true") conditions.push(eq(products.isNewArrival, true));
  if (bestSellers === "true") conditions.push(eq(products.isBestSeller, true));

  const rows = await db
    .select()
    .from(products)
    .where(and(...conditions));

  return NextResponse.json({ products: rows });
}
