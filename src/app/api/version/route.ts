import { officialLogo } from "@/lib/visual-assets";
/** Public deployment metadata only; never includes credentials or owner data. */
export function GET() {
  return Response.json(
    {
      commit: process.env.VERCEL_GIT_COMMIT_SHA || "local",
      logoOficial: Boolean(officialLogo),
      logo: officialLogo,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
