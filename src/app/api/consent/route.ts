import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { consentSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = consentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const { accepted, type } = parsed.data;
  const ip = request.headers.get("x-forwarded-for") ?? undefined;
  const userAgent = request.headers.get("user-agent") ?? undefined;

  if (accepted) {
    const now = new Date();
    await prisma.consent.upsert({
      where: { userId_type: { userId: session.userId, type } },
      create: {
        userId: session.userId,
        type,
        acceptedAt: now
      },
      update: {
        acceptedAt: now,
        revokedAt: null
      }
    });
    await prisma.user.update({
      where: { id: session.userId },
      data: { consentAcceptedAt: now }
    });
    await prisma.consentLog.create({
      data: {
        userId: session.userId,
        type,
        action: "ACCEPT",
        ip,
        userAgent
      }
    });
  } else {
    await prisma.consent.updateMany({
      where: { userId: session.userId, type, revokedAt: null },
      data: { revokedAt: new Date() }
    });
    await prisma.user.update({
      where: { id: session.userId },
      data: { consentAcceptedAt: null }
    });
    await prisma.consentLog.create({
      data: {
        userId: session.userId,
        type,
        action: "REVOKE",
        ip,
        userAgent
      }
    });
  }

  return NextResponse.json({ ok: true });
}
