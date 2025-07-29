import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

type SessionPayload = {
  userId: string;
  expiresAt: number;
};

export async function createSession(userId: string) {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const token = await signJWT({ userId, expiresAt });

  (await cookies()).set("exa-session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(expiresAt),
    path: "/",
    sameSite: "lax",
  });
}

export async function deleteSession() {
  (await cookies()).delete("exa-session");
}

export async function signJWT(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(encodedKey);
}

export async function verifyJWT(token: string) {
  const { payload } = await jwtVerify(token, encodedKey, {
    algorithms: ["HS256"],
  });
  return payload as SessionPayload;
}

export async function getSession() {
  const cookie = (await cookies()).get("exa-session");
  if (!cookie) return undefined;

  try {
    return await verifyJWT(cookie.value);
  } catch {
    return undefined;
  }
}
