"use client";
import { categoryPhoto } from "@/lib/visual-assets";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useStore } from "./store";
import { Reveal } from "./interactions";
import { categoryVisual } from "@/lib/category-visuals";
export function EditorialCategories() {
  const { categories } = useStore();
  const ordered = [...categories].sort((a, b) => {
    const order = (id: string) => (id === "cabos" ? 0 : id === "ar" ? 1 : 2);
    return order(a.id) - order(b.id);
  });
  return (
    <section id="categorias" className="editorial-section container">
      <Reveal className="section-heading">
        <div>
          <span className="eyebrow">CADA PROJETO, UM NOVO UNIVERSO</span>
          <h2>
            Encontre a solução ideal
            <br />
            para seu projeto<span>.</span>
          </h2>
        </div>
        <div className="editorial-heading-note">
          <p>
            Da energia que move
            <br />
            ao conforto que transforma.
          </p>
          <Link className="text-link" href="/catalogo">
            Explorar todas as categorias <ArrowUpRight size={18} />
          </Link>
        </div>
      </Reveal>
      <div className="editorial-grid">
        {ordered.map((c, i) => {
          const visual = categoryVisual(c.id);
          const photo = categoryPhoto(c.id);
          return (
            <Reveal
              key={c.id}
              className={`editorial-wrap editorial-${i}`}
              delay={(i % 3) * 0.05}
            >
              <Link
                className="category-card editorial-card"
                href={`/catalogo?categoria=${encodeURIComponent(c.id)}`}
              >
                <img
                  src={photo || "/images/category-scenes.webp"}
                  alt=""
                  width={1536}
                  height={1024}
                  loading="lazy"
                  decoding="async"
                  className={`editorial-photo ${photo ? "editorial-photo-real" : ""}`}
                  style={
                    photo
                      ? undefined
                      : {
                          left: visual.position.startsWith("100%")
                            ? "-100%"
                            : "0",
                          top: visual.position.endsWith("100%") ? "-100%" : "0",
                        }
                  }
                />
                <div className="editorial-overlay" />
                <span className="category-kicker">
                  <span>0{i + 1}</span>
                  {visual.label}
                </span>
                <div className="editorial-card-copy">
                  <h3>{c.short}</h3>
                  <p>{visual.description}</p>
                </div>
                <span className="editorial-arrow">
                  <ArrowUpRight size={21} />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
      <span className="conceptual-caption">
        Imagens conceituais geradas para esta prévia. Consulte os produtos
        disponíveis.
      </span>
    </section>
  );
}
