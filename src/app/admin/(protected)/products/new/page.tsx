import { AdminPageHeader } from "@/components/admin/ui";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <AdminPageHeader title="Add Product" />
      <ProductForm />
    </div>
  );
}
