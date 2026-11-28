import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "gadoGadoSession";

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET belum diatur.");
  }

  return secret;
}

export function createSessionToken(username: string) {
  const signature = createHmac("sha256", getSecret())
    .update(username)
    .digest("hex");

  return `${username}.${signature}`;
}

function verifySessionToken(token: string) {
  const separator = token.lastIndexOf(".");

  if (separator < 1) return null;

  const username = token.slice(0, separator);
  const receivedSignature = token.slice(separator + 1);

  const expectedSignature = createHmac("sha256", getSecret())
    .update(username)
    .digest("hex");

  if (receivedSignature.length !== expectedSignature.length) {
    return null;
  }

  const valid = timingSafeEqual(
    Buffer.from(receivedSignature),
    Buffer.from(expectedSignature)
  );

  return valid ? username : null;
}

export async function isAdminRequest(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) return false;

  try {
    const username = verifySessionToken(token);

    if (!username) return false;

    const user = await prisma.user.findUnique({
      where: { username },
      select: { role: true },
    });

    return user?.role === "admin";
  } catch {
    return false;
  }
}