import { notFound } from "next/navigation";
import { getSettings } from "@/lib/settings";
import Reveal from "@/components/Reveal";
import type { Metadata } from "next";

const POLICIES: Record<string, { title: string; body: (settings: { deliveryEstimate: string; businessEmail: string; storeName: string }) => string[] }> = {
  shipping: {
    title: "Shipping Policy",
    body: (s) => [
      `${s.storeName} currently ships across Pakistan with Cash on Delivery. Estimated delivery time is ${s.deliveryEstimate} from order confirmation, though this can vary by city and courier load.`,
      "Shipping fees are calculated at checkout based on your order total and delivery location, and are configurable by the store admin.",
      "PLACEHOLDER — replace with your actual courier partner, coverage areas, and any region-specific delivery timelines before launch.",
    ],
  },
  returns: {
    title: "Return Policy",
    body: (s) => [
      `If you receive a damaged, defective, or incorrect item, contact us at ${s.businessEmail} or on WhatsApp within 3 days of delivery.`,
      "PLACEHOLDER — this is a reasonable starting point, not a legal guarantee. Define your actual return window, condition requirements, and who covers return shipping before launch.",
    ],
  },
  refund: {
    title: "Refund Policy",
    body: () => [
      "Approved returns are refunded via your original payment method, or as store credit, once the returned item is received and inspected.",
      "PLACEHOLDER — specify your actual refund timeline and method before launch.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    body: (s) => [
      `${s.storeName} collects the information you provide at checkout — name, phone, email, and address — solely to process and deliver your order.`,
      "We do not sell customer data to third parties.",
      "PLACEHOLDER — have this reviewed by a legal professional before launch, especially if you plan to run ads or use analytics/tracking tools.",
    ],
  },
  terms: {
    title: "Terms & Conditions",
    body: (s) => [
      `By placing an order with ${s.storeName}, you agree to provide accurate delivery information and to be available to receive Cash on Delivery orders.`,
      "PLACEHOLDER — have this reviewed by a legal professional before launch.",
    ],
  },
  faq: {
    title: "FAQs",
    body: (s) => [
      `Do you offer Cash on Delivery? Yes, across Pakistan, with delivery in ${s.deliveryEstimate}.`,
      `How do I contact support? Email ${s.businessEmail} or message us on WhatsApp — the link is in the footer.`,
      "PLACEHOLDER — add real, product-specific FAQs as they come up.",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(POLICIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const policy = POLICIES[slug];
  return policy ? { title: `${policy.title} | NOVAWEARS` } : {};
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = POLICIES[slug];
  if (!policy) notFound();

  const settings = await getSettings();
  const paragraphs = policy.body(settings);

  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <Reveal>
        <h1 className="font-display text-3xl tracking-tight mb-8">{policy.title}</h1>
        <div className="space-y-4 text-sm text-silver-dark leading-relaxed">
          {paragraphs.map((p, i) => (
            <p key={i} className={p.startsWith("PLACEHOLDER") ? "italic border-l-2 border-signal pl-4" : ""}>
              {p}
            </p>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
