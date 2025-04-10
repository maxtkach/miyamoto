"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Hide splash screen after animation completes
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-background color-gray-50"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: {
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1]
            }
          }}
        >
          <div className="splash-content flex flex-col items-center">
            {/* Stamp-like animation for logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                transition: { 
                  duration: 0.7,
                  ease: [0.25, 1, 0.5, 1] 
                }
              }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="relative mb-6"
            >
              {/* Red circle background (mimicking Japanese stamps) */}
              <motion.div 
                className="absolute inset-0 bg-accent-custom rounded-full"
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1,
                  transition: { 
                    duration: 0.5, 
                    delay: 0.2,
                    ease: "backOut" 
                  }
                }}
              />
              
              {/* Logo symbol */}
              <div className="relative p-10">
                <motion.div 
                  className="text-5xl jp-heading text-white"
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ 
                    opacity: 1, 
                    rotateY: 0,
                    transition: { 
                      duration: 0.5, 
                      delay: 0.5 
                    }
                  }}
                >
                  宮本
                </motion.div>
              </div>
            </motion.div>
            
            {/* Text animation */}
            <motion.div 
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  duration: 0.7, 
                  delay: 0.8 
                }
              }}
            >
              <div className="text-3xl font-bold tracking-widest text-gray-900 dark:text-white">
                MIYAMOTO
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                SOUNDWORKS
              </div>
            </motion.div>
            
            {/* Ink splash decoration */}
            <motion.div 
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 0.04,
                transition: { 
                  duration: 1, 
                  delay: 0.5 
                }
              }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <svg 
                  width="600" 
                  height="600" 
                  viewBox="0 0 600 600" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <path 
                    d="M300,575 C147.5,575 25,452.5 25,300 C25,147.5 147.5,25 300,25 C452.5,25 575,147.5 575,300 C575,452.5 452.5,575 300,575 Z" 
                    fill="currentColor"
                    className="text-black dark:text-white"
                  />
                </svg>
              </div>
            </motion.div>
            
            {/* Loading indicator */}
            <motion.div 
              className="absolute bottom-10 flex space-x-2"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { delay: 1.2 }
              }}
            >
              {[0, 1, 2].map((dot) => (
                <motion.div
                  key={dot}
                  className="w-2 h-2 bg-accent-custom rounded-full"
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: dot * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 