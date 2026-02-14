import { motion } from "framer-motion";

const FLOATING_ORBS = [
  {
    size: 180,
    top: "10%",
    left: "-4%",
    color: "radial-gradient(circle, rgba(251, 191, 36, 0.32), rgba(251, 191, 36, 0))",
    duration: 11,
    delay: 0,
    y: -18,
    x: 10,
  },
  {
    size: 220,
    top: "58%",
    left: "75%",
    color: "radial-gradient(circle, rgba(251, 146, 60, 0.24), rgba(251, 146, 60, 0))",
    duration: 13,
    delay: 1.2,
    y: -22,
    x: -12,
  },
  {
    size: 140,
    top: "26%",
    left: "72%",
    color: "radial-gradient(circle, rgba(253, 224, 71, 0.28), rgba(253, 224, 71, 0))",
    duration: 9,
    delay: 0.6,
    y: -14,
    x: 8,
  },
  {
    size: 120,
    top: "75%",
    left: "14%",
    color: "radial-gradient(circle, rgba(245, 158, 11, 0.24), rgba(245, 158, 11, 0))",
    duration: 10,
    delay: 0.3,
    y: -16,
    x: 7,
  },
];

export function FloatingDecor({ intensity = "normal" }) {
  const opacityClass =
    intensity === "soft" ? "opacity-85" : intensity === "strong" ? "opacity-100" : "opacity-95";

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${opacityClass}`}>
      {FLOATING_ORBS.map((orb, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full blur-xl"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            background: orb.color,
          }}
          animate={{
            y: [0, orb.y, 0],
            x: [0, orb.x, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}
