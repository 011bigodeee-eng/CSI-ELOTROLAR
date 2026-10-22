import {
  categories,
  demoProducts,
  type Product,
  type Category,
} from "./catalog";
// Swap this adapter for a Supabase implementation; UI never imports a database client.
export interface CatalogRepository {
  load(): { products: Product[]; categories: Category[] };
  save(data: { products: Product[]; categories: Category[] }): void;
}
export const STORAGE_KEY = "csi-catalog-v1";
export const localCatalogRepository: CatalogRepository = {
  load() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (
        data &&
        Array.isArray(data.products) &&
        Array.isArray(data.categories) &&
        data.products.every(
          (p: Product) =>
            typeof p.id === "string" &&
            typeof p.name === "string" &&
            typeof p.description === "string" &&
            typeof p.category === "string" &&
            typeof p.image === "string",
        ) &&
        data.categories.every(
          (c: Category) =>
            typeof c.id === "string" && typeof c.name === "string",
        )
      )
        return data;
    } catch {
      /* Fall back to demo data if local storage is unavailable or invalid. */
    }
    return { products: demoProducts, categories };
  },
  save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },
};
