import { officialFavicon, officialLogo } from "@/lib/visual-assets";
/** Preserve the existing URL while allowing the supplied official asset to replace the provisional mark. */
export function GET() {
  return new Response(null, {
    status: 307,
    headers: {
      Location:
        officialFavicon || officialLogo || "/brand/favicon-provisorio.svg",
      "Cache-Control": "public, max-age=300",
    },
  });
}
