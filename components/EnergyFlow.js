"use client";

import { useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

/**
 * Mystical energy glow that flows through the page.
 * Creates a flowing radial gradient backdrop that transitions between sections.
 */
export default function EnergyFlow() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll();

  // Subtle parallax for the glow position
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 800]);

  useEffect(() => {
    const unsubscribe = glowY.onChange((latest) => {
      if (ref.current) {
        ref.current.style.transform = `translateY(${latest}px)`;
      }
    });
    return () => unsubscribe();
  }, [glowY]);

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "200vh",
        pointerEvents: "none",
        zIndex: 0,
        background:
          "radial-gradient(ellipse 900px 900px at 50% -200px, var(--glow-field) 0%, transparent 70%)",
        filter: "blur(60px)",
        opacity: 0.4,
        willChange: "transform",
      }}
    />
  );
}
