"use client";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Brand } from "./brand";
const SESSION_KEY = "csi-brand-intro-v1";
export function BrandIntro() {
  const [visible, setVisible] = useState(false);
  const path = usePathname();
  const started = useRef(false);
  useEffect(() => {
    if (
      path !== "/" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    try {
      if (sessionStorage.getItem(SESSION_KEY) && !started.current) return;
      started.current = true;
      sessionStorage.setItem(SESSION_KEY, "seen");
    } catch {
      return;
    }
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 1750);
    return () => clearTimeout(timer);
  }, []); // One decision per mounted app session. Route navigation never repeats the intro.
  useEffect(() => {
    if (path !== "/") setVisible(false);
  }, [path]);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="brand-intro"
          aria-hidden="true"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, clipPath: "inset(0 0 100% 0 round 0 0 50% 50%)" }}
          transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="intro-orbit" />
          <motion.div
            className="intro-brand"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55 }}
          >
            <Brand />
            <div className="intro-energy" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            Energia para criar. <span>Conforto para viver.</span>
          </motion.p>
          <div className="intro-progress" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
