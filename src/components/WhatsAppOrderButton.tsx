"use client";

import { buildWhatsAppOrderLink } from "@/lib/whatsapp";
import { formatMoneyClient } from "@/lib/format";

export default function WhatsAppOrderButton({
  whatsappNumber,
  productName,
  price,
  quantity,
  currency = "PKR",
}: {
  whatsappNumber: string;
  productName: string;
  price: number;
  quantity: number;
  currency?: string;
}) {
  const link = buildWhatsAppOrderLink({
    whatsappNumber,
    productName,
    price: formatMoneyClient(price, currency),
    quantity,
  });

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-center gap-2 w-full border border-ink py-3.5 text-[13px] tracking-widest2 uppercase hover:bg-ink hover:text-paper transition-colors"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.7.9-.3.1-.5 0a6.6 6.6 0 0 1-1.9-1.2 7 7 0 0 1-1.3-1.6c-.1-.2 0-.4.1-.5l.4-.4.2-.3v-.3c0-.1-.5-1.3-.7-1.7s-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.8 2 4.6 4.6 0 0 0 1 2.5 10.6 10.6 0 0 0 4.1 3.6c.6.2 1 .4 1.4.5a3.3 3.3 0 0 0 1.5.1 2.4 2.4 0 0 0 1.6-1.1 2 2 0 0 0 .1-1.1c-.1-.1-.2-.2-.4-.3Z" />
      </svg>
      Order on WhatsApp
    </a>
  );
}
