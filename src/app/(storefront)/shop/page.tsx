import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getSettings } from "@/lib/settings";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; featured?: string }>;
}) {
  const params = await searchParams;
  const [allCats, settings] = await Promise.all([db.select().from(categories), getSettings()]);

  const conditions = [eq(products.status, "published")];
  let activeCategory = null;

  if (params.category) {
    activeCategory = allCats.find((c) => c.slug === params.category) || null;
    if (activeCategory) conditions.push(eq(products.categoryId, activeCategory.id));
  }
  if (params.featured === "true") conditions.push(eq(products.isFeatured, true));

  const rows = await db
    .select()
    .from(products)
    .where(and(...conditions));

  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-8 py-14">
      <Reveal>
        <p className="text-[11px] tracking-widest2 uppercase text-silver-dark mb-2">Shop</p>
        <h1 className="font-display text-3xl md:text-5xl tracking-tight mb-8">
          {activeCategory ? activeCategory.name : "All Products"}
        </h1>
        {activeCategory?.description && (
          <p className="text-silver-dark max-w-xl mb-8">{activeCategory.description}</p>
        )}
      </Reveal>

      <div className="flex flex-wrap gap-2 mb-10 border-b border-line-light pb-8">
        <Link
          href="/shop"
          className={`px-4 py-2 text-[11px] tracking-widest2 uppercase border ${
            !activeCategory ? "bg-ink text-paper border-ink" : "border-line-light text-silver-dark"
          }`}
        >
          All
        </Link>
        {allCats.map((c) => (
          <Link
            key={c.id}
            href={`/shop?category=${c.slug}`}
            className={`px-4 py-2 text-[11px] tracking-widest2 uppercase border ${
              activeCategory?.slug === c.slug ? "bg-ink text-paper border-ink" : "border-line-light text-silver-dark"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-xl mb-2">No products found.</p>
          <p className="text-silver-dark text-sm">Try a different category or check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
          {rows.map((p, i) => (
            <Reveal key={p.id} delay={(i % 8) * 60}>
              <ProductCard product={p as never} currency={settings.currency} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
