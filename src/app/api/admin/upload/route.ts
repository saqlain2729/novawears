import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

/**
 * Product image upload.
 *
 * Vercel's serverless functions have a read-only filesystem (aside from
 * /tmp, which is wiped between invocations and never served publicly), so
 * writing to `public/uploads` — which works fine with `next dev` — cannot
 * work in production there. This route uses Vercel Blob storage when
 * configured (BLOB_READ_WRITE_TOKEN, set automatically when you attach a
 * Blob store to your Vercel project) and falls back to writing into
 * `public/uploads` for local development when it isn't.
 */

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const extensions: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No image file received." }, { status: 400 });
    }

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, WEBP and GIF images are allowed." },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be smaller than 5 MB." }, { status: 400 });
    }

    const crypto = await import("crypto");
    const extension = extensions[file.type];
    const fileName = `products/${crypto.randomUUID()}${extension}`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import("@vercel/blob");
      const blob = await put(fileName, file, {
        access: "public",
        addRandomSuffix: false,
      });
      return NextResponse.json({ success: true, url: blob.url });
    }

    if (process.env.VERCEL) {
      // Deployed to Vercel with no Blob store attached — writing to the
      // local filesystem would silently fail to persist or serve the file.
      return NextResponse.json(
        {
          error:
            "Image upload is not configured for this deployment. Attach a Vercel Blob store " +
            "and set BLOB_READ_WRITE_TOKEN, or paste an image URL directly instead.",
        },
        { status: 501 }
      );
    }

    // Local development fallback — writes into public/uploads.
    const { mkdir, writeFile } = await import("fs/promises");
    const path = await import("path");
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const localFileName = `${crypto.randomUUID()}${extension}`;
    const filePath = path.join(uploadDir, localFileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    return NextResponse.json({ success: true, url: `/uploads/${localFileName}` });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json({ error: "Image upload failed." }, { status: 500 });
  }
}
