import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/ui";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await db.select().from(products).where(eq(products.id, id));
  const product = rows[0];
  if (!product) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Product" />
      <ProductForm product={product as never} />
    </div>
  );
}
