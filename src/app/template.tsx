"use client";
import { motion, useReducedMotion } from "framer-motion";
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={false}
      animate={
        reduced ? { opacity: 1, y: 0 } : { opacity: [0.8, 1], y: [6, 0] }
      }
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
