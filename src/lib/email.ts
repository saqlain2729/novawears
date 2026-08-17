/**
 * Order email notifications.
 *
 * This project does NOT fake email sending. To actually send emails you must
 * configure a provider. We use Resend (https://resend.com) because it needs
 * only one API key and works well from serverless/Next.js — but you can swap
 * the `sendViaResend` call below for any provider's SDK.
 *
 * Required environment variables (see .env.example):
 *   RESEND_API_KEY   — from https://resend.com/api-keys
 *   EMAIL_FROM       — a verified sending address/domain in Resend
 *
 * If RESEND_API_KEY is not set, emails are skipped and logged — orders still
 * complete normally. Nothing is silently pretended to have sent.
 */

interface OrderEmailPayload {
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  items: { productName: string; quantity: number; unitPrice: number }[];
  total: number;
  currency: string;
  businessEmail: string;
  customerEmail?: string | null;
}

async function sendViaResend(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.warn(
      `[email] Skipped sending "${subject}" to ${to} — RESEND_API_KEY / EMAIL_FROM not configured. See .env.example.`
    );
    return { sent: false, reason: "not_configured" as const };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[email] Resend send failed (${res.status}): ${text}`);
    return { sent: false, reason: "provider_error" as const };
  }

  return { sent: true as const };
}

function itemsHtml(items: OrderEmailPayload["items"], currency: string) {
  return items
    .map(
      (i) =>
        `<tr><td>${i.productName}</td><td>${i.quantity}</td><td>${currency} ${i.unitPrice.toLocaleString()}</td></tr>`
    )
    .join("");
}

export async function sendAdminOrderNotification(payload: OrderEmailPayload) {
  const subject = `New NOVAWEARS Order #${payload.orderNumber}`;
  const html = `
    <h2>New order received</h2>
    <p><b>Customer:</b> ${payload.customerName}</p>
    <p><b>Phone:</b> ${payload.phone}</p>
    <table border="1" cellpadding="6" cellspacing="0">
      <thead><tr><th>Product</th><th>Qty</th><th>Price</th></tr></thead>
      <tbody>${itemsHtml(payload.items, payload.currency)}</tbody>
    </table>
    <p><b>Total:</b> ${payload.currency} ${payload.total.toLocaleString()}</p>
    <p><b>Payment:</b> Cash on Delivery</p>
    <p><b>Address:</b> ${payload.address}</p>
  `;
  return sendViaResend(payload.businessEmail, subject, html);
}

export async function sendContactMessage(payload: {
  name: string;
  email: string;
  message: string;
  businessEmail: string;
}) {
  const subject = `New contact form message from ${payload.name}`;
  const html = `
    <h2>New contact message</h2>
    <p><b>From:</b> ${payload.name} (${payload.email})</p>
    <p>${payload.message.replace(/\n/g, "<br/>")}</p>
  `;
  return sendViaResend(payload.businessEmail, subject, html);
}

export async function sendCustomerOrderConfirmation(payload: OrderEmailPayload) {
  if (!payload.customerEmail) return { sent: false, reason: "no_customer_email" as const };
  const subject = `Your NOVAWEARS order #${payload.orderNumber} is confirmed`;
  const html = `
    <h2>Thank you, ${payload.customerName}!</h2>
    <p>Your order <b>#${payload.orderNumber}</b> has been received and will be processed shortly.</p>
    <table border="1" cellpadding="6" cellspacing="0">
      <thead><tr><th>Product</th><th>Qty</th><th>Price</th></tr></thead>
      <tbody>${itemsHtml(payload.items, payload.currency)}</tbody>
    </table>
    <p><b>Total:</b> ${payload.currency} ${payload.total.toLocaleString()} (Cash on Delivery)</p>
    <p>We'll contact you at ${payload.phone} to confirm delivery details.</p>
  `;
  return sendViaResend(payload.customerEmail, subject, html);
}
