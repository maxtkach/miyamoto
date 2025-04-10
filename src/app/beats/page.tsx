"use client";

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import { FaUpload, FaHeadphones, FaPlay, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Временные данные для битов
const beats = [
  {
    id: 1,
    title: "Tokyo Nights",
    artist: "Miyamoto",
    duration: "2:35",
    category: "Lo-Fi",
    coverImage: "/miyamoto/images/cover-1.jpg",
    key: "Am",
    bpm: 85
  },
  {
    id: 2,
    title: "Cherry Blossom",
    artist: "Miyamoto",
    duration: "3:12",
    category: "Ambient",
    coverImage: "/miyamoto/images/cover-2.jpg",
    key: "F",
    bpm: 72
  },
  {
    id: 3,
    title: "Kyoto Dreams",
    artist: "Miyamoto",
    duration: "2:48",
    category: "Chill",
    coverImage: "/miyamoto/images/cover-3.jpg",
    key: "Dm",
    bpm: 90
  },
  {
    id: 4,
    title: "Mount Fuji",
    artist: "Miyamoto",
    duration: "3:05",
    category: "Instrumental",
    coverImage: "/miyamoto/images/cover-4.jpg",
    key: "G",
    bpm: 78
  },
  {
    id: 5,
    title: "Zen Garden",
    artist: "Miyamoto",
    duration: "2:55",
    category: "Meditation",
    coverImage: "/miyamoto/images/cover-5.jpg",
    key: "C",
    bpm: 68
  },
  {
    id: 6,
    title: "Samurai",
    artist: "Miyamoto",
    duration: "3:22",
    category: "Trap",
    coverImage: "/miyamoto/images/cover-6.jpg",
    key: "Em",
    bpm: 140
  }
];

export default function BeatsPage() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow color-gray-50 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 color-gray-50 opacity-80 z-0"></div>
        
        {/* Static Japanese characters in background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5 z-0">
          <div 
            className="absolute top-10 left-10 jp-heading text-[200px] text-gray-400"
            style={{ opacity: 0.3 }}
          >
            音
          </div>
          <div 
            className="absolute bottom-10 right-10 jp-heading text-[150px] text-gray-400"
            style={{ opacity: 0.2 }}
          >
            楽
          </div>
        </div>
        
        {/* Main content */}
        <section className="py-20 relative z-10">
          <div className="container-custom">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center justify-center mb-4">
                <FaHeadphones className="text-accent-custom mr-3" size={32} />
                <h1 className="jp-heading text-4xl md:text-6xl font-bold text-gray-800 dark:text-white">
                  <span className="text-accent-custom">ビート</span> BEATS
                </h1>
              </div>
              
              <div className="w-24 h-1 bg-accent-custom mx-auto my-6 rounded-full"></div>
              
              <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Explore our collection of exclusive beats with Japanese influence and modern sound
              </p>
            </motion.div>
            
            {/* Beats placeholder */}
            <div className="border-2 border-accent-custom rounded-lg p-6 bg-opacity-50 color-gray-50 shadow-lg relative">
              {/* Coming soon message */}
              <div className="text-center mb-10 p-8">
                <h3 className="jp-heading text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                  <span className="text-accent-custom">準備中</span> PLAYER COMING SOON
                </h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
                  Our interactive beat player is being upgraded with enhanced features for a better experience. Please check back soon!
                </p>
                
                <div className="w-16 h-1 bg-accent-custom bg-opacity-50 mx-auto my-8 rounded-full"></div>
                
                <div className="flex justify-center space-x-2 mt-4">
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
              
              {/* Static beats list */}
              <div className="mt-8">
                <h3 className="jp-heading text-xl font-bold mb-4 text-gray-800 dark:text-white">
                  <span className="text-accent-custom">ビート</span> AVAILABLE BEATS
                </h3>
                
                <div className="mt-6 space-y-4">
                  {beats.map((beat) => (
                    <div 
                      key={beat.id}
                      className="jp-card group flex cursor-pointer transition-all duration-300 color-gray-50 relative overflow-hidden h-24"
                    >
                      {/* Background image */}
                      <div 
                        className="h-full w-24 flex-shrink-0 bg-center bg-cover"
                        style={{ backgroundImage: `url(${beat.coverImage})` }}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-3 flex-grow flex flex-col justify-between">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="text-md font-bold tracking-wide text-gray-800 dark:text-white">
                              {beat.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{beat.artist}</p>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <div className="bg-accent-custom bg-opacity-80 px-2 py-1 text-xs font-medium rounded-sm shadow-sm text-white">
                              {beat.category}
                            </div>
                            <button className="text-gray-800 dark:text-white">
                              <FaHeart size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <div className="bg-accent-custom bg-opacity-20 text-gray-800 dark:text-white text-xs p-1 rounded-sm">
                              {beat.key}
                            </div>
                            <div className="bg-accent-custom bg-opacity-20 text-gray-800 dark:text-white text-xs p-1 rounded-sm">
                              {beat.bpm} BPM
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 ml-2">{beat.duration}</p>
                          </div>
                          
                          <div className="bg-accent-custom text-white rounded-full p-2 transform transition-all opacity-50 cursor-not-allowed">
                            <FaPlay size={12} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Coming soon decorative elements */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-5 right-5 w-16 h-16 border-t border-r border-accent-custom opacity-30"></div>
                <div className="absolute bottom-5 left-5 w-16 h-16 border-b border-l border-accent-custom opacity-30"></div>
              </div>
            </div>
            
            {/* Admin link */}
            <div className="flex justify-end mt-8">
              <Link 
                href="/beats/upload" 
                className="text-xs text-gray-500 hover:text-accent-custom transition-colors flex items-center opacity-60 hover:opacity-100 group"
              >
                <FaUpload size={12} className="mr-1 transform group-hover:translate-y-[-2px] transition-transform" />
                <span>For Authors</span>
              </Link>
            </div>
            
            {/* Decorative divider */}
            <motion.div 
              className="jp-divider my-16 opacity-50"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: isVisible ? 0.5 : 0, width: isVisible ? '100%' : 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            ></motion.div>
            
            {/* Additional information */}
            <motion.div 
              className="text-center mt-8 text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <p className="max-w-2xl mx-auto">
                All beats are created by our team and available for licensing.
                For rights acquisition or custom requests, please
                contact us through the contact section.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
} 