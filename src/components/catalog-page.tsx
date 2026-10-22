"use client";
import { useDeferredValue, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Grid2X2,
  List,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useStore } from "./store";
import { ProductCard } from "./product-card";
import { motion } from "framer-motion";
import { CatalogSkeleton } from "./catalog-skeleton";
import { filterProducts } from "@/lib/catalog";
export function CatalogPage() {
  const { products, categories, setDrawer, ready } = useStore();
  const params = useSearchParams(),
    router = useRouter();
  const category = params.get("categoria") || "todos";
  const [query, setQuery] = useState(""),
    [sort, setSort] = useState("featured"),
    [filters, setFilters] = useState(false),
    [list, setList] = useState(false);
  const deferred = useDeferredValue(query);
  const results = filterProducts(products, deferred, category).sort((a, b) =>
    sort === "name"
      ? a.name.localeCompare(b.name, "pt-BR")
      : sort === "price"
        ? (a.price ?? Infinity) - (b.price ?? Infinity)
        : Number(b.featured) - Number(a.featured),
  );
  const current = categories.find((c) => c.id === category);
  function select(id: string) {
    router.replace(
      id === "todos"
        ? "/catalogo"
        : `/catalogo?categoria=${encodeURIComponent(id)}`,
      { scroll: false },
    );
    setFilters(false);
  }
  return (
    <>
      <section className="catalog-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Início</Link>
            <ChevronRight size={13} />
            <span>Catálogo</span>
          </div>
          <span className="eyebrow">SOLUÇÕES PARA CADA IDEIA</span>
          <h1>
            O seu projeto começa <span>aqui.</span>
          </h1>
          <p>Explore, descubra e conecte as melhores possibilidades.</p>
          <div className="catalog-search">
            <Search size={20} />
            <input
              aria-label="Pesquisar produtos"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="O que você precisa para o seu projeto?"
            />
            {query && (
              <button
                className="icon-button"
                aria-label="Limpar pesquisa"
                onClick={() => setQuery("")}
              >
                <X size={18} />
              </button>
            )}
            <kbd>BUSCAR</kbd>
          </div>
        </div>
      </section>
      <section className="container catalog-layout">
        <aside className={`catalog-sidebar ${filters ? "show" : ""}`}>
          <div className="sidebar-heading">
            <h3>Categorias</h3>
            <button
              className="icon-button"
              onClick={() => setFilters(false)}
              aria-label="Fechar filtros"
            >
              <X size={18} />
            </button>
          </div>
          <button
            className={category === "todos" ? "selected" : ""}
            onClick={() => select("todos")}
          >
            Todos os produtos <span>{products.length}</span>
          </button>
          {categories.map((c) => (
            <button
              className={category === c.id ? "selected" : ""}
              key={c.id}
              onClick={() => select(c.id)}
            >
              {c.short}
              <span>{products.filter((p) => p.category === c.id).length}</span>
            </button>
          ))}
          <div className="sidebar-help">
            <span className="eyebrow">PRECISA DE UMA MÃO?</span>
            <h3>A solução certa começa com uma conversa.</h3>
            <p>Monte sua lista e solicite um atendimento.</p>
            <button onClick={() => setDrawer(true)}>
              Pedir orçamento <ArrowRight size={16} />
            </button>
          </div>
        </aside>
        <div className="catalog-results">
          <div className="catalog-toolbar">
            <div>
              <h2>
                {current?.name ||
                  (category === "todos"
                    ? "Todos os produtos"
                    : "Categoria não encontrada")}
              </h2>
              <span>
                {results.length}{" "}
                {results.length === 1
                  ? "produto encontrado"
                  : "produtos encontrados"}
              </span>
            </div>
            <div className="catalog-controls">
              <button
                className="filter-toggle icon-button"
                onClick={() => setFilters(!filters)}
                aria-label="Filtrar categorias"
                aria-expanded={filters}
              >
                <SlidersHorizontal size={19} />
              </button>
              <select
                aria-label="Ordenar produtos"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="featured">Em destaque</option>
                <option value="name">Nome: A a Z</option>
                <option value="price">Menor preço</option>
              </select>
              <button
                className="icon-button view-toggle"
                onClick={() => setList(!list)}
                aria-label={list ? "Mostrar em grade" : "Mostrar em lista"}
              >
                {list ? <Grid2X2 size={19} /> : <List size={19} />}
              </button>
            </div>
          </div>
          <div className="demo-notice">
            <span className="status-dot" /> CATÁLOGO DEMONSTRATIVO{" "}
            <span>Imagens e preços ilustrativos.</span>
          </div>
          {!ready ? (
            <CatalogSkeleton />
          ) : results.length ? (
            <motion.div
              key={`${category}-${sort}-${deferred}`}
              initial={{ opacity: 0.45, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              aria-busy={deferred !== query}
              className={`product-grid catalog-products ${list ? "list-view" : ""}`}
            >
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </motion.div>
          ) : (
            <div className="empty-state">
              <Search size={42} />
              <h3>Nenhum produto por aqui.</h3>
              <p>Tente outro termo ou explore todas as categorias.</p>
              <button
                className="button"
                onClick={() => {
                  setQuery("");
                  select("todos");
                }}
              >
                Limpar busca e filtros
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
