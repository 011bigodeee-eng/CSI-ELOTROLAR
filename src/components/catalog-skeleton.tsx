export function CatalogSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="catalog-skeleton"
      role="status"
      aria-label="Carregando catálogo"
    >
      <span className="sr-only">Carregando produtos…</span>
      <div className="product-grid catalog-products">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="skeleton-card" aria-hidden="true">
            <div className="skeleton-image skeleton-shimmer" />
            <div className="skeleton-line skeleton-shimmer short" />
            <div className="skeleton-line skeleton-shimmer" />
            <div className="skeleton-line skeleton-shimmer medium" />
            <div className="skeleton-button skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}
