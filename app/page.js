"use client";

import { useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import CursorGlow from "@/components/CursorGlow";
import EnergyFlow from "@/components/EnergyFlow";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import ScrollScrub from "@/components/ScrollScrub";
import Practice from "@/components/Practice";
import Rate from "@/components/Rate";
import Proof from "@/components/Proof";
import Ritual from "@/components/Ritual";
import BookingModal from "@/components/BookingModal";
import ThemeToggle from "@/components/ThemeToggle";
import AudioControl from "@/components/AudioControl";
import { site } from "@/lib/site";

export default function Page() {
  const [booking, setBooking] = useState(false);
  const openBook = () => setBooking(true);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <main className="snap">
      <CursorGlow />
      <EnergyFlow />
      <AudioControl />

      {/* Scroll progress line */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "var(--flame)",
          transformOrigin: "0%",
          scaleX: progress,
          zIndex: 80,
        }}
      />

      {/* Fixed header */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 70,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "22px clamp(20px, 6vw, 60px)",
          mixBlendMode: "difference",
        }}
      >
        <div
          className="mono"
          style={{ color: "#fff", fontSize: "0.7rem", letterSpacing: "0.3em" }}
        >
          ⟡ {site.name}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ThemeToggle />
          <button
            onClick={openBook}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.4)",
              color: "#fff",
              padding: "9px 20px",
              borderRadius: 999,
              fontSize: "0.62rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
            }}
          >
            Book
          </button>
        </div>
      </header>

      <Hero onBook={openBook} />
      <Philosophy />
      {/* Scroll-scrubbed cinematic slide. Drop Higgsfield frames into
          public/frames/hero/ and pass src + frameCount to switch off placeholder. */}
      <ScrollScrub
        videoSrc="/video/hero.mp4"
        frameCount={120}
        heightVh={320}
        eyebrow="The Ascent"
        captions={[
          "Scroll to enter the temple.",
          "The fog begins to clear.",
          "Form emerges from the noise.",
          "Sit. The hour begins.",
        ]}
      />
      <Practice />
      <Rate onBook={openBook} />
      <Proof />
      <Ritual onBook={openBook} />

      <BookingModal open={booking} onClose={() => setBooking(false)} />
    </main>
  );
}
