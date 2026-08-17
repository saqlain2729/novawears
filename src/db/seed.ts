import { db, sqlite } from "./index";
import { categories, products, settings, admins } from "./schema";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

function id() {
  return randomUUID();
}

async function main() {
  // ---------- Settings (single row, insert if missing) ----------
  const existingSettings = sqlite.prepare("SELECT id FROM settings WHERE id = 'main'").get();
  if (!existingSettings) {
    await db.insert(settings).values({ id: "main" });
    console.log("✅ Settings row created");
  }

  // ---------- Admin account ----------
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@novawears.pk";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  const existingAdmin = sqlite.prepare("SELECT id FROM admins WHERE email = ?").get(adminEmail);
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await db.insert(admins).values({
      id: id(),
      email: adminEmail,
      passwordHash,
      name: "Store Admin",
    });
    console.log(`✅ Admin account created — email: ${adminEmail} / password: ${adminPassword}`);
    console.log("   ⚠️  Change this password immediately after first login (Settings not yet exposed for this — update directly in DB or re-seed with new SEED_ADMIN_PASSWORD).");
  }

  // ---------- Categories ----------
  const categoryDefs = [
    { name: "Earbuds", slug: "earbuds", description: "True wireless sound, engineered for everyday carry.", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80" },
    { name: "Headphones", slug: "headphones", description: "Over-ear comfort with studio-grade clarity.", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80" },
    { name: "Chargers", slug: "chargers", description: "Fast, reliable power for every device you own.", image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80" },
    { name: "Hands-Free", slug: "hands-free", description: "Wired hands-free sets built for daily reliability.", image: "https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?w=800&q=80" },
    { name: "Mobile Accessories", slug: "mobile-accessories", description: "The small essentials that complete your setup.", image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80" },
    { name: "New Arrivals", slug: "new-arrivals", description: "The latest additions to the NOVAWEARS lineup.", image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80" },
  ];

  const categoryIds: Record<string, string> = {};
  for (let i = 0; i < categoryDefs.length; i++) {
    const c = categoryDefs[i];
    const existing = sqlite.prepare("SELECT id FROM categories WHERE slug = ?").get(c.slug) as { id: string } | undefined;
    if (existing) {
      categoryIds[c.slug] = existing.id;
      continue;
    }
    const newId = id();
    categoryIds[c.slug] = newId;
    await db.insert(categories).values({ id: newId, ...c, sortOrder: i });
  }
  console.log("✅ Categories seeded");

  // ---------- Demo Products ----------
  const demoProducts = [
    {
      name: "DEMO — NovaBuds Pro Wireless Earbuds",
      slug: "demo-novabuds-pro",
      description:
        "DEMO PRODUCT. Active noise cancelling true-wireless earbuds with a 30-hour case battery and IPX5 water resistance. Replace this with your real product before launch.",
      price: 8999,
      salePrice: 6999,
      categorySlug: "earbuds",
      sku: "DEMO-NB-001",
      stock: 24,
      images: [
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1000&q=80",
        "https://images.unsplash.com/photo-1590658006821-04e5d1b18c9e?w=1000&q=80",
      ],
      features: ["Active Noise Cancellation", "30-hour total battery life", "IPX5 water resistant", "Touch controls"],
      specifications: [
        { label: "Driver Size", value: "10mm" },
        { label: "Bluetooth", value: "5.3" },
        { label: "Battery (buds)", value: "6 hours" },
        { label: "Charging", value: "USB-C" },
      ],
      colors: ["Black", "White"],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
    },
    {
      name: "DEMO — NovaSound Over-Ear Headphones",
      slug: "demo-novasound-headphones",
      description:
        "DEMO PRODUCT. Over-ear headphones with deep bass tuning and plush memory-foam ear cushions for long listening sessions. Replace this with your real product before launch.",
      price: 12999,
      salePrice: null,
      categorySlug: "headphones",
      sku: "DEMO-NH-002",
      stock: 12,
      images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=1000&q=80"],
      features: ["40mm dynamic drivers", "Foldable design", "3.5mm + Bluetooth", "50-hour battery"],
      specifications: [
        { label: "Impedance", value: "32 Ω" },
        { label: "Bluetooth", value: "5.2" },
        { label: "Weight", value: "230g" },
      ],
      colors: ["Black", "Silver"],
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
    },
    {
      name: "DEMO — NovaCharge 33W Fast Charger",
      slug: "demo-novacharge-33w",
      description:
        "DEMO PRODUCT. Compact 33W PD fast charger with intelligent chip protection. Replace this with your real product before launch.",
      price: 2499,
      salePrice: 1999,
      categorySlug: "chargers",
      sku: "DEMO-NC-003",
      stock: 3,
      images: ["https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=1000&q=80"],
      features: ["33W Power Delivery", "Overcharge protection", "Compact travel size"],
      specifications: [
        { label: "Output", value: "5V/3A, 9V/3A, 12V/2.5A" },
        { label: "Input", value: "100–240V" },
      ],
      colors: ["White"],
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
    },
    {
      name: "DEMO — NovaLine Wired Hands-Free",
      slug: "demo-novaline-handsfree",
      description:
        "DEMO PRODUCT. Reliable wired hands-free with in-line mic and remote, tuned for calls and daily listening. Replace this with your real product before launch.",
      price: 899,
      salePrice: null,
      categorySlug: "hands-free",
      sku: "DEMO-NL-004",
      stock: 0,
      images: ["https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?w=1000&q=80"],
      features: ["In-line microphone", "Tangle-resistant cable", "Universal 3.5mm jack"],
      specifications: [{ label: "Cable Length", value: "1.2m" }],
      colors: ["Black"],
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: false,
    },
  ];

  for (const p of demoProducts) {
    const existing = sqlite.prepare("SELECT id FROM products WHERE slug = ?").get(p.slug);
    if (existing) continue;
    const { categorySlug, ...rest } = p;
    await db.insert(products).values({
      id: id(),
      ...rest,
      categoryId: categoryIds[categorySlug],
      isDemo: true,
      status: "published",
    });
  }
  console.log("✅ Demo products seeded (clearly marked, safe to delete from Admin → Products)");

  console.log("\n🎉 Seed complete.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
