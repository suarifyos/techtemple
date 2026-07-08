"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Embers from "./Embers";
import MagneticButton from "./MagneticButton";
import { site } from "@/lib/site";

const word = {
  hidden: { y: "110%", opacity: 0 },
  show: (i) => ({
    y: "0%",
    opacity: 1,
    transition: { delay: 0.15 + i * 0.09, duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Hero({ onBook }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax depth layers.
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 240]);
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 1.35]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const haloY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const words = ["Wisdom,", "by", "the", "hour."];

  return (
    <section ref={ref} className="section" style={{ minHeight: "100vh" }}>
      <Embers count={30} />

      {/* Mystical energy halo (background layer) */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "42%",
          left: "50%",
          x: "-50%",
          y: orbY,
          scale: orbScale,
          width: "min(85vw, 850px)",
          height: "min(85vw, 850px)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(232, 94, 44, 0.15) 0%, rgba(255, 138, 92, 0.08) 30%, transparent 70%)",
          filter: "blur(80px)",
          zIndex: 0,
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Far layer: the glowing orb / temple flame */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "42%",
          left: "50%",
          x: "-50%",
          y: orbY,
          scale: orbScale,
          width: "min(62vw, 620px)",
          height: "min(62vw, 620px)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, var(--glow-a) 0%, var(--glow-b) 34%, transparent 66%)",
          filter: "blur(6px)",
          zIndex: 1,
        }}
      />
      {/* The orb core with enhanced mystical glow */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "42%",
          left: "50%",
          x: "-50%",
          y: haloY,
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "var(--flame-strong)",
          boxShadow:
            "0 0 40px 12px var(--glow-core-1), 0 0 120px 40px var(--glow-core-2), 0 0 200px 60px rgba(255, 138, 92, 0.3)",
          zIndex: 2,
        }}
        animate={{
          opacity: [0.6, 1, 0.75, 1, 0.6],
          scale: [1, 1.3, 1.15, 1.35, 1]
        }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="wrap"
        style={{ y: textY, opacity: fade, textAlign: "center" }}
      >
        <motion.div
          className="mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 1 }}
          style={{ marginBottom: 40 }}
        >
          The Tech Temple · est. now
        </motion.div>

        <h1
          className="display"
          style={{ fontSize: "clamp(3rem, 12vw, 11rem)", marginBottom: 10 }}
        >
          {words.map((w, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                overflow: "hidden",
                verticalAlign: "top",
                marginRight: "0.28em",
              }}
            >
              <motion.span
                custom={i}
                variants={word}
                initial="hidden"
                animate="show"
                style={{
                  display: "inline-block",
                  color: w.includes("hour") ? "var(--flame)" : "var(--stone)",
                }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1 }}
          style={{
            color: "var(--stone-dim)",
            fontSize: "clamp(1rem, 2vw, 1.35rem)",
            maxWidth: 540,
            margin: "0 auto 44px",
          }}
        >
          An hour with a techmonk. Architecture, code review, unblocking, and
          counsel — dispensed with a calm that only mastery allows.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 1 }}
          style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
        >
          <MagneticButton primary onClick={onBook}>
            Arrange a session
          </MagneticButton>
          <MagneticButton onClick={() => document.getElementById("rate")?.scrollIntoView({ behavior: "smooth" })}>
            {site.rate.amount} {site.rate.unit}
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{
          position: "absolute",
          bottom: 34,
          left: "50%",
          x: "-50%",
          opacity: fade,
        }}
        className="mono"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          descend ↓
        </motion.div>
      </motion.div>
    </section>
  );
}
