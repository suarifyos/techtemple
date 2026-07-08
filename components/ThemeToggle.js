"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(null);

  // Sync from the attribute the anti-flash script already set on <html>.
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme || "dark");
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("tt-theme", next);
    } catch {}
    setTheme(next);
  };

  // Avoid rendering a mismatched icon before we know the theme.
  if (!theme) return <span style={{ width: 34, height: 34 }} aria-hidden />;

  const isLight = theme === "light";

  return (
    <button
      onClick={toggle}
      aria-label={isLight ? "Switch to dark" : "Switch to light"}
      title={isLight ? "Dark temple" : "Sunlit temple"}
      style={{
        width: 34,
        height: 34,
        display: "grid",
        placeItems: "center",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.4)",
        background: "none",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 14, opacity: 0, rotate: -30 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -14, opacity: 0, rotate: 30 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: 15, lineHeight: 1 }}
        >
          {isLight ? "☾" : "☀"}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
