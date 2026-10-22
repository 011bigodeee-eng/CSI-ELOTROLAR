import { Suspense } from "react";
import { CatalogPage } from "@/components/catalog-page";
export const metadata = { title: "Catálogo" };
export default function Page() {
  return (
    <Suspense
      fallback={<div className="container section">Preparando o catálogo…</div>}
    >
      <CatalogPage />
    </Suspense>
  );
}
