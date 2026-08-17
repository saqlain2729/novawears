import Link from "next/link";
import { StoreSettings } from "@/types";
import { buildWhatsAppContactLink } from "@/lib/whatsapp";

const SHOP_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Earbuds", href: "/shop?category=earbuds" },
  { label: "Headphones", href: "/shop?category=headphones" },
  { label: "Chargers", href: "/shop?category=chargers" },
  { label: "Hands-Free", href: "/shop?category=hands-free" },
  { label: "Mobile Accessories", href: "/shop?category=mobile-accessories" },
  { label: "New Arrivals", href: "/shop?category=new-arrivals" },
];

const CARE_LINKS = [
  { label: "Contact", href: "/contact" },
  { label: "Shipping Policy", href: "/policies/shipping" },
  { label: "Returns", href: "/policies/returns" },
  { label: "Privacy Policy", href: "/policies/privacy" },
  { label: "Terms & Conditions", href: "/policies/terms" },
  { label: "FAQs", href: "/policies/faq" },
];

export default function Footer({ settings }: { settings: StoreSettings }) {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2">
            <div className="font-display text-2xl tracking-[0.15em] font-semibold">{settings.storeName}</div>
            <p className="mt-3 text-sm text-silver tracking-wide">WEAR THE FUTURE.</p>
            <div className="mt-6 flex items-center gap-4">
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook" className="opacity-70 hover:opacity-100 transition-opacity">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z"/></svg>
                </a>
              )}
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" className="opacity-70 hover:opacity-100 transition-opacity">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>
                </a>
              )}
              {settings.tiktokUrl && (
                <a href={settings.tiktokUrl} target="_blank" rel="noreferrer" aria-label="TikTok" className="opacity-70 hover:opacity-100 transition-opacity">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c.4 2.2 1.9 3.8 4.1 4.1v3a7.1 7.1 0 0 1-4.1-1.3v6.7a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v3.1a2.6 2.6 0 1 0 1.8 2.4V3h2.9Z"/></svg>
                </a>
              )}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest2 text-silver-dark mb-4">Shop</div>
            <ul className="space-y-2.5 text-sm text-silver">
              {SHOP_LINKS.map((l) => (
                <li key={l.label}><Link href={l.href} className="hover:text-paper transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest2 text-silver-dark mb-4">Customer Care</div>
            <ul className="space-y-2.5 text-sm text-silver">
              {CARE_LINKS.map((l) => (
                <li key={l.label}><Link href={l.href} className="hover:text-paper transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4 text-xs text-silver-dark">
          <span>© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</span>
          <div className="flex gap-5">
            <a href={`mailto:${settings.businessEmail}`} className="hover:text-paper transition-colors">{settings.businessEmail}</a>
            <a href={buildWhatsAppContactLink(settings.whatsappNumber)} target="_blank" rel="noreferrer" className="hover:text-paper transition-colors">
              WhatsApp: +{settings.whatsappNumber}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
