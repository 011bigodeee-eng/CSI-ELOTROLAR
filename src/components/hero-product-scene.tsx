"use client";
import { productPhoto } from "@/lib/visual-assets";
import Link from "next/link";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, Lightbulb, Snowflake, Zap } from "lucide-react";
import type { CSSProperties } from "react";
import {
  heroProducts,
  cropStyle,
  type HeroProduct,
  type HeroProductId,
} from "@/lib/hero-scene";
type SceneProps = {
  active: HeroProductId | null;
  enabled: boolean;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  onHover: (id: HeroProductId | null) => void;
  onFocus: (id: HeroProductId | null) => void;
};
const icons = { ar: Snowflake, cabos: Zap, iluminacao: Lightbulb };
function ProductObject({
  product: p,
  active,
  enabled,
  pointerX,
  pointerY,
  onHover,
  onFocus,
}: SceneProps & { product: HeroProduct }) {
  const x = useTransform(pointerX, [-1, 1], [-10 * p.depth, 10 * p.depth]);
  const y = useTransform(pointerY, [-1, 1], [-7 * p.depth, 7 * p.depth]);
  const chosen = active === p.id;
  const photo = productPhoto(
    p.id === "ar"
      ? "ar-condicionado"
      : p.id === "iluminacao"
        ? "lampada"
        : "cabos",
  );
  return (
    <motion.div
      className={`hero-product-depth hero-product-${p.className}`}
      data-product={p.id}
      data-selected={chosen}
      style={{
        left: `${p.position[0]}%`,
        top: `${p.position[1]}%`,
        width: `${p.source[2]}%`,
        height: `${p.source[3]}%`,
        x: enabled ? x : 0,
        y: enabled ? y : 0,
      }}
      animate={{
        scale: enabled && chosen ? 1.045 : 1,
        z: enabled && chosen ? 28 : 0,
        rotateZ: enabled && chosen ? (p.id === "iluminacao" ? 1 : -0.7) : 0,
      }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="hero-product-arrival"
        style={{ "--product-order": p.order } as CSSProperties}
      >
        <div className="hero-product-float" data-product={p.id}>
          <Link
            className="hero-product-link"
            href={`/catalogo?categoria=${p.id}`}
            aria-label={p.action}
            onPointerEnter={() => onHover(p.id)}
            onPointerLeave={() => onHover(null)}
            onFocus={() => onFocus(p.id)}
            onBlur={() => onFocus(null)}
          >
            <span
              className={`hero-product-crop ${photo ? "hero-product-photo" : ""}`}
            >
              <img
                className="hero-product-image"
                src={photo || "/images/hero-products.webp"}
                alt=""
                width={1024}
                height={1536}
                fetchPriority={p.order === 0 ? "high" : "auto"}
                decoding="async"
                style={photo ? undefined : cropStyle(p.source)}
              />
            </span>
            <span
              className={`product-response response-${p.id}`}
              aria-hidden="true"
            >
              {p.id === "ar" && (
                <svg viewBox="0 0 300 160">
                  <path d="M30 35C100 45 130 80 260 55" />
                  <path d="M20 60C100 65 140 105 280 88" />
                  <path d="M40 85C110 90 170 125 255 117" />
                </svg>
              )}
              {p.id === "cabos" && (
                <svg viewBox="0 0 300 260">
                  <path
                    pathLength="1"
                    d="M140 207C50 195 40 145 53 102C68 45 229 30 264 97C290 151 245 184 219 193"
                  />
                </svg>
              )}
              {p.id === "iluminacao" && <span className="bulb-warmth" />}
            </span>
            <span className="hero-product-focus-hint">
              Explorar categoria <ArrowUpRight size={13} />
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
export function HeroProductScene(props: SceneProps) {
  const { active, onHover, onFocus } = props;
  return (
    <div className="hero-scene">
      <div className="hero-scene-visual">
        <div className="hero-scene-aura" aria-hidden="true" />
        <div
          className="hero-depth-circle depth-circle-large"
          aria-hidden="true"
        />
        <div
          className="hero-depth-circle depth-circle-small"
          aria-hidden="true"
        />
        <div className="hero-scene-horizon" aria-hidden="true" />
        <span className="hero-scene-note" aria-hidden="true">
          CONEXÕES QUE TRANSFORMAM
        </span>
        <div className="hero-product-composition">
          {heroProducts.map((p) => (
            <ProductObject key={p.id} product={p} {...props} />
          ))}
        </div>
      </div>
      <div className="hero-glass-cards" aria-label="Explore nossas linhas">
        {heroProducts.map((p) => {
          const Icon = icons[p.id];
          return (
            <Link
              key={p.id}
              href={`/catalogo?categoria=${p.id}`}
              className={`hero-glass-card glass-${p.className} ${active === p.id ? "is-selected" : ""}`}
              data-product={p.id}
              aria-label={`Ver catálogo de ${p.label.toLowerCase()}`}
              onPointerEnter={() => onHover(p.id)}
              onPointerLeave={() => onHover(null)}
              onFocus={() => onFocus(p.id)}
              onBlur={() => onFocus(null)}
              style={{ "--card-order": p.order } as CSSProperties}
            >
              <span className="hero-glass-icon">
                <Icon size={19} strokeWidth={1.5} />
              </span>
              <span className="hero-glass-copy">
                <small>EXPLORE A LINHA</small>
                <strong>{p.label}</strong>
                <span>{p.description}</span>
              </span>
              <ArrowUpRight className="hero-glass-arrow" size={15} />
            </Link>
          );
        })}
      </div>
      <span className="hero-scene-caption">
        Imagens conceituais. Produtos sob consulta.
      </span>
    </div>
  );
}
