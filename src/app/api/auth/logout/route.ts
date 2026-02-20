import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { clearSessionCookie } from "@/lib/auth";

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME ?? "qv_session";

export async function POST() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.updateMany({
      where: { token, revokedAt: null },
      data: { revokedAt: new Date() }
    });
  }

  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}
