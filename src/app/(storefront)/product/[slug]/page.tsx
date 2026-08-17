import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getSettings, formatMoney } from "@/lib/settings";
import ProductGallery from "@/components/ProductGallery";
import AddToCartPanel from "@/components/AddToCartPanel";
import WhatsAppOrderButton from "@/components/WhatsAppOrderButton";
import Accordion from "@/components/Accordion";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.status, "published")));
  return rows[0] || null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} | NOVAWEARS`,
    description: product.description.slice(0, 155),
    openGraph: { images: product.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [related, settings] = await Promise.all([
    db
      .select()
      .from(products)
      .where(and(eq(products.categoryId, product.categoryId), ne(products.id, product.id), eq(products.status, "published")))
      .limit(4),
    getSettings(),
  ]);

  const onSale = product.salePrice != null && product.salePrice < product.price;
  const activePrice = product.salePrice ?? product.price;
  const lowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;

  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
        <Reveal>
          <ProductGallery images={product.images} name={product.name} />
        </Reveal>

        <Reveal delay={100}>
          <div className="md:sticky md:top-28">
            {product.isDemo && (
              <span className="inline-block mb-3 text-[10px] tracking-widest2 uppercase bg-signal/20 text-signal px-2 py-1">
                Demo Product
              </span>
            )}
            <h1 className="font-display text-3xl md:text-4xl tracking-tight text-balance">
              {product.name.replace(/^DEMO — /, "")}
            </h1>

            <div className="flex items-center gap-1 mt-3 text-signal">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3 1.2-6.9-5-4.9 6.9-1L12 2Z" />
                </svg>
              ))}
              <span className="text-xs text-silver-dark ml-2">(Demo rating — connect a reviews source)</span>
            </div>

            <div className="flex items-center gap-3 mt-5">
              <span className="text-2xl font-medium">{formatMoney(activePrice, settings.currency)}</span>
              {onSale && (
                <span className="text-base text-silver-dark line-through">
                  {formatMoney(product.price, settings.currency)}
                </span>
              )}
            </div>

            <p className="mt-2 text-sm">
              {product.stock <= 0 ? (
                <span className="text-red-600">Out of Stock</span>
              ) : lowStock ? (
                <span className="text-signal">Low Stock — Only {product.stock} left</span>
              ) : (
                <span className="text-green-700">In Stock</span>
              )}
            </p>

            <p className="mt-6 text-sm text-silver-dark leading-relaxed">{product.description}</p>

            {product.features && product.features.length > 0 && (
              <ul className="mt-6 space-y-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 w-1 h-1 bg-ink shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8">
              <AddToCartPanel product={product as never} />
            </div>

            <div className="mt-3">
              <WhatsAppOrderButton
                whatsappNumber={settings.whatsappNumber}
                productName={product.name}
                price={activePrice}
                quantity={1}
                currency={settings.currency}
              />
            </div>

            <p className="mt-4 text-xs text-silver-dark">
              Cash on Delivery available across Pakistan · Estimated delivery {settings.deliveryEstimate}
            </p>

            <div className="mt-10">
              <Accordion title="Description" defaultOpen>
                <p>{product.description}</p>
              </Accordion>
              <Accordion title="Specifications">
                {product.specifications?.length ? (
                  <table className="w-full text-sm">
                    <tbody>
                      {product.specifications.map((s) => (
                        <tr key={s.label} className="border-b border-line-light/60">
                          <td className="py-2 text-silver-dark">{s.label}</td>
                          <td className="py-2 text-right">{s.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No specifications listed for this product yet.</p>
                )}
              </Accordion>
              <Accordion title="Shipping">
                <p>
                  Cash on Delivery, estimated delivery {settings.deliveryEstimate}. Free shipping on orders over{" "}
                  {formatMoney(settings.freeShippingThreshold, settings.currency)}.
                </p>
              </Accordion>
              <Accordion title="Returns">
                <p>See our Return Policy page for full details on eligibility and process.</p>
              </Accordion>
              <Accordion title="FAQ">
                <p>Have a question about this product? Reach out on WhatsApp and we&apos;ll help right away.</p>
              </Accordion>
            </div>
          </div>
        </Reveal>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p as never} currency={settings.currency} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
