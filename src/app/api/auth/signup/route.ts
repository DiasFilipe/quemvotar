import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, hashPassword, setSessionCookie } from "@/lib/auth";
import { signupSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "email_in_use" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "USER"
    }
  });

  const session = await createSession(user.id);
  const response = NextResponse.json({ ok: true, user: { id: user.id, email: user.email } });
  setSessionCookie(response, session.token);
  return response;
}
