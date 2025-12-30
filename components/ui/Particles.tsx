import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const random = (min: number, max: number) => Math.random() * (max - min) + min;

interface Firefly {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export const Particles: React.FC = () => {
  const [fireflies, setFireflies] = useState<Firefly[]>([]);

  useEffect(() => {
    // Generate fireflies
    const newFireflies = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: random(0, 100),
      y: random(20, 100), // Mostly lower half
      size: random(2, 4),
      duration: random(15, 30), // Slower movement
      delay: random(0, 10),
    }));
    setFireflies(newFireflies);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
      {fireflies.map((f) => (
        <motion.div
          key={f.id}
          className="absolute rounded-full bg-yellow-200/60 blur-[1px]"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: f.size,
            height: f.size,
            boxShadow: `0 0 ${f.size * 2}px ${f.size}px rgba(253, 224, 71, 0.2)`
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, random(-15, 15), 0],
            opacity: [0, 0.8, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: f.duration,
            repeat: Infinity,
            delay: f.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};