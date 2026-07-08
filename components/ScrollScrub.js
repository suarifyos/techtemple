"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * Scroll-scrubbed cinematic slide (Apple-style).
 *
 * The section is `heightVh` tall; a sticky child pins one viewport while you
 * scroll through it. Scroll progress (0→1) maps to a frame drawn on a <canvas>.
 * Drawing is driven by the window `scroll` event (not rAF) so it works even in
 * throttled/headless tabs.
 *
 * MODES (first available wins):
 *  - `videoSrc`: the video is DECODED INTO FRAMES ONCE on load (client-side),
 *    then scrubbing draws pre-decoded frames instantly — smooth, no re-seeking.
 *  - `src`: an external frame sequence (`/frames/hero/frame_0001.jpg`, …).
 *  - Placeholder: a procedural cinematic temple scene, per-frame.
 */
export default function ScrollScrub({
  frameCount = 120,
  src = null,
  videoSrc = null,
  videoFrameCount = 48,
  heightVh = 320,
  eyebrow = "The Ascent",
  captions = ["Scroll to enter.", "The fog begins to clear.", "Form emerges."],
}) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const framesRef = useRef([]); // pre-decoded video frames (ImageBitmap/canvas)
  const framesReady = useRef(false);
  const lastCaption = useRef(-1);
  const [captionIndex, setCaptionIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    if (src) {
      imagesRef.current = Array.from({ length: frameCount }, (_, i) => {
        const im = new Image();
        im.src = src(i);
        im.onload = update;
        return im;
      });
    }

    // Decode the video into a fixed set of frames, once. Scrubbing then draws
    // those frames with zero seeking → smooth.
    if (videoSrc) {
      const v = document.createElement("video");
      v.src = videoSrc;
      v.muted = true;
      v.playsInline = true;
      v.preload = "auto";
      v.addEventListener(
        "loadeddata",
        () => {
          extractFrames(v).catch(() => {});
        },
        { once: true }
      );
      v.addEventListener("error", () => {}); // stays on placeholder
    }

    const seekTo = (v, t) =>
      new Promise((res) => {
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          v.removeEventListener("seeked", finish);
          res();
        };
        v.addEventListener("seeked", finish);
        try {
          v.currentTime = t;
        } catch {
          finish();
        }
        setTimeout(finish, 800); // safety: never hang
      });

    async function extractFrames(v) {
      const N = videoFrameCount;
      const dur = v.duration && isFinite(v.duration) ? v.duration : 5;
      const frames = [];
      for (let i = 0; i < N; i++) {
        if (cancelled) return;
        await seekTo(v, (i / (N - 1)) * Math.max(0, dur - 0.05));
        frames.push(await captureFrame(v));
        // Show progress: enable once a handful are ready for instant feedback.
        if (i === Math.min(6, N - 1)) {
          framesRef.current = frames;
          framesReady.current = true;
          update();
        }
      }
      if (cancelled) return;
      framesRef.current = frames;
      framesReady.current = true;
      // Release the decoder now that we have the frames.
      v.removeAttribute("src");
      v.load();
      update();
    }

    // Progress 0→1 across the tall section, straight from the DOM.
    const progress = () => {
      const sec = sectionRef.current;
      if (!sec) return 0;
      const rect = sec.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      return total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
    };

    function update() {
      const t = progress();
      draw(t);
      const ci = Math.min(captions.length - 1, Math.floor(t * captions.length));
      if (ci !== lastCaption.current) {
        lastCaption.current = ci;
        setCaptionIndex(ci);
      }
    }

    update();
    const settle = setTimeout(update, 80);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      cancelled = true;
      clearTimeout(settle);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      obs.disconnect();
      framesRef.current.forEach((f) => f && f.close && f.close());
      framesRef.current = [];
      framesReady.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, frameCount, videoSrc, videoFrameCount]);

  // --- Drawing -------------------------------------------------------------
  const draw = (t) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const bw = Math.round(rect.width * dpr);
    const bh = Math.round(rect.height * dpr);
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw;
      canvas.height = bh;
    }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = rect.width;
    const h = rect.height;

    // 1) Pre-decoded video frames.
    const frames = framesRef.current;
    if (videoSrc && framesReady.current && frames.length) {
      const idx = Math.min(frames.length - 1, Math.max(0, Math.round(t * (frames.length - 1))));
      const f = frames[idx];
      if (f) {
        ctx.fillStyle = "#08070a";
        ctx.fillRect(0, 0, w, h);
        drawImageCover(ctx, f, w, h);
        drawLetterbox(ctx, w, h);
        return;
      }
    }

    // 2) External frame sequence.
    const imgs = imagesRef.current;
    if (src && imgs.length) {
      const idx = Math.min(frameCount - 1, Math.max(0, Math.round(t * (frameCount - 1))));
      const img = imgs[idx];
      if (img && img.complete && img.naturalWidth) {
        ctx.fillStyle = "#08070a";
        ctx.fillRect(0, 0, w, h);
        drawImageCover(ctx, img, w, h);
        drawLetterbox(ctx, w, h);
        return;
      }
    }

    // 3) Placeholder (also shown while a video is decoding).
    const footer = videoSrc ? "PREPARING FILM…" : "PLACEHOLDER — DROP HIGGSFIELD FRAMES";
    drawPlaceholder(ctx, w, h, t, frameCount, footer);
  };

  return (
    <section
      ref={sectionRef}
      style={{ height: `${heightVh}vh`, position: "relative", scrollSnapAlign: "none" }}
    >
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
        />

        {/* Dark scrim behind the text so it stays legible over the flame. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
            background:
              "radial-gradient(58% 42% at 50% 48%, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.34) 38%, transparent 68%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            zIndex: 2,
            pointerEvents: "none",
            padding: "0 6vw",
          }}
        >
          <div
            className="mono"
            style={{
              marginBottom: 24,
              color: "#ff8a5a",
              textShadow: "0 1px 20px rgba(0,0,0,0.8)",
            }}
          >
            {eyebrow}
          </div>
          <motion.h2
            key={captionIndex}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="display"
            style={{
              fontSize: "clamp(2.2rem, 6vw, 5rem)",
              lineHeight: 1.02,
              maxWidth: 900,
              color: "#f6f1e8",
              textShadow: "0 2px 30px rgba(0,0,0,0.85), 0 0 60px rgba(0,0,0,0.6)",
            }}
          >
            {captions[captionIndex]}
          </motion.h2>
        </div>
      </div>
    </section>
  );
}

// --- helpers ---------------------------------------------------------------
async function captureFrame(v) {
  // Prefer ImageBitmap (GPU-backed, cheap to draw). Downscale for memory.
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(v, { resizeWidth: 1280, resizeQuality: "high" });
    } catch {
      try {
        return await createImageBitmap(v);
      } catch {
        /* fall through */
      }
    }
  }
  // Fallback: snapshot to a canvas.
  const c = document.createElement("canvas");
  const scale = Math.min(1, 1280 / (v.videoWidth || 1280));
  c.width = Math.round((v.videoWidth || 1280) * scale);
  c.height = Math.round((v.videoHeight || 720) * scale);
  c.getContext("2d").drawImage(v, 0, 0, c.width, c.height);
  return c;
}

