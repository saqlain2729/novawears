import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  phone: z.string().min(7, "Enter a valid phone number"),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().min(5, "Enter your complete address"),
  city: z.string().min(2, "Enter your city"),
  province: z.string().min(2, "Select your province"),
  postalCode: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
        color: z.string().optional(),
      })
    )
    .min(1, "Your cart is empty"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(1),
  price: z.number().positive(),
  salePrice: z.number().positive().nullable().optional(),
  categoryId: z.string().min(1),
  sku: z.string().min(1),
  stock: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(0).optional(),
  brand: z.string().optional(),
  images: z.array(z.string()).min(1),
  features: z.array(z.string()).optional(),
  specifications: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  colors: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  status: z.enum(["draft", "published", "hidden"]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
