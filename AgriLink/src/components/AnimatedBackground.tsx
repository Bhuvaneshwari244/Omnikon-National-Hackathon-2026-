import { motion } from "framer-motion";
import { useMemo } from "react";

const cropEmojis = ["🌾", "🌽", "🍚", "🌿", "🍃", "☘️", "🌱", "🍂", "🌻", "🌺", "🍀", "🌴", "🥬", "🍅", "🥕", "🫑", "🌶️", "🥭", "🍋", "🍊"];

interface Particle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
  opacity: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: cropEmojis[Math.floor(Math.random() * cropEmojis.length)],
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 22 + Math.random() * 32,
    duration: 12 + Math.random() * 20,
    delay: Math.random() * -15,
    rotation: Math.random() * 360,
    opacity: 0.35 + Math.random() * 0.3,
  }));
}

export default function AnimatedBackground() {
  const particles = useMemo(() => generateParticles(35), []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Vivid gradient blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[55vw] h-[55vh] rounded-full blur-[120px] opacity-60"
          style={{ background: "radial-gradient(circle, hsl(142 60% 75% / 0.6), transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-[60vw] h-[55vh] rounded-full blur-[140px] opacity-55"
          style={{ background: "radial-gradient(circle, hsl(100 55% 80% / 0.5), transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45vw] h-[45vh] rounded-full blur-[100px] opacity-50"
          style={{ background: "radial-gradient(circle, hsl(38 80% 80% / 0.45), transparent 70%)" }} />
        <div className="absolute top-[15%] right-[20%] w-[30vw] h-[30vh] rounded-full blur-[100px] opacity-40"
          style={{ background: "radial-gradient(circle, hsl(200 60% 80% / 0.35), transparent 70%)" }} />
      </div>

      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(142 40% 40%) 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
        }}
      />

      {/* Floating crop particles — bigger, more visible */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute select-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: p.size,
            opacity: p.opacity,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.08))",
          }}
          animate={{
            y: [0, -60, 0, 40, 0],
            x: [0, 25, -20, 10, 0],
            rotate: [p.rotation, p.rotation + 180, p.rotation + 360],
            scale: [1, 1.12, 0.92, 1.05, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        >
          {p.emoji}
        </motion.div>
      ))}

      {/* Floating orbs — brighter and larger */}
      <motion.div
        className="absolute w-4 h-4 rounded-full"
        style={{ background: "hsl(142 60% 50%)", boxShadow: "0 0 30px hsl(142 60% 50% / 0.5)", top: "20%", left: "10%" }}
        animate={{ y: [0, -80, 0], opacity: [0.5, 0.8, 0.5], scale: [1, 1.5, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-3 h-3 rounded-full"
        style={{ background: "hsl(100 60% 50%)", boxShadow: "0 0 25px hsl(100 60% 50% / 0.5)", top: "60%", right: "15%" }}
        animate={{ y: [0, -60, 0], opacity: [0.4, 0.7, 0.4], scale: [1, 1.4, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: -3 }}
      />
      <motion.div
        className="absolute w-3.5 h-3.5 rounded-full"
        style={{ background: "hsl(38 80% 55%)", boxShadow: "0 0 25px hsl(38 80% 55% / 0.5)", bottom: "30%", left: "70%" }}
        animate={{ y: [0, -90, 0], opacity: [0.4, 0.7, 0.4], scale: [1, 1.4, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: -6 }}
      />
      <motion.div
        className="absolute w-2.5 h-2.5 rounded-full"
        style={{ background: "hsl(280 50% 60%)", boxShadow: "0 0 20px hsl(280 50% 60% / 0.4)", top: "40%", left: "30%" }}
        animate={{ y: [0, -70, 0], opacity: [0.35, 0.65, 0.35], scale: [1, 1.3, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: -4 }}
      />
      <motion.div
        className="absolute w-3 h-3 rounded-full"
        style={{ background: "hsl(200 60% 55%)", boxShadow: "0 0 22px hsl(200 60% 55% / 0.4)", bottom: "20%", right: "30%" }}
        animate={{ y: [0, -50, 0], opacity: [0.3, 0.6, 0.3], scale: [1, 1.35, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: -7 }}
      />
    </div>
  );
}