function drawImageCover(ctx, media, w, h) {
  const mw = media.videoWidth || media.naturalWidth || media.width;
  const mh = media.videoHeight || media.naturalHeight || media.height;
  if (!mw || !mh) return;
  const ir = mw / mh;
  const cr = w / h;
  let dw, dh;
  if (ir > cr) {
    dh = h;
    dw = h * ir;
  } else {
    dw = w;
    dh = w / ir;
  }
  ctx.drawImage(media, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

function drawLetterbox(ctx, w, h) {
  const bar = h * 0.07;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, bar);
  ctx.fillRect(0, h - bar, w, bar);
}

// Procedural placeholder: a cinematic dark "film" panel with a rising
// flame-orb + embers. Always dark so it reads as a video slide in both themes.
function drawPlaceholder(ctx, w, h, t, frameCount, footer) {
  const BG = "#08070a";
  const FLAME = "#e85e2c";
  const FLAME_STRONG = "#ff8a5a";
  const DIM = "#8a857c";

  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h * (0.74 - t * 0.26);
  const R = Math.max(w, h) * (0.22 + t * 0.6);

  const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
  halo.addColorStop(0, hexA(FLAME_STRONG, 0.55));
  halo.addColorStop(0.35, hexA(FLAME, 0.2));
  halo.addColorStop(1, hexA(FLAME, 0));
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, w, h);

  const core = 8 + t * 30;
  ctx.beginPath();
  ctx.arc(cx, cy, core, 0, Math.PI * 2);
  ctx.fillStyle = FLAME_STRONG;
  ctx.shadowBlur = 50 + t * 70;
  ctx.shadowColor = FLAME;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = hexA(FLAME, 0.6);
  for (let i = 0; i < 70; i++) {
    const seed = i * 12.9898;
    const rx = fract(Math.sin(seed) * 43758.5453);
    const ry = fract(Math.cos(seed) * 24634.6345);
    const ex = (rx * 1.4 - 0.2) * w + Math.sin(t * 6 + i) * 8;
    const ey = (((ry - t * (0.3 + rx * 0.6)) % 1) + 1) % 1 * h;
    const es = 0.6 + rx * 1.8;
    ctx.globalAlpha = 0.15 + fract(rx + ry) * 0.55;
    ctx.beginPath();
    ctx.arc(ex, ey, es, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  drawLetterbox(ctx, w, h);

  const bar = h * 0.07;
  ctx.fillStyle = hexA(DIM, 0.85);
  ctx.font = "11px 'IBM Plex Mono', monospace";
  ctx.textAlign = "right";
  ctx.fillText(footer || "", w - 20, h - bar - 16);
  ctx.textAlign = "left";
  ctx.fillStyle = hexA(FLAME, 0.9);
  ctx.fillText("● REC", 20, h - bar - 16);
}

function fract(x) {
  return x - Math.floor(x);
}
function hexA(hex, a) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
