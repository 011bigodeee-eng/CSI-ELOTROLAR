"use client";

import { useEffect, useState, type ReactNode, type PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

/** Fine pointer effects are opt-in; touch and reduced-motion users get a static UI. */
export function useFinePointer() {
  const reduced = useReducedMotion();
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFine(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return fine && !reduced;
}
export function Magnetic({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const enabled = useFinePointer(),
    x = useMotionValue(0),
    y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 20 }),
    sy = useSpring(y, { stiffness: 260, damping: 20 });
  function move(e: PointerEvent<HTMLDivElement>) {
    if (!enabled) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.12);
    y.set((e.clientY - r.top - r.height / 2) * 0.16);
  }
  return (
    <motion.div
      className={`magnetic ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={move}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={enabled ? { scale: 0.97 } : undefined}
    >
      {children}
    </motion.div>
  );
}
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={reduced ? undefined : { y: [18, 0], opacity: [0.7, 1] }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
