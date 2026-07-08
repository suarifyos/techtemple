"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorGlow() {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 120, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 20, mass: 0.6 });

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    // Pointer only — skip on touch to save battery.
    if (window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener("pointermove", move);
      return () => window.removeEventListener("pointermove", move);
    }
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        left: sx,
        top: sy,
        x: "-50%",
        y: "-50%",
        width: 480,
        height: 480,
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 1,
        background:
          "radial-gradient(circle, rgba(233,184,114,0.10) 0%, rgba(233,184,114,0.04) 30%, transparent 62%)",
        mixBlendMode: "screen",
      }}
    />
  );
}
