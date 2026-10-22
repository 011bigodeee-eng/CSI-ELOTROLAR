"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { officialLogo } from "@/lib/visual-assets";
import { Brand } from "./brand";
import type { CSSProperties } from "react";
const routes = [
  "M0 250H225L285 310H405L495 400H600",
  "M0 520H205L285 440H450L490 400H600",
  "M115 0V155L230 270H390L520 400H600",
  "M365 0V175L475 285V350L525 400H600",
  "M1200 250H975L915 310H795L705 400H600",
  "M1200 520H995L915 440H750L710 400H600",
  "M1085 0V155L970 270H810L680 400H600",
  "M835 0V175L725 285V350L675 400H600",
  "M130 800V665L270 525H425L550 400H600",
  "M1070 800V665L930 525H775L650 400H600",
  "M440 800V635L535 540V465L600 400",
  "M760 800V635L665 540V465L600 400",
];
function Phrase({ text, second = false }: { text: string; second?: boolean }) {
  return (
    <span
      className={`intro-phrase ${second ? "intro-phrase-second" : ""}`}
      aria-label={text}
    >
      {Array.from(text).map((letter, i) => (
        <span
          aria-hidden="true"
          key={i}
          className={second && i >= 14 && i <= 18 ? "intro-yellow" : ""}
          style={{ "--letter": i } as CSSProperties}
        >
          {letter === " " ? "\u00a0" : letter}
        </span>
      ))}
    </span>
  );
}
/** Always server-rendered. Only the head controller chooses whether this is visible. */
export function BrandIntro() {
  const path = usePathname();
  useEffect(() => {
    if (path !== "/") window.__CSI_INTRO__?.finish("navigation");
  }, [path]);
  return (
    <section
      id="csi-brand-intro"
      className="brand-intro csi-intro"
      role="dialog"
      aria-modal="true"
      aria-label="Apresentação CSI Eletrolar"
    >
      <div className="intro-backdrop" aria-hidden="true" />
      <div className="intro-vignette" aria-hidden="true" />
      <div className="intro-field" aria-hidden="true">
        <div className="intro-depth-ring ring-wide" />
        <div className="intro-depth-ring ring-narrow" />
        <div className="intro-origin" />
        <div className="intro-discharge" />
        <svg
          className="intro-circuits"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="csi-circuit-energy">
              <stop stopColor="#115fce" />
              <stop offset=".5" stopColor="#a0d9ff" />
              <stop offset="1" stopColor="#ffdf49" />
            </linearGradient>
          </defs>
          {routes.map((d, i) => (
            <g key={d} style={{ "--route": i } as CSSProperties}>
              <path className="circuit-ghost" d={d} />
              <path className="circuit-energy" pathLength={1} d={d} />
            </g>
          ))}
        </svg>
        <div className="intro-particle-field">
          {Array.from({ length: 24 }, (_, i) => {
            const angle = (i * Math.PI * 2) / 24,
              radius = 23 + (i % 4) * 7;
            return (
              <i
                key={i}
                style={
                  {
                    "--particle": i,
                    "--px": `${(Math.cos(angle) * radius).toFixed(2)}vmin`,
                    "--py": `${(Math.sin(angle) * radius * 0.75).toFixed(2)}vmin`,
                    "--sx": `${(Math.cos(angle) * radius * 1.8).toFixed(2)}vmin`,
                    "--sy": `${(Math.sin(angle) * radius * 1.5).toFixed(2)}vmin`,
                  } as CSSProperties
                }
              />
            );
          })}
        </div>
        <div className="intro-ambient-pulse" />
        <div className="intro-convergence" aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => (
            <i key={i} style={{ "--ray": i } as CSSProperties} />
          ))}
        </div>
        <div className="intro-volumetric-light" aria-hidden="true" />
        <div className="intro-impact-ring" />
        <div className="intro-impact-ring impact-yellow" />
      </div>
      <div className="intro-story">
        <span className="intro-concept">
          Toda grande transformação
          <br />
          começa com uma conexão.
        </span>
        <div
          className={`intro-mark ${officialLogo ? "intro-mark-official" : ""}`}
        >
          <div className="intro-mark-outline" aria-hidden="true">
            <Brand />
          </div>
          <div className="intro-mark-solid" aria-label="CSI Eletrolar">
            <Brand />
          </div>
          <div className="intro-logo-sweep" aria-hidden="true" />
        </div>
        <div className="intro-typography">
          <Phrase text="ENERGIA PARA CRIAR." />
          <Phrase text="CONFORTO PARA VIVER." second />
        </div>
      </div>
      <div className="intro-reveal-beam" aria-hidden="true" />
      <div className="intro-bottom">
        <span className="intro-sector">
          ELÉTRICA <i /> CLIMATIZAÇÃO
        </span>
        <div className="intro-timeline-progress" aria-hidden="true">
          <span />
        </div>
        <button
          type="button"
          data-csi-intro-skip
          onClick={() => window.__CSI_INTRO__?.skip()}
          className="intro-skip"
        >
          Pular introdução <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}
