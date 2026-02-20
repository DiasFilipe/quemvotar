import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, setSessionCookie, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const session = await createSession(user.id);
  const response = NextResponse.json({ ok: true, user: { id: user.id, email: user.email } });
  setSessionCookie(response, session.token);
  return response;
}
