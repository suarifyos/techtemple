"use client";

import { motion } from "framer-motion";
import { site } from "@/lib/site";

export default function Proof() {
  return (
    <section className="section" style={{ alignItems: "flex-start" }}>
      <div className="wrap" style={{ paddingTop: "12vh" }}>
        <div className="mono" style={{ marginBottom: 34 }}>
          IV · The Tablets
        </div>
        <h2
          className="display"
          style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", marginBottom: 60, maxWidth: 720 }}
        >
          What was said of the hour.
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {site.proof.map((t, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, borderColor: "rgba(233,184,114,0.4)" }}
              style={{
                border: "1px solid var(--line)",
                borderRadius: 4,
                padding: "34px 30px",
                background:
                  "linear-gradient(180deg, var(--panel), transparent)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 260,
              }}
            >
              <blockquote
                className="display"
                style={{ fontSize: "1.5rem", lineHeight: 1.3, fontWeight: 400 }}
              >
                “{t.quote}”
              </blockquote>
              <figcaption style={{ marginTop: 28 }}>
                <div className="flame" style={{ fontSize: "1.05rem" }}>
                  {t.name}
                </div>
                <div className="mono" style={{ marginTop: 6 }}>
                  {t.role}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
