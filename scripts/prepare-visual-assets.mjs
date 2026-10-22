import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const extensions = ["webp", "avif", "png", "jpg", "jpeg"];
async function find(base) {
  const found = extensions
    .map((ext) => `${base}.${ext}`)
    .filter((path) => existsSync(resolve(root, "public", path)));
  if (found.length > 1)
    throw new Error(`Mantenha apenas uma versão de ${base}.`);
  if (!found.length) return null;
  const image = sharp(resolve(root, "public", found[0]));
  const metadata = await image.metadata();
  if (
    !metadata.width ||
    !metadata.height ||
    metadata.width * metadata.height > 40000000
  )
    throw new Error(`Imagem inválida: ${found[0]}`);
  await image.stats(); // Decode pixels, rather than trusting just a filename/header.
  return `/${found[0]}`;
}
const keys = [
  "cabos",
  "ar-condicionado",
  "disjuntor",
  "lampada",
  "tomada",
  "ventilador",
  "instalacao",
  "acessorio",
];
const assets = {
  logo: await find("brand/logo-oficial"),
  favicon: await find("brand/favicon-oficial"),
  products: {},
  categories: {},
};
for (const key of keys) {
  const path = await find(`products/fotos/${key}`);
  if (path) assets.products[key] = path;
}
for (const key of [
  "cabos",
  "ar",
  "disjuntores",
  "tomadas",
  "iluminacao",
  "instalacao",
  "ventilacao",
  "acessorios",
]) {
  const path = await find(`images/categories/${key}`);
  if (path) assets.categories[key] = path;
}
const output = resolve(root, "src/lib/visual-assets.generated.json");
const content = JSON.stringify(assets, null, 2) + "\n";
if (!existsSync(output) || readFileSync(output, "utf8") !== content)
  writeFileSync(output, content);
console.log(
  `Identidade: ${assets.logo ? "arquivo oficial disponível" : "aguardando original"}. Fotos: ${Object.keys(assets.products).length}/8. Favicon: ${assets.favicon ? "disponível" : "aguardando original"}.`,
);
