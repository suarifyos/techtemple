"use client";

import { motion } from "framer-motion";
import { site } from "@/lib/site";

export default function Practice() {
  return (
    <section className="section" style={{ alignItems: "flex-start" }}>
      <div className="wrap" style={{ paddingTop: "12vh" }}>
        <div className="mono" style={{ marginBottom: 34 }}>
          II · The Practice
        </div>
        <h2
          className="display"
          style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", marginBottom: 60, maxWidth: 720 }}
        >
          What an hour buys you.
        </h2>

        <div>
          {site.practice.map((p, i) => (
            <motion.div
              key={p.k}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ x: 14 }}
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "clamp(20px, 5vw, 70px)",
                alignItems: "baseline",
                padding: "30px 0",
                borderTop: "1px solid var(--line)",
              }}
            >
              <span
                className="mono flame"
                style={{ fontSize: "0.9rem", letterSpacing: "0.2em" }}
              >
                {p.k}
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 40px", alignItems: "baseline" }}>
                <h3
                  className="display"
                  style={{ fontSize: "clamp(1.5rem, 3.4vw, 2.4rem)", flex: "0 0 auto", minWidth: 260 }}
                >
                  {p.title}
                </h3>
                <p style={{ color: "var(--stone-dim)", flex: "1 1 300px", fontSize: "1.05rem" }}>
                  {p.body}
                </p>
              </div>
            </motion.div>
          ))}
          <div style={{ borderTop: "1px solid var(--line)" }} />
        </div>
      </div>
    </section>
  );
}
