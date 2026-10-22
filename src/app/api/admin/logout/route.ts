import { NextRequest, NextResponse } from "next/server";
import { COOKIE, isSameOrigin } from "@/lib/auth";
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request))
    return NextResponse.json(
      { error: "Origem não autorizada" },
      { status: 403 },
    );
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE, "", { maxAge: 0, path: "/" });
  return response;
}
