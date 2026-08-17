/**
 * Centralized WhatsApp helpers.
 *
 * The business number lives in Settings (DB-backed, editable from the admin
 * dashboard) with an env var fallback (WHATSAPP_NUMBER) for first boot.
 * Never hardcode the raw number in components — always go through here.
 */

export function buildWhatsAppOrderLink(opts: {
  whatsappNumber: string; // international format, no + or spaces, e.g. 923016584975
  productName: string;
  price: string;
  quantity: number;
}) {
  const message = [
    "Assalam o Alaikum, I want to order:",
    "",
    `Product: ${opts.productName}`,
    `Price: ${opts.price}`,
    `Quantity: ${opts.quantity}`,
    "",
    "Please confirm availability.",
  ].join("\n");

  return `https://wa.me/${opts.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppContactLink(whatsappNumber: string, message = "Assalam o Alaikum, I have a question about NOVAWEARS.") {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
