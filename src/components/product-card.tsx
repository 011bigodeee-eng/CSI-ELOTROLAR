"use client";
import { ArrowUpRight, Plus, Check } from "lucide-react";
import { type Product, money } from "@/lib/catalog";
import { useStore } from "./store";
export function ProductCard({ product: p }: { product: Product }) {
  const { categories, add, quote, setDrawer } = useStore();
  return (
    <article className="product-card">
      <div className="product-visual">
        {p.badge && <span className="product-badge">{p.badge}</span>}
        <span className="demo-label">ILUSTRATIVO</span>
        <img src={p.image} alt={`Ilustração de ${p.name}`} loading="lazy" />
        <button
          className={`quick-add ${quote[p.id] ? "is-added" : ""}`}
          aria-label={`Adicionar ${p.name} à lista`}
          onClick={() => add(p.id)}
        >
          {quote[p.id] ? <Check size={20} /> : <Plus size={20} />}
        </button>
      </div>
      <div className="product-info">
        <span className="product-category">
          {categories.find((c) => c.id === p.category)?.short || "Produto"}
        </span>
        <h3>{p.name}</h3>
        <p>{p.description}</p>
        <div className="price">
          {p.price ? (
            <>
              <small>Preço demonstrativo</small>
              <strong>{money(p.price)}</strong>
            </>
          ) : (
            <>
              <small>Vamos encontrar a melhor solução?</small>
              <strong className="on-request">Preço sob consulta</strong>
            </>
          )}
        </div>
        <div className="product-actions">
          <button
            onClick={() => {
              add(p.id);
              setDrawer(true);
            }}
          >
            Solicitar orçamento <ArrowUpRight size={16} />
          </button>
          <button
            aria-label={`Adicionar à lista: ${p.name}`}
            title="Adicionar à lista"
            onClick={() => add(p.id)}
          >
            <Plus size={17} />
            <span>Adicionar à lista</span>
          </button>
        </div>
      </div>
    </article>
  );
}
