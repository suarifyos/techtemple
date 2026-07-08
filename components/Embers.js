"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

// Deterministic pseudo-random so SSR and client agree (no hydration flicker).
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function Embers({ count = 26, seed = 7 }) {
  const embers = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: r() * 100,
      size: 1 + r() * 2.4,
      delay: r() * 8,
      duration: 9 + r() * 12,
      drift: (r() - 0.5) * 60,
      opacity: 0.15 + r() * 0.5,
    }));
  }, [count, seed]);

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {embers.map((e) => (
        <motion.span
          key={e.id}
          initial={{ y: "110vh", x: 0, opacity: 0 }}
          animate={{
            y: "-10vh",
            x: e.drift,
            opacity: [0, e.opacity, e.opacity, 0],
          }}
          transition={{
            duration: e.duration,
            delay: e.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            left: `${e.left}%`,
            bottom: 0,
            width: e.size,
            height: e.size,
            borderRadius: "50%",
            background: "var(--flame)",
            boxShadow: "0 0 8px var(--flame)",
          }}
        />
      ))}
    </div>
  );
}
