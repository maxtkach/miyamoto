"use client";

import React from 'react';
import { FaPlay } from 'react-icons/fa';

interface Beat {
  id: number;
  title: string;
  artist: string;
  duration: string;
  category: string;
  url: string;
  coverImage: string;
  key: string;
  bpm: number;
}

/**
 * Оптимизированная версия плеера битов. 
 * Этот компонент будет реализован позднее.
 * В настоящее время отображается статическая заглушка.
 */
export default function OptimizedBeatPlayer() {
  return (
    <div className="relative rounded-lg border-2 border-accent-custom p-6 color-gray-50">
      <div className="text-center p-8">
        <h3 className="jp-heading text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          <span className="text-accent-custom">準備中</span> PLAYER COMING SOON
        </h3>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
          We are working on an optimized audio player that will be available soon.
          Stay tuned for an enhanced listening experience!
        </p>
        
        <div className="flex justify-center space-x-2 mt-8">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="w-2 h-2 rounded-full bg-accent-custom"
              style={{
                opacity: 0.6,
                animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite`
              }}
            ></div>
          ))}
        </div>
        
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.5); opacity: 1; }
          }
        `}</style>
      </div>
      
      <div className="mt-6 flex items-center justify-center">
        <button
          className="jp-button flex items-center opacity-50 cursor-not-allowed"
          disabled
        >
          <FaPlay className="mr-2" size={12} />
          <span>Player Coming Soon</span>
        </button>
      </div>
    </div>
  );
} 