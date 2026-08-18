import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, customers, orders, orderItems } from "@/db/schema";
import { checkoutSchema } from "@/lib/validation";
import { generateOrderNumber } from "@/lib/order-number";
import { getSettings } from "@/lib/settings";
import { sendAdminOrderNotification, sendCustomerOrderConfirmation } from "@/lib/email";
import { randomUUID } from "crypto";
import { eq, sql } from "drizzle-orm";

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
  try {
    await db.transaction(async (tx) => {
      await tx.insert(customers).values({
        id: customerId,
        name: input.fullName,
        phone: input.phone,
        email: input.email || null,
      });

      await tx.insert(orders).values({
        id: orderId,
        orderNumber,
        customerId,
        customerName: input.fullName,
        phone: input.phone,
        email: input.email || null,
        address: input.address,
        city: input.city,
        province: input.province,
        postalCode: input.postalCode || null,
        notes: input.notes || null,
        paymentMethod: "cod",
        subtotal,
        shippingFee,
        total,
        status: "pending",
      });

      for (const item of resolvedItems) {
        await tx.insert(orderItems).values({
          id: randomUUID(),
          orderId,
          productId: item.productId,
          productName: item.productName,
          color: item.color || null,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          lineTotal: item.lineTotal,
        });

        await tx
          .update(products)
          .set({ stock: sql`${products.stock} - ${item.quantity}` })
          .where(eq(products.id, item.productId));
      }
    });
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
