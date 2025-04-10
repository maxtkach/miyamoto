"use client";

import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface SakuraPetal {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  delay: number;
  xMove: number;
  ySpeed: number;
}

export default function SakuraBackground() {
  const [petals, setPetals] = useState<SakuraPetal[]>([]);
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  
  useEffect(() => {
    // Set initial window size
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
    
    // Handle window resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    // Generate initial petals
    const initialPetals: SakuraPetal[] = [];
    const petalCount = Math.min(20, Math.max(10, Math.floor(windowSize.width / 70)));
    
    for (let i = 0; i < petalCount; i++) {
      initialPetals.push({
        id: i,
        x: Math.random() * windowSize.width,
        y: Math.random() * windowSize.height * -1, // Start above the viewport
        size: Math.random() * 20 + 15,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
        delay: Math.random() * 15,
        xMove: (Math.random() - 0.5) * 3,
        ySpeed: Math.random() * 2 + 0.5
      });
    }
    
    setPetals(initialPetals);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Animation loop for petals
  useEffect(() => {
    const intervalId = setInterval(() => {
      setPetals(prevPetals => {
        return prevPetals.map(petal => {
          let newY = petal.y + petal.ySpeed;
          let newX = petal.x + petal.xMove;
          let newRotation = petal.rotation + petal.rotationSpeed;
          
          // Reset petal if it's gone off screen
          if (newY > windowSize.height) {
            newY = -petal.size;
            newX = Math.random() * windowSize.width;
          }
          
          // Wrap horizontally
          if (newX < -petal.size) newX = windowSize.width;
          if (newX > windowSize.width + petal.size) newX = -petal.size;
          
          return {
            ...petal,
            y: newY,
            x: newX,
            rotation: newRotation
          };
        });
      });
    }, 50);
    
    return () => clearInterval(intervalId);
  }, [windowSize]);
  
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
      {/* Japanese paper texture background */}
      <div className="absolute inset-0 opacity-30 dark:opacity-10" 
           style={{ 
             backgroundImage: 'var(--paper-texture-light)',
             backgroundSize: 'var(--paper-texture-size)',
             backgroundRepeat: 'repeat',
           }}
      ></div>
      
      {/* Overlay pattern */}
      <div className="absolute inset-0" 
           style={{ 
             backgroundImage: 'var(--background-pattern)',
             backgroundSize: 'var(--background-pattern-size)',
             backgroundPosition: 'var(--background-pattern-position)',
             opacity: 0.2
           }}
      ></div>
      
      {/* Subtle kanji background pattern */}
      <div className="absolute inset-0 opacity-5"
           style={{
             backgroundImage: 'var(--kanji-bg)',
             backgroundSize: '800px',
             backgroundRepeat: 'repeat',
             animation: 'moveBackground 120s linear infinite',
             transform: 'scale(0.6)'
           }}
      ></div>
      
      {/* Sakura petals SVG layer */}
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${windowSize.width} ${windowSize.height}`}
        preserveAspectRatio="none"
        className="absolute inset-0"
      >
        {petals.map(petal => (
          <motion.g
            key={petal.id}
            initial={{ x: petal.x, y: petal.y, rotate: petal.rotation }}
            animate={{ x: petal.x, y: petal.y, rotate: petal.rotation }}
            transition={{ duration: 0.05, ease: "linear" }}
          >
            <path
              d="M10,0 C5,3 0,8 0,10 C0,12 5,17 10,20 C15,17 20,12 20,10 C20,8 15,3 10,0"
              fill="#f8d7da"
              transform={`scale(${petal.size / 20})`}
              opacity={0.6 + Math.random() * 0.4}
            />
          </motion.g>
        ))}
      </svg>

      {/* Add custom keyframe for background movement */}
      <style jsx global>{`
        @keyframes moveBackground {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 800px 800px;
          }
        }
      `}</style>
    </div>
  );
} 