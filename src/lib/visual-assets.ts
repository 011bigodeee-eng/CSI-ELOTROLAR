import manifest from "./visual-assets.generated.json";
/** Only files validated before dev/build enter this manifest. Existing owner uploads are never replaced. */
export const officialLogo = manifest.logo as string | null;
export const officialFavicon = manifest.favicon as string | null;
const photos = manifest.products as Record<string, string>;
export function heroProductPhoto(key: string): string | undefined {
  return (manifest.heroProducts as Record<string, string>)[key];
}
export function resolveProductImage(src: string): string {
  const legacy = /^\/products\/([a-z-]+)\.svg$/.exec(src);
  return legacy ? photos[legacy[1]] || src : src;
}

export function categoryPhoto(key: string): string | undefined {
  return (manifest.categories as Record<string, string>)[key];
}
