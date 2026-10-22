import { NextRequest, NextResponse } from "next/server";
import {
  COOKIE,
  createSession,
  passwordMatches,
  isSameOrigin,
} from "@/lib/auth";
const attempts = new Map<string, { count: number; reset: number }>();
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request))
    return NextResponse.json(
      { error: "Origem não autorizada." },
      { status: 403 },
    );
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET)
    return NextResponse.json(
      {
        error:
          "Painel bloqueado. Configure ADMIN_PASSWORD e ADMIN_SESSION_SECRET no ambiente do servidor.",
      },
      { status: 503 },
    );
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  const now = Date.now();
  for (const [k, v] of attempts) if (v.reset < now) attempts.delete(k);
  const record = attempts.get(ip) || { count: 0, reset: now + 15 * 60 * 1000 };
  if (record.count >= 5)
    return NextResponse.json(
      { error: "Muitas tentativas. Tente novamente em 15 minutos." },
      { status: 429 },
    );
  const data = await request.json().catch(() => null);
  if (typeof data?.password !== "string" || !passwordMatches(data.password)) {
    record.count++;
    attempts.set(ip, record);
    return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
  }
  attempts.delete(ip);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE, createSession(), {
    httpOnly: true,
    secure: request.nextUrl.protocol === "https:",
    sameSite: "strict",
    path: "/",
    maxAge: 8 * 60 * 60,
  });
  return response;
}
