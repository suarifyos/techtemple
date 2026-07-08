// Single source of truth for editable content.
// Change the rate, copy, and services here — nowhere else.

export const site = {
  name: "Tech Temple",
  tagline: "Wisdom, by the hour.",
  // The one number. Edit this to set your rate.
  rate: {
    amount: "$250",
    unit: "/ hour",
    note: "One rate. No retainers. No packages. Book the time you need.",
  },
  philosophy:
    "Most technical problems are not problems of code. They are problems of clarity. The Tech Temple exists for the hour in which fog becomes form.",
  practice: [
    {
      k: "01",
      title: "Architecture & Direction",
      body: "Cut through the noise. Decide the shape of the thing before a line is written.",
    },
    {
      k: "02",
      title: "Code Review & Repair",
      body: "A master's eye over your worst files. What to keep, what to burn, what to leave alone.",
    },
    {
      k: "03",
      title: "The Unblocking",
      body: "The bug that has held you for three days. We sit with it until it yields.",
    },
    {
      k: "04",
      title: "Strategy & Counsel",
      body: "Stack choices, hiring, scale, and the quiet question of what not to build.",
    },
  ],
  proof: [
    {
      quote:
        "One hour saved us a quarter. He deleted more than he added, and the product got faster.",
      name: "Rina O.",
      role: "CTO, Seedstage fintech",
    },
    {
      quote:
        "I came in with a roadmap of forty things. I left with three. The three were right.",
      name: "Marcus D.",
      role: "Founder, dev-tools",
    },
    {
      quote:
        "Calm, precise, and faster than anyone I've paid ten times as much. The temple is real.",
      name: "Aiko T.",
      role: "Eng Lead, marketplace",
    },
  ],
};
