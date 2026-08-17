import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validation";
import { signAdminSession, setAdminCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
  }

  const rows = await db.select().from(admins).where(eq(admins.email, parsed.data.email));
  const admin = rows[0];

  // Constant-shape response whether the email exists or not, to avoid
  // leaking which admin emails are registered.
  const genericError = NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

  if (!admin) return genericError;

  const valid = await bcrypt.compare(parsed.data.password, admin.passwordHash);
  if (!valid) return genericError;

  const token = signAdminSession({ adminId: admin.id, email: admin.email, name: admin.name });
  await setAdminCookie(token);

  return NextResponse.json({ ok: true, admin: { email: admin.email, name: admin.name } });
}
