"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AudioControl() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const removeListenersRef = useRef(null);

  // Keyframes for equalizer bars to make them look dynamic and organic
  const keyframes = [
    [4, 14, 6, 12, 4],
    [6, 10, 14, 4, 6],
    [3, 12, 8, 14, 3],
    [5, 8, 12, 3, 5]
  ];

  const durations = [0.7, 0.9, 0.8, 0.6];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Gentle zen volume
    audio.volume = 0.35;

    const handlePlaySuccess = () => {
      setIsPlaying(true);
      removeInteractionListeners();
    };

    const attemptPlay = () => {
      audio.play()
        .then(handlePlaySuccess)
        .catch((err) => {
          // Log is fine, standard autoplay browser warning
          console.log("Autoplay blocked, waiting for user interaction...", err);
        });
    };

    const removeInteractionListeners = () => {
      window.removeEventListener("click", attemptPlay);
      window.removeEventListener("touchstart", attemptPlay);
      window.removeEventListener("keydown", attemptPlay);
      window.removeEventListener("scroll", attemptPlay);
      removeListenersRef.current = null;
    };

    removeListenersRef.current = removeInteractionListeners;

    // Listen for any standard user gesture to kick off the audio
    window.addEventListener("click", attemptPlay);
    window.addEventListener("touchstart", attemptPlay);
    window.addEventListener("keydown", attemptPlay);
    window.addEventListener("scroll", attemptPlay);

    // Try to play immediately (might succeed if permissions allow or on hot-reloading)
    attemptPlay();

    return () => {
      removeInteractionListeners();
    };
  }, []);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // If the user manually toggles the sound, stop waiting for background interactions
    if (removeListenersRef.current) {
      removeListenersRef.current();
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Playback failed to start:", err);
        });
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        left: "clamp(12px, 3vw, 24px)",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 99,
        display: "flex",
        alignItems: "center",
      }}
    >
      <audio ref={audioRef} src="/bg.mp3" loop autoPlay preload="auto" />
      <button
        onClick={togglePlayback}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={isPlaying ? "Mute background audio" : "Play background audio"}
        title={isPlaying ? "Mute background audio" : "Play background audio"}
        style={{
          width: 36,
          height: 36,
          display: "grid",
          placeItems: "center",
          borderRadius: "50%",
          border: "1px solid var(--line)",
          background: "var(--panel)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          color: "var(--stone)",
          cursor: "pointer",
          transition: "border-color 0.3s ease, background-color 0.3s ease, transform 0.2s ease",
          outline: "none",
        }}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "2px",
            height: "14px",
            width: "16px",
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              style={{
                width: "2px",
                backgroundColor: "currentColor",
                borderRadius: "1px",
              }}
              animate={{
                height: isPlaying ? keyframes[i] : 3,
              }}
              transition={{
                duration: isPlaying ? durations[i] : 0.3,
                repeat: isPlaying ? Infinity : 0,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </button>

      <AnimatePresence>
        {isHovered && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 0.6, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.2 }}
            className="mono"
            style={{
              fontSize: "0.55rem",
              letterSpacing: "0.2em",
              marginLeft: "10px",
              whiteSpace: "nowrap",
              userSelect: "none",
              pointerEvents: "none",
              textShadow: "0 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            {isPlaying ? "SOUND ON" : "SOUND OFF"}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
