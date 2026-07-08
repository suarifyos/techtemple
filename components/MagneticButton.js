"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function MagneticButton({ children, onClick, primary, style }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * 0.35);
    y.set(relY * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onPointerMove={onMove}
      onPointerLeave={reset}
      whileTap={{ scale: 0.96 }}
      style={{
        x: sx,
        y: sy,
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        padding: "16px 30px",
        borderRadius: 999,
        fontSize: "0.72rem",
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        border: primary
          ? "1px solid var(--flame)"
          : "1px solid var(--line)",
        background: primary ? "var(--flame)" : "transparent",
        color: primary ? "var(--on-flame)" : "var(--stone)",
        ...style,
      }}
    >
      {children}
    </motion.button>
  );
}
