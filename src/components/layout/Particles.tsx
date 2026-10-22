'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

export const Particles: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = [
      'rgba(255, 255, 255, 0.05)',
      'rgba(255, 255, 255, 0.03)',
      'rgba(200, 200, 200, 0.04)',
    ];

    const generateParticles = () => {
      if (typeof window === 'undefined') return;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const particleCount = Math.min(40, Math.floor((windowWidth * windowHeight) / 40000));

      const newParticles = Array.from({ length: particleCount }).map((_, i) => {
        const x = Math.random() * windowWidth;
        const y = Math.random() * windowHeight;
        return {
          id: i,
          x,
          y,
          targetX: x + (Math.random() * 50 - 25),
          targetY: y + (Math.random() * 50 - 25),
          size: Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)] || colors[0],
          duration: Math.random() * 80 + 40,
          delay: Math.random() * 10,
        };
      });

      setParticles(newParticles);
    };

    generateParticles();

    window.addEventListener('resize', generateParticles);
    return () => window.removeEventListener('resize', generateParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            x: particle.x,
            y: particle.y,
            filter: 'blur(1px)',
          }}
          animate={{
            x: [particle.x, particle.targetX],
            y: [particle.y, particle.targetY],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
};

export default Particles;
