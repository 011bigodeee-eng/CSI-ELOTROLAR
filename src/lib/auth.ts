import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
export const COOKIE = "csi-admin";
// Random per-process key invalidates sessions on restart when no persistent key is configured.
const key = process.env.ADMIN_SESSION_SECRET || randomBytes(32).toString("hex");
export function createSession() {
  const expiry = Date.now() + 8 * 60 * 60 * 1000;
  const payload = String(expiry);
  return `${payload}.${createHmac("sha256", key).update(payload).digest("hex")}`;
}
export function verifySession(token: string | undefined) {
  if (!token) return false;
  const [expiry, signature] = token.split(".");
  if (
    !expiry ||
    !signature ||
    !/^\d+$/.test(expiry) ||
    Number(expiry) < Date.now()
  )
    return false;
  const expected = createHmac("sha256", key).update(expiry).digest("hex");
  return (
    signature.length === expected.length &&
    timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  );
}
export async function isAdmin() {
  return verifySession((await cookies()).get(COOKIE)?.value);
}
export function passwordMatches(value: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || Buffer.byteLength(value) !== Buffer.byteLength(expected))
    return false;
  return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const parsed = new URL(origin);
    // Next may normalize nextUrl to 0.0.0.0 behind a reverse proxy. Host is the public request authority.
    return (
      ["http:", "https:"].includes(parsed.protocol) &&
      parsed.host === (request.headers.get("host") || new URL(request.url).host)
    );
  } catch {
    return false;
  }
}
