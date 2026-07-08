"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Embers from "./Embers";
import MagneticButton from "./MagneticButton";
import { site } from "@/lib/site";

export default function Rate({ onBook }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 1.15]);
  const glow = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 1, 0]);

  return (
    <section id="rate" ref={ref} className="section">
      <Embers count={18} seed={19} />
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(60% 50% at 50% 50%, var(--glow-field), transparent 70%)",
          opacity: glow,
          zIndex: 0,
        }}
      />
      <div className="wrap" style={{ textAlign: "center" }}>
        <div className="mono" style={{ marginBottom: 40 }}>
          III · The Rate
        </div>
        <motion.div style={{ scale }}>
          <div
            className="display flame"
            style={{
              fontSize: "clamp(6rem, 26vw, 20rem)",
              lineHeight: 0.9,
              fontWeight: 500,
            }}
          >
            {site.rate.amount}
          </div>
          <div
            className="mono"
            style={{ fontSize: "1rem", letterSpacing: "0.4em", marginTop: 8 }}
          >
            {site.rate.unit}
          </div>
        </motion.div>
        <p
          style={{
            color: "var(--stone-dim)",
            maxWidth: 480,
            margin: "40px auto 40px",
            fontSize: "1.1rem",
          }}
        >
          {site.rate.note}
        </p>
        <MagneticButton primary onClick={onBook}>
          Book the hour
        </MagneticButton>
      </div>
    </section>
  );
}
