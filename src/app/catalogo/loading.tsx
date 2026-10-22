import { CatalogSkeleton } from "@/components/catalog-skeleton";
export default function Loading() {
  return (
    <section className="container section">
      <span className="eyebrow">PREPARANDO NOVAS POSSIBILIDADES</span>
      <h1 style={{ margin: "12px 0 30px" }}>
        Seu próximo projeto começa aqui.
      </h1>
      <CatalogSkeleton />
    </section>
  );
}
