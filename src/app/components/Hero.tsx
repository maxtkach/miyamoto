"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame } from 'framer-motion';

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isInteractive, setIsInteractive] = useState(true);
  const [lastMoveTime, setLastMoveTime] = useState(Date.now());
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
  }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioVisualizerRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Параллакс-эффекты для разных элементов
  const titleY = useTransform(scrollY, [0, 500], [0, 100]);
  const titleSpring = useSpring(titleY, { damping: 30, stiffness: 100 });
  const symbolScale = useTransform(scrollY, [0, 300], [1, 1.4]);
  const symbolOpacity = useTransform(scrollY, [0, 300], [0.7, 0.2]);
  const bgY = useTransform(scrollY, [0, 500], [0, 150]);
  
  // Значения для анимации подсветки курсора
  const cursorSize = useMotionValue(30);
  const cursorOpacity = useMotionValue(0);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  // Инициализация аудио-контекста и анализатора для визуализации
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Генерация частиц только на клиенте
      const newParticles = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 4,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5
      }));
      setParticles(newParticles);
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 64;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      
      // Имитация звука для визуализации
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioContextRef.current.currentTime);
      gainNode.gain.setValueAtTime(0.01, audioContextRef.current.currentTime); // Тихий звук, почти не слышен
      oscillator.connect(gainNode);
      gainNode.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      oscillator.start();
      
      // Запускаем визуализацию аудио
      drawAudioVisualizer();
      
      setTimeout(() => {
        setIsLoaded(true);
      }, 300);
      
      // Сброс ресурсов при размонтировании
      return () => {
        oscillator.stop();
        audioContextRef.current?.close();
      };
    }
  }, []);
  
  // Обработчик движения мыши
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isInteractive) return;
      
      const { clientX, clientY } = e;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Ограничиваем частоту обновления для повышения производительности
      if (Date.now() - lastMoveTime < 50) return;
      setLastMoveTime(Date.now());
      
      // Более умеренные значения смещения
      const moveX = (clientX - windowWidth / 2) / windowWidth * 15;
      const moveY = (clientY - windowHeight / 2) / windowHeight * 10;
      
      setMousePosition({
        x: moveX,
        y: moveY
      });
    };
    
    const handleMouseLeave = () => {
      cursorOpacity.set(0);
    };
    
    const handleMouseEnter = () => {
      cursorOpacity.set(0.12);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mouseleave', handleMouseLeave);
      container.addEventListener('mouseenter', handleMouseEnter);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (container) {
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('mouseenter', handleMouseEnter);
      }
    };
  }, []);
  
  // Отрисовка аудио-визуализатора
  const drawAudioVisualizer = () => {
    if (!audioVisualizerRef.current || !analyserRef.current || !dataArrayRef.current) return;
    
    const canvas = audioVisualizerRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Устанавливаем размер канваса равным размеру элемента
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.5;
    
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Создаем градиентный круг
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 2);
    gradient.addColorStop(0, 'rgba(166, 5, 26, 0.3)');
    gradient.addColorStop(0.5, 'rgba(166, 5, 26, 0.1)');
    gradient.addColorStop(1, 'rgba(166, 5, 26, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + (dataArrayRef.current[0] / 128) * 30, 0, Math.PI * 2);
    ctx.fill();
    
    // Отрисовываем волны от центра
    const barWidth = (2 * Math.PI) / dataArrayRef.current.length;
    
    for (let i = 0; i < dataArrayRef.current.length; i++) {
      const barHeight = (dataArrayRef.current[i] / 255) * radius * 0.8;
      const angle = i * barWidth;
      
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius + barHeight);
      
      ctx.strokeStyle = `rgba(203, 41, 62, ${0.4 + barHeight / (radius * 0.8) * 0.6})`;
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    
    requestAnimationFrame(drawAudioVisualizer);
  };
  
  return (
    <motion.section 
      id="home" 
      className="jp-section relative overflow-hidden bg-transparent min-h-screen flex items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 1 }}
      ref={containerRef}
    >
      {/* Следящий за курсором элемент */}
      <motion.div 
        ref={cursorRef}
        className="fixed pointer-events-none z-10 rounded-full bg-accent-custom mix-blend-overlay"
        style={{
          width: cursorSize,
          height: cursorSize,
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: cursorOpacity
        }}
      />
      
      {/* Анимированный фон с сеткой */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-10"
          style={{ y: bgY }}
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gray-800 dark:bg-gray-200"></div>
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-800 dark:bg-gray-200"></div>
          <div className="absolute top-0 left-0 h-full w-[1px] bg-gray-800 dark:bg-gray-200"></div>
          <div className="absolute top-0 right-0 h-full w-[1px] bg-gray-800 dark:bg-gray-200"></div>
        </motion.div>
        
        {/* Сетка заднего плана */}
        <div className="absolute inset-0 grid grid-cols-6 opacity-5">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="border border-accent-custom border-opacity-20"></div>
          ))}
        </div>
        
        {/* Случайные частицы */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-accent-custom"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
                opacity: 0.3,
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 0.4, 0],
                scale: [1, 1.5, 0.8]
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Большой японский символ с эффектом параллакса */}
      <motion.div 
        className="absolute right-0 top-0 jp-heading text-[30vw] leading-none text-accent-custom pointer-events-none select-none"
        style={{ 
          scale: symbolScale,
          opacity: symbolOpacity,
          x: 100,
          textShadow: "0 0 20px var(--accent)"
        }}
      >
        音
      </motion.div>
      
      {/* Аудио-визуализатор */}
      <canvas 
        ref={audioVisualizerRef} 
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      
      {/* Основной контент */}
      <div className="container-custom relative z-10">
        <div className="max-w-3xl">
          <div className="flex flex-col space-y-4">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white"
              style={{ y: titleSpring }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1] 
              }}
            >
              <span className="jp-heading inline-block relative">
                <span className="relative z-10">宮本</span>
                <motion.span 
                  className="absolute -bottom-2 left-0 h-3 bg-accent-custom"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  style={{ opacity: 0.3 }}
                ></motion.span>
              </span>{" "}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                MIYAMOTO
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="jp-heading text-xl md:text-2xl text-accent-custom"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              SOUNDWORKS
            </motion.p>
            
            <motion.h2 
              className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mt-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.3 }}
            >
              Based in Berlin, Germany
            </motion.h2>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mt-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
            >
              Creating unique sound solutions.
            </motion.p>
            
            <motion.div 
              className="pt-8 flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.7 }}
            >
              <motion.a 
                href="#sound" 
                className="jp-button inline-flex items-center relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">LISTEN</span>
                <motion.div 
                  className="absolute inset-0 bg-accent-custom"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 relative z-10" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </motion.a>
              
              <motion.a 
                href="#contact" 
                className="jp-button inline-flex items-center relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">CONTACT</span>
                <motion.div 
                  className="absolute inset-0 bg-accent-custom"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 relative z-10" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </motion.a>
            </motion.div>
          </div>
        </div>
        
        {/* Декоративные японские иероглифы с анимацией */}
        <div className="absolute bottom-10 right-10 flex space-x-10 opacity-20">
          {['音', '楽', '創', '造'].map((kanji, i) => (
            <motion.div
              key={kanji}
              className="jp-heading text-2xl text-accent-custom"
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 3,
                delay: i * 0.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              {kanji}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Скролл-индикатор */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-accent-custom rounded-full flex justify-center"
          animate={{ 
            boxShadow: ["0 0 0 rgba(166, 5, 26, 0)", "0 0 10px rgba(166, 5, 26, 0.5)", "0 0 0 rgba(166, 5, 26, 0)"]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div 
            className="w-1 h-3 bg-accent-custom rounded-full mt-2"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        <motion.p 
          className="text-center text-xs mt-2 text-gray-600 dark:text-gray-400"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          SCROLL
        </motion.p>
      </motion.div>
    </motion.section>
  );
} 