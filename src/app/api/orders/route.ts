import { NextRequest, NextResponse } from "next/server";
import { db, sqlite } from "@/db";
import { products } from "@/db/schema";
import { checkoutSchema } from "@/lib/validation";
import { generateOrderNumber } from "@/lib/order-number";
import { getSettings } from "@/lib/settings";
import { sendAdminOrderNotification, sendCustomerOrderConfirmation } from "@/lib/email";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid order data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const input = parsed.data;
  const storeSettings = await getSettings();

  // Load authoritative product data from the DB — price & stock NEVER come
  // from the client, preventing price manipulation.
  const productRows = await Promise.all(
    input.items.map((item) => db.select().from(products).where(eq(products.id, item.productId)))
  );

  const resolvedItems: {
    productId: string;
    productName: string;
    color?: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[] = [];

  for (let i = 0; i < input.items.length; i++) {
    const product = productRows[i][0];
    const requested = input.items[i];
    if (!product || product.status !== "published") {
      return NextResponse.json(
        { error: `A product in your cart is no longer available.` },
        { status: 409 }
      );
    }
    if (product.stock < requested.quantity) {
      return NextResponse.json(
        { error: `"${product.name}" only has ${product.stock} left in stock.` },
        { status: 409 }
      );
    }
    const unitPrice = product.salePrice ?? product.price;
    resolvedItems.push({
      productId: product.id,
      productName: product.name,
      color: requested.color,
      unitPrice,
      quantity: requested.quantity,
      lineTotal: unitPrice * requested.quantity,
    });
  }

  const subtotal = resolvedItems.reduce((sum, i) => sum + i.lineTotal, 0);
  const shippingFee =
    storeSettings.codAvailable && subtotal >= storeSettings.freeShippingThreshold
      ? 0
      : storeSettings.shippingFee;
  const total = subtotal + shippingFee;

  const orderId = randomUUID();
  const customerId = randomUUID();
  const orderNumber = generateOrderNumber();

  // Atomic transaction: create customer, order, order items, and decrement
  // stock together — if anything fails, nothing is committed.
  const tx = sqlite.transaction(() => {
    sqlite
      .prepare(`INSERT INTO customers (id, name, phone, email) VALUES (?, ?, ?, ?)`)
      .run(customerId, input.fullName, input.phone, input.email || null);

    sqlite
      .prepare(
        `INSERT INTO orders (id, order_number, customer_id, customer_name, phone, email, address, city, province, postal_code, notes, payment_method, subtotal, shipping_fee, total, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'cod', ?, ?, ?, 'pending')`
      )
      .run(
        orderId,
        orderNumber,
        customerId,
        input.fullName,
        input.phone,
        input.email || null,
        input.address,
        input.city,
        input.province,
        input.postalCode || null,
        input.notes || null,
        subtotal,
        shippingFee,
        total
      );

    for (const item of resolvedItems) {
      sqlite
        .prepare(
          `INSERT INTO order_items (id, order_id, product_id, product_name, color, unit_price, quantity, line_total)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          randomUUID(),
          orderId,
          item.productId,
          item.productName,
          item.color || null,
          item.unitPrice,
          item.quantity,
          item.lineTotal
        );

      sqlite
        .prepare(`UPDATE products SET stock = stock - ? WHERE id = ?`)
        .run(item.quantity, item.productId);
    }
  });

  try {
    tx();
  } catch (err) {
    console.error("[orders] transaction failed", err);
    return NextResponse.json({ error: "Could not place order. Please try again." }, { status: 500 });
  }

  // Fire-and-forget notifications — order is already committed either way.
  const emailPayload = {
    orderNumber,
    customerName: input.fullName,
    phone: input.phone,
    address: `${input.address}, ${input.city}, ${input.province}`,
    items: resolvedItems.map((i) => ({
      productName: i.productName,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    })),
    total,
    currency: storeSettings.currency,
    businessEmail: storeSettings.businessEmail,
    customerEmail: input.email,
  };
  sendAdminOrderNotification(emailPayload).catch((e) => console.error("[email] admin notify failed", e));
  sendCustomerOrderConfirmation(emailPayload).catch((e) => console.error("[email] customer confirm failed", e));

  return NextResponse.json({ orderNumber, total, subtotal, shippingFee }, { status: 201 });
}
