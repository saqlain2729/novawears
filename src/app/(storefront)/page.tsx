import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { getSettings } from "@/lib/settings";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { Product } from "@/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [cats, featured, newArrivals, settings] = await Promise.all([
    db.select().from(categories).orderBy(asc(categories.sortOrder)).limit(6),
    db.select().from(products).where(eq(products.isFeatured, true)).limit(4),
    db.select().from(products).where(eq(products.isNewArrival, true)).limit(4),
    getSettings(),
  ]);

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[92vh] min-h-[600px] bg-ink text-paper overflow-hidden flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1800&q=80"
            alt=""
            fill
            priority
            className="object-cover opacity-45 scale-105 animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/70" />
        </div>

        <div className="relative mx-auto max-w-7xl w-full px-5 lg:px-8">
          <p className="animate-fade-up text-[11px] tracking-widest2 uppercase text-silver mb-6" style={{ animationDelay: "100ms" }}>
            {settings.storeName} — Mobile Accessories
          </p>
          <h1
            className="animate-fade-up font-display text-[13vw] leading-[0.95] sm:text-7xl md:text-8xl font-semibold tracking-tight text-balance max-w-4xl"
            style={{ animationDelay: "220ms" }}
          >
            TECH. STYLE.
            <br />
            FUTURE.
          </h1>
          <p className="animate-fade-up mt-6 max-w-md text-silver text-base" style={{ animationDelay: "380ms" }}>
            Premium mobile accessories designed for modern everyday life.
          </p>
          <div className="animate-fade-up mt-9 flex flex-wrap gap-4" style={{ animationDelay: "500ms" }}>
            <Link
              href="/shop"
              className="bg-paper text-ink px-8 py-4 text-[12px] tracking-widest2 uppercase hover:bg-silver transition-colors"
            >
              Shop Now
            </Link>
            <Link
              href="/shop?category=new-arrivals"
              className="border border-paper/50 px-8 py-4 text-[12px] tracking-widest2 uppercase hover:border-paper transition-colors"
            >
              Explore Collection
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-paper/10 overflow-hidden">
          <div className="h-full w-1/3 bg-signal/70 animate-scan" />
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-24">
        <Reveal>
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-display text-3xl md:text-4xl tracking-tight">Shop by Category</h2>
            <Link href="/shop" className="hidden sm:block text-[12px] tracking-widest2 uppercase border-b border-ink pb-1">
              View All
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {cats.map((c, i) => (
            <Reveal key={c.id} delay={i * 80}>
              <CategoryCard category={c} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="bg-paper-dim py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <Reveal>
              <div className="flex items-end justify-between mb-10">
                <h2 className="font-display text-3xl md:text-4xl tracking-tight">Featured</h2>
                <Link href="/shop?featured=true" className="hidden sm:block text-[12px] tracking-widest2 uppercase border-b border-ink pb-1">
                  View All
                </Link>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
              {(featured as unknown as Product[]).map((p, i) => (
                <Reveal key={p.id} delay={i * 90}>
                  <ProductCard product={p} currency={settings.currency} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BRAND STATEMENT */}
      <section className="mx-auto max-w-4xl px-5 lg:px-8 py-28 text-center">
        <Reveal>
          <p className="text-[11px] tracking-widest2 uppercase text-silver-dark mb-6">Our Approach</p>
          <p className="font-display text-2xl md:text-4xl leading-tight tracking-tight text-balance">
            We build accessories for people who expect their technology to look as considered
            as it performs — engineered quietly, finished deliberately.
          </p>
        </Reveal>
      </section>

      {/* NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 lg:px-8 pb-24">
          <Reveal>
            <div className="flex items-end justify-between mb-10">
              <h2 className="font-display text-3xl md:text-4xl tracking-tight">New Arrivals</h2>
              <Link href="/shop?category=new-arrivals" className="hidden sm:block text-[12px] tracking-widest2 uppercase border-b border-ink pb-1">
                View All
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
            {(newArrivals as unknown as Product[]).map((p, i) => (
              <Reveal key={p.id} delay={i * 90}>
                <ProductCard product={p} currency={settings.currency} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* COD STRIP */}
      <section className="bg-ink text-paper py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
          <Reveal>
            <p className="text-[11px] tracking-widest2 uppercase text-silver-dark mb-2">Nationwide</p>
            <p className="text-sm text-silver">Cash on Delivery available across Pakistan.</p>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-[11px] tracking-widest2 uppercase text-silver-dark mb-2">Delivery</p>
            <p className="text-sm text-silver">{settings.deliveryEstimate}, tracked from dispatch.</p>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-[11px] tracking-widest2 uppercase text-silver-dark mb-2">Support</p>
            <p className="text-sm text-silver">Order help on WhatsApp, any time.</p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
