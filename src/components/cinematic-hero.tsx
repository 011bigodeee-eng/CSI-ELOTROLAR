"use client";
import Link from "next/link";
import { useState, useEffect, type PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Lightbulb,
  ShieldCheck,
  Snowflake,
  Zap,
} from "lucide-react";
import { useStore } from "./store";
import { Magnetic, useFinePointer } from "./interactions";

const spots = [
  {
    id: "ar",
    label: "Climatização",
    text: "O clima certo para o seu ambiente.",
    icon: Snowflake,
    className: "spot-climate",
  },
  {
    id: "cabos",
    label: "Fios e cabos",
    text: "Conexões para dar vida ao seu projeto.",
    icon: Zap,
    className: "spot-cables",
  },
  {
    id: "iluminacao",
    label: "Iluminação",
    text: "Uma nova luz para cada possibilidade.",
    icon: Lightbulb,
    className: "spot-light",
  },
];
export function CinematicHero() {
  const { setDrawer } = useStore();
  const enabled = useFinePointer(),
    reduced = useReducedMotion();
  const [active, setActive] = useState("ar");
  const [entered, setEntered] = useState(false);
  useEffect(() => setEntered(true), []);
  const px = useMotionValue(68),
    py = useMotionValue(42),
    rx = useMotionValue(0),
    ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 90, damping: 24 }),
    rotateY = useSpring(ry, { stiffness: 90, damping: 24 });
  const light = useMotionTemplate`radial-gradient(650px circle at ${px}% ${py}%, rgba(28,111,255,.22), transparent 72%)`;
  function move(e: PointerEvent<HTMLElement>) {
    if (!enabled) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width,
      y = (e.clientY - r.top) / r.height;
    px.set(x * 100);
    py.set(y * 100);
    rx.set((0.5 - y) * 5);
    ry.set((x - 0.5) * 7);
  }
  const word = {
    reveal: { y: ["105%", 0], opacity: [0.2, 1] },
    shown: { y: 0, opacity: 1 },
  };
  return (
    <section
      className="cinematic-hero"
      onPointerMove={move}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
        px.set(68);
        py.set(42);
      }}
    >
      <div className="hero-noise" />
      <motion.div
        className="hero-light"
        style={{ background: light }}
        aria-hidden="true"
      />
      <div className="energy-particles" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <i
            key={i}
            style={{
              left: `${12 + ((i * 29) % 80)}%`,
              top: `${12 + ((i * 17) % 73)}%`,
              animationDelay: `${i * -0.7}s`,
            }}
          />
        ))}
      </div>
      <div className="container cinematic-inner">
        <div className="cinematic-copy">
          <div className="hero-edition">
            <span className="status-dot" /> CONEXÕES QUE TRANSFORMAM{" "}
            <span className="edition-rule" /> CSI ELETROLAR
          </div>
          <motion.h1
            initial={false}
            animate={entered && !reduced ? "reveal" : "shown"}
            transition={{ staggerChildren: 0.09, delayChildren: 0.12 }}
            aria-label="Potência para criar. Conforto para viver."
          >
            <span className="hero-title-line">
              {["Potência", "para", "criar."].map((w) => (
                <span className="word-clip" key={w}>
                  <motion.span
                    variants={word}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {w}&nbsp;
                  </motion.span>
                </span>
              ))}
            </span>
            <span className="hero-title-line">
              {["Conforto", "para"].map((w) => (
                <span className="word-clip" key={w}>
                  <motion.span
                    variants={word}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {w}&nbsp;
                  </motion.span>
                </span>
              ))}
              <span className="word-clip living-word">
                <motion.span
                  variants={word}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  viver<span className="living-dot">.</span>
                </motion.span>
                <svg viewBox="0 0 200 16" aria-hidden="true">
                  <motion.path
                    initial={false}
                    animate={{ pathLength: entered && !reduced ? [0, 1] : 1 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    d="M3 11Q95-3 195 6"
                  />
                </svg>
              </span>
            </span>
          </motion.h1>
          <motion.div
            initial={false}
            animate={
              entered && !reduced
                ? { opacity: [0.65, 1], y: [15, 0] }
                : { opacity: 1, y: 0 }
            }
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <p className="cinematic-lead">
              Energia, tecnologia e climatização
              <br className="desktop-break" /> para seus projetos.
            </p>
            <p className="cinematic-description">
              Da primeira conexão ao clima perfeito.
              <br />
              Explore soluções que dão vida às suas ideias.
            </p>
            <div className="cinematic-actions">
              <Magnetic>
                <Link className="button yellow" href="/catalogo">
                  Explorar catálogo <ArrowUpRight size={19} />
                </Link>
              </Magnetic>
              <Magnetic>
                <button
                  className="button ghost-button"
                  onClick={() => setDrawer(true)}
                >
                  Monte seu orçamento <ArrowRight size={18} />
                </button>
              </Magnetic>
            </div>
            <div className="cinematic-assurance">
              <ShieldCheck size={16} />
              <span>Seu projeto merece as escolhas certas.</span>
            </div>
          </motion.div>
        </div>
        <motion.div
          className="product-stage"
          style={enabled ? { rotateX, rotateY } : undefined}
          aria-label="Explore nossas soluções"
        >
          <div className="stage-orbit orbit-outer" />
          <div className="stage-orbit orbit-inner" />
          <div className="stage-axis axis-horizontal" />
          <div className="stage-axis axis-vertical" />
          <span className="stage-coordinate">
            ELÉTRICA / ILUMINAÇÃO / CLIMATIZAÇÃO
          </span>
          <div className="stage-glow" />
          <div
            className={`render-composition active-${active}`}
            aria-hidden="true"
          >
            {["ac", "cable", "bulb"].map((name, i) => (
              <div key={name} className={`render-layer render-${name}`}>
                <img
                  src="/images/hero-products.webp"
                  alt=""
                  width={1024}
                  height={1536}
                  fetchPriority={i === 0 ? "high" : "auto"}
                />
              </div>
            ))}
          </div>
          {spots.map(({ id, label, text, icon: Icon, className }) => (
            <Link
              key={id}
              href={`/catalogo?categoria=${id}`}
              className={`product-spot ${className} ${active === id ? "is-active" : ""}`}
              onMouseEnter={() => setActive(id)}
              onFocus={() => setActive(id)}
            >
              <span className="spot-marker">
                <Icon size={16} />
              </span>
              <span className="spot-info">
                <small>EXPLORE A LINHA</small>
                <strong>{label}</strong>
                <span>{text}</span>
              </span>
              <ArrowUpRight className="spot-arrow" size={15} />
            </Link>
          ))}
          <span className="stage-caption">
            Imagens conceituais · produtos sob consulta
          </span>
        </motion.div>
      </div>
      <div className="container cinematic-bottom">
        <span>
          <b>01</b> DO PRIMEIRO FIO AO CLIMA IDEAL.
        </span>
        <Link href="#categorias">
          Explore as possibilidades <ArrowDown size={15} />
        </Link>
        <span className="hero-bottom-signature">
          <Zap size={12} /> FEITO PARA CONECTAR.
        </span>
      </div>
    </section>
  );
}
