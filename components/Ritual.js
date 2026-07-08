"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Embers from "./Embers";
import MagneticButton from "./MagneticButton";

export default function Ritual({ onBook }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [120, -60]);

  return (
    <section ref={ref} className="section">
      <Embers count={40} seed={33} />
      {/* Rising glow from the floor */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "45vh",
          background:
            "radial-gradient(80% 100% at 50% 100%, var(--glow-field), transparent 70%)",
          zIndex: 0,
        }}
      />
      <motion.div className="wrap" style={{ y, textAlign: "center" }}>
        <div className="mono" style={{ marginBottom: 40 }}>
          V · The Ritual
        </div>
        <h2
          className="display"
          style={{
            fontSize: "clamp(2.6rem, 8vw, 6.5rem)",
            lineHeight: 1,
            marginBottom: 30,
          }}
        >
          Bring your <span className="flame">hardest hour.</span>
        </h2>
        <p
          style={{
            color: "var(--stone-dim)",
            maxWidth: 500,
            margin: "0 auto 46px",
            fontSize: "1.15rem",
          }}
        >
          Choose a time. Describe what haunts you. We will sit with it together
          until it clears.
        </p>
        <MagneticButton
          primary
          onClick={onBook}
          style={{ padding: "20px 40px", fontSize: "0.8rem" }}
        >
          Arrange a session
        </MagneticButton>

        <div
          className="mono"
          style={{ marginTop: 90, opacity: 0.5, fontSize: "0.65rem" }}
        >
          Tech Temple · Wisdom, by the hour
        </div>
      </motion.div>
    </section>
  );
}
