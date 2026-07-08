"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/lib/site";

const FIELD = {
  width: "100%",
  padding: "14px 16px",
  background: "var(--field-bg)",
  border: "1px solid var(--line)",
  borderRadius: 6,
  color: "var(--stone)",
  fontFamily: "var(--mono)",
  fontSize: "0.85rem",
  letterSpacing: "0.04em",
  outline: "none",
};

const LABEL = {
  display: "block",
  marginBottom: 8,
  fontSize: "0.62rem",
  letterSpacing: "0.28em",
  textTransform: "uppercase",
  color: "var(--stone-dim)",
  fontFamily: "var(--mono)",
};

export default function BookingModal({ open, onClose }) {
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [form, setForm] = useState({
    name: "",
    email: "",
    date: "",
    topic: "",
  });

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("bad status");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5vw",
            background: "var(--backdrop)",
            backdropFilter: "blur(10px)",
          }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: "100%",
              maxWidth: 520,
              background: "var(--ink-2)",
              border: "1px solid var(--line)",
              borderRadius: 12,
              padding: "clamp(28px, 5vw, 48px)",
              position: "relative",
              boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
            }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                position: "absolute",
                top: 18,
                right: 20,
                background: "none",
                border: "none",
                color: "var(--stone-dim)",
                fontSize: "1.4rem",
                lineHeight: 1,
              }}
            >
              ×
            </button>

            {status === "done" ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: "center", padding: "20px 0" }}
              >
                <div className="flame" style={{ fontSize: "3rem", marginBottom: 14 }}>
                  ⟡
                </div>
                <h3 className="display" style={{ fontSize: "2rem", marginBottom: 12 }}>
                  Your request is received.
                </h3>
                <p style={{ color: "var(--stone-dim)" }}>
                  The temple will reply to{" "}
                  <span className="flame">{form.email}</span> to confirm your
                  hour. Rest easy.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={submit}>
                <div className="mono" style={{ marginBottom: 10 }}>
                  Arrange a session
                </div>
                <h3
                  className="display"
                  style={{ fontSize: "2.1rem", marginBottom: 6 }}
                >
                  Book the hour.
                </h3>
                <p
                  style={{
                    color: "var(--stone-dim)",
                    fontSize: "0.95rem",
                    marginBottom: 28,
                  }}
                >
                  {site.rate.amount} {site.rate.unit} · you'll receive a
                  confirmation and payment link by email.
                </p>

                <div style={{ display: "grid", gap: 18 }}>
                  <div>
                    <label style={LABEL} htmlFor="bk-name">Name</label>
                    <input
                      id="bk-name"
                      style={FIELD}
                      value={form.name}
                      onChange={set("name")}
                      required
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label style={LABEL} htmlFor="bk-email">Email</label>
                    <input
                      id="bk-email"
                      type="email"
                      style={FIELD}
                      value={form.email}
                      onChange={set("email")}
                      required
                      placeholder="you@company.com"
                    />
                  </div>
                  <div>
                    <label style={LABEL} htmlFor="bk-date">Preferred date</label>
                    <input
                      id="bk-date"
                      type="date"
                      style={FIELD}
                      value={form.date}
                      onChange={set("date")}
                      required
                    />
                  </div>
                  <div>
                    <label style={LABEL} htmlFor="bk-topic">What haunts you?</label>
                    <textarea
                      id="bk-topic"
                      style={{ ...FIELD, minHeight: 90, resize: "vertical" }}
                      value={form.topic}
                      onChange={set("topic")}
                      required
                      placeholder="The bug, the decision, the architecture…"
                    />
                  </div>
                </div>

                {status === "error" && (
                  <p style={{ color: "#e07a5f", fontSize: "0.85rem", marginTop: 16 }}>
                    Something went wrong. Please try again.
                  </p>
                )}

                <motion.button
                  type="submit"
                  disabled={status === "sending"}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    marginTop: 28,
                    width: "100%",
                    padding: "16px",
                    borderRadius: 999,
                    border: "1px solid var(--flame)",
                    background: "var(--flame)",
                    color: "var(--on-flame)",
                    fontSize: "0.72rem",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    opacity: status === "sending" ? 0.6 : 1,
                  }}
                >
                  {status === "sending" ? "Sending…" : "Request the hour"}
                </motion.button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
