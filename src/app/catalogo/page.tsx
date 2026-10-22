import { Suspense } from "react";
import { CatalogSkeleton } from "@/components/catalog-skeleton";
import { CatalogPage } from "@/components/catalog-page";
export const metadata = { title: "Catálogo" };
export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="container section">
          <CatalogSkeleton />
        </div>
      }
    >
      <CatalogPage />
    </Suspense>
  );
}
