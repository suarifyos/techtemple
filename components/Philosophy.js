"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { site } from "@/lib/site";

export default function Philosophy() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  const words = site.philosophy.split(" ");

  return (
    <section ref={ref} className="section">
      <motion.div className="wrap" style={{ y, maxWidth: 980 }}>
        <div className="mono" style={{ marginBottom: 34 }}>
          I · The Philosophy
        </div>
        <p
          className="display"
          style={{
            fontSize: "clamp(1.8rem, 5.2vw, 4.2rem)",
            lineHeight: 1.12,
            fontWeight: 400,
          }}
        >
          {words.map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0.12 }}
              whileInView={{ opacity: 1 }}
              viewport={{ margin: "-20% 0px -30% 0px" }}
              transition={{ duration: 0.5, delay: i * 0.02 }}
              style={{ display: "inline-block", marginRight: "0.26em" }}
            >
              {w}
            </motion.span>
          ))}
        </p>
      </motion.div>
    </section>
  );
}
