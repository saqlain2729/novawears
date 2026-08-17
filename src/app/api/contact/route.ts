import { NextRequest, NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";
import { sendContactMessage } from "@/lib/email";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please fill in all fields correctly." }, { status: 400 });

  const settings = await getSettings();
  await sendContactMessage({ ...parsed.data, businessEmail: settings.businessEmail });

  return NextResponse.json({ ok: true });
}
