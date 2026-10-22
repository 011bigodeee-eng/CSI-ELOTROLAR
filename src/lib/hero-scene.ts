/** Windows into the existing 1024×1536 render. Matching source/window sizes preserves its aspect ratio. */
export const heroProducts = [
  {
    id: "ar",
    name: "Ar-condicionado",
    label: "Climatização",
    description: "O clima certo para o seu ambiente.",
    action: "Explorar ar-condicionado",
    className: "climate",
    source: [5, 5, 95, 46],
    position: [5, 5],
    depth: 0.65,
    order: 0,
  },
  {
    id: "cabos",
    name: "Cabo elétrico",
    label: "Fios e cabos",
    description: "Conexões que dão vida às suas ideias.",
    action: "Explorar fios e cabos",
    className: "cables",
    source: [0, 54, 64, 39],
    position: [0, 55],
    depth: 1,
    order: 1,
  },
  {
    id: "iluminacao",
    name: "Lâmpada LED",
    label: "Iluminação",
    description: "Uma nova luz para cada projeto.",
    action: "Explorar iluminação",
    className: "light",
    source: [64, 51, 36, 40],
    position: [64, 54],
    depth: 1.35,
    order: 2,
  },
] as const;
export type HeroProduct = (typeof heroProducts)[number];
export type HeroProductId = HeroProduct["id"];
export function cropStyle(source: readonly number[]) {
  const [x, y, w, h] = source;
  return {
    width: `${10000 / w}%`,
    height: `${10000 / h}%`,
    left: `${(-x / w) * 100}%`,
    top: `${(-y / h) * 100}%`,
  };
}
