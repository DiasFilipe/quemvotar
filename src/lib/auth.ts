import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "./prisma";

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME ?? "qv_session";
const SESSION_TTL_DAYS = Number(process.env.SESSION_TTL_DAYS ?? "30");

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string) {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
  const session = await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt
    }
  });
  return session;
}

export function setSessionCookie(response: NextResponse, token: string) {
  const isProd = process.env.NODE_ENV === "production";
  const maxAge = SESSION_TTL_DAYS * 24 * 60 * 60;
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
}

export async function getSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true }
  });
  if (!session) {
    return null;
  }
  if (session.revokedAt || session.expiresAt < new Date()) {
    return null;
  }
  return session;
}
