"use client";
import Link from "next/link";
import { useRef, useState, type PointerEvent, type CSSProperties } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useStore } from "./store";
import { Magnetic, useFinePointer } from "./interactions";
import { HeroProductScene } from "./hero-product-scene";
import type { HeroProductId } from "@/lib/hero-scene";
const circuitPaths = [
  "M740 0V100L830 190H1050L1160 300H1440",
  "M1440 480H1280L1200 560H1070L1000 630V760",
  "M900 0V75L970 145H1190L1270 225H1440",
  "M1440 530H1310L1210 630H1120L1070 680V760",
  "M0 600H75L115 640H230",
  "M1160 0V48L1210 98H1440",
];
export function CinematicHero() {
  const { setDrawer } = useStore();
  const enabled = useFinePointer();
  const root = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<HeroProductId | null>(null),
    [focused, setFocused] = useState<HeroProductId | null>(null);
  const active = hovered ?? focused;
  const px = useMotionValue(0),
    py = useMotionValue(0);
  const pointerX = useSpring(px, { stiffness: 75, damping: 25 }),
    pointerY = useSpring(py, { stiffness: 75, damping: 25 });
  const glowX = useTransform(pointerX, [-1, 1], ["20%", "90%"]),
    glowY = useTransform(pointerY, [-1, 1], ["15%", "80%"]);
  const light = useMotionTemplate`radial-gradient(600px circle at ${glowX} ${glowY},rgba(27,112,255,.21),transparent 73%)`;
  const rotateX = useTransform(pointerY, [-1, 1], [2.5, -2.5]),
    rotateY = useTransform(pointerX, [-1, 1], [-3.5, 3.5]);
  const { scrollYProgress } = useScroll({
    target: root,
    offset: ["start start", "end start"],
  });
  const scrollDepth = useTransform(scrollYProgress, [0, 1], [0, 42]);
  function move(e: PointerEvent<HTMLElement>) {
    if (!enabled) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width) * 2 - 1);
    py.set(((e.clientY - r.top) / r.height) * 2 - 1);
  }
  function word(text: string, order: number) {
    return (
      <span className="word-clip" key={text}>
        <span
          className="hero-word-reveal"
          style={{ "--word-order": order } as CSSProperties}
        >
          {text}&nbsp;
        </span>
      </span>
    );
  }
  return (
    <section
      ref={root}
      className="cinematic-hero hero-evolution"
      data-active-product={active || ""}
      data-has-active={active !== null}
      onPointerMove={move}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
        setHovered(null);
      }}
    >
      <div className="hero-noise" aria-hidden="true" />
      <div className="hero-ambient-gradient" aria-hidden="true" />
      <motion.div
        className="hero-light"
        style={{ background: light }}
        aria-hidden="true"
      />
      <svg
        className="hero-circuit-lines"
        viewBox="0 0 1440 760"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="csi-hero-circuit">
            <stop stopColor="#1269d6" stopOpacity="0" />
            <stop offset=".55" stopColor="#5c9cf3" stopOpacity=".5" />
            <stop offset="1" stopColor="#1b4f89" stopOpacity=".2" />
          </linearGradient>
        </defs>
        {circuitPaths.map((d, i) => (
          <path
            key={d}
            d={d}
            pathLength={1}
            style={{ "--circuit-order": i } as CSSProperties}
          />
        ))}
      </svg>
      <div className="energy-particles hero-energy" aria-hidden="true">
        {Array.from({ length: 10 }, (_, i) => (
          <i
            key={i}
            style={{
              left: `${8 + ((i * 29) % 85)}%`,
              top: `${11 + ((i * 17) % 76)}%`,
              animationDelay: `${i * -0.9}s`,
            }}
          />
        ))}
      </div>
      <div className="container cinematic-inner">
        <div className="cinematic-copy">
          <div className="hero-edition hero-arrival">
            <span className="status-dot" /> CONEXÕES QUE TRANSFORMAM{" "}
            <span className="edition-rule" /> CSI ELETROLAR
          </div>
          <h1 aria-label="Potência para criar. Conforto para viver.">
            <span className="hero-title-line">
              {["Potência", "para", "criar."].map((w, i) => word(w, i))}
            </span>
            <span className="hero-title-line">
              {["Conforto", "para"].map((w, i) => word(w, i + 3))}
              <span className="word-clip living-word">
                <span
                  className="hero-word-reveal"
                  style={{ "--word-order": 5 } as CSSProperties}
                >
                  viver<span className="living-dot">.</span>
                </span>
                <svg viewBox="0 0 200 16" aria-hidden="true">
                  <path
                    className="hero-living-underline"
                    pathLength={1}
                    d="M3 11Q95-3 195 6"
                  />
                </svg>
              </span>
            </span>
          </h1>
          <div className="hero-lead-arrival hero-arrival">
            <p className="cinematic-lead">
              Energia, tecnologia e climatização
              <br className="desktop-break" /> para seus projetos.
            </p>
            <p className="cinematic-description">
              Da primeira conexão ao clima perfeito.
              <br />
              Explore soluções que dão vida às suas ideias.
            </p>
          </div>
          <div className="cinematic-actions hero-actions-arrival hero-arrival">
            <Magnetic>
              <Link
                className="button yellow hero-primary-button"
                href="/catalogo"
              >
                <span>Explorar catálogo</span>
                <span className="hero-button-icon">
                  <ArrowUpRight size={19} />
                </span>
              </Link>
            </Magnetic>
            <Magnetic>
              <button
                className="button ghost-button hero-secondary-button"
                onClick={() => setDrawer(true)}
              >
                <span>Monte seu orçamento</span>
                <ArrowRight size={18} />
              </button>
            </Magnetic>
          </div>
          <div className="cinematic-assurance hero-assurance-arrival hero-arrival">
            <ShieldCheck size={17} />
            <span>Seu projeto merece as escolhas certas.</span>
          </div>
        </div>
        <motion.div
          className="hero-stage-scroll"
          style={{ y: enabled ? scrollDepth : 0 }}
        >
          <motion.div
            className="hero-stage-tilt"
            style={
              enabled
                ? { rotateX, rotateY, transformPerspective: 1200 }
                : undefined
            }
          >
            <HeroProductScene
              active={active}
              enabled={enabled}
              pointerX={pointerX}
              pointerY={pointerY}
              onHover={setHovered}
              onFocus={setFocused}
            />
          </motion.div>
        </motion.div>
      </div>
      <div className="container cinematic-bottom hero-footer">
        <span className="hero-footer-caption">
          <span className="hero-footer-line" />
          <b>DO PRIMEIRO FIO AO CLIMA IDEAL.</b>
        </span>
        <Link className="hero-scroll-cue" href="#categorias">
          <span className="hero-scroll-icon">
            <ArrowDown size={17} />
          </span>
          <span>
            Explore as possibilidades
            <small>Seu próximo projeto começa aqui.</small>
          </span>
        </Link>
        <span className="hero-bottom-signature">
          <Zap size={13} /> FEITO PARA CONECTAR.
        </span>
      </div>
      <div className="hero-section-edge" aria-hidden="true" />
    </section>
  );
}
