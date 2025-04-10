"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaRandom, FaStepForward, FaStepBackward, FaInfo } from 'react-icons/fa';
import { motion, useScroll, useTransform, AnimatePresence, useDragControls } from 'framer-motion';

interface Track {
  id: number;
  title: string;
  artist: string;
  category: string;
  url: string;
  cover: string;
}

const tracks: Track[] = [
  {
    id: 1,
    title: "Serenity",
    artist: "Miyamoto Soundworks",
    category: "Lo-Fi",
    url: "/miyamoto/audio/track1.mp3",
    cover: "/miyamoto/images/cover-1.jpg"
  },
  {
    id: 2,
    title: "Tokyo Midnight",
    artist: "Miyamoto Soundworks",
    category: "Ambient",
    url: "/miyamoto/audio/track2.mp3",
    cover: "/miyamoto/images/cover-2.jpg"
  },
  {
    id: 3,
    title: "Sakura",
    artist: "Miyamoto Soundworks",
    category: "Electronic",
    url: "/miyamoto/audio/track3.mp3",
    cover: "/miyamoto/images/cover-3.jpg"
  },
  {
    id: 4,
    title: "Kyoto",
    artist: "Miyamoto Soundworks",
    category: "Traditional",
    url: "/miyamoto/audio/track4.mp3",
    cover: "/miyamoto/images/cover-4.jpg"
  },
  {
    id: 5,
    title: "Zen Garden",
    artist: "Miyamoto Soundworks",
    category: "Meditation",
    url: "/miyamoto/audio/track5.mp3",
    cover: "/miyamoto/images/cover-5.jpg"
  },
  {
    id: 6,
    title: "Fuji Dawn",
    artist: "Miyamoto Soundworks",
    category: "Nature",
    url: "/miyamoto/audio/track6.mp3",
    cover: "/miyamoto/images/cover-6.jpg"
  }
];

export default function SoundSection() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isVolumeVisible, setIsVolumeVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isVolumeControlVisible, setIsVolumeControlVisible] = useState(false);
  const [visualizerData, setVisualizerData] = useState<number[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [visualizerMode, setVisualizerMode] = useState<'bars' | 'circle' | 'wave'>('bars');
  const [visualizerColor, setVisualizerColor] = useState<string>('accent');
  const [isRandom, setIsRandom] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visualizerCanvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Скролл-эффекты
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const opacitySection = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5]);
  const scalePlayer = useTransform(scrollYProgress, [0.1, 0.3], [0.95, 1]);
  const rotatePlayer = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], ['-1deg', '0deg', '0deg', '2deg']);
  const yPlayer = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -20]);

  // Инициализация аудио-контекста после монтирования
  useEffect(() => {
    setIsVisible(true);
    
    // Создаем аудио-контекст и анализатор
    const initAudioContext = () => {
      if (typeof window !== 'undefined' && !audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 64;
        
        if (audioRef.current && analyserRef.current) {
          // Подключаем аудио-элемент к анализатору
          sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
          sourceRef.current.connect(analyserRef.current);
          analyserRef.current.connect(audioContextRef.current.destination);
        }
      }
    };
    
    // Вызываем инициализацию позже, чтобы избежать ошибок SSR
    const timer = setTimeout(() => {
      if (audioRef.current) {
        initAudioContext();
      }
    }, 100);
    
    return () => {
      clearTimeout(timer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Визуализация аудио
  useEffect(() => {
    if (!analyserRef.current || !isPlaying || !visualizerCanvasRef.current) return;
    
    const canvas = visualizerCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Устанавливаем размер канваса равным размеру элемента
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    let hue = 0;
    
    const updateVisualizer = () => {
      if (!analyserRef.current || !isPlaying || !ctx) return;
      
      // Очищаем холст
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Преобразуем Uint8Array в обычный массив для использования в других компонентах
      const normalizedData = Array.from(dataArray).map(value => value / 255);
      setVisualizerData(normalizedData);
      
      // Разные типы визуализации
      switch (visualizerMode) {
        case 'bars':
          renderBars(ctx, dataArray, bufferLength, canvas);
          break;
        case 'circle':
          renderCircle(ctx, dataArray, bufferLength, canvas);
          break;
        case 'wave':
          renderWave(ctx, dataArray, bufferLength, canvas);
          break;
      }
      
      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    };
    
    // Функция для отрисовки спектра в виде столбцов
    const renderBars = (
      ctx: CanvasRenderingContext2D, 
      dataArray: Uint8Array, 
      bufferLength: number, 
      canvas: HTMLCanvasElement
    ) => {
      const barWidth = canvas.width / (bufferLength / 2);
      let x = 0;
      
      hue = (hue + 0.5) % 360;
      
      for (let i = 0; i < bufferLength / 2; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        
        // Градиент для каждого бара
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        
        if (visualizerColor === 'accent') {
          gradient.addColorStop(0, 'rgba(166, 5, 26, 0.8)');
          gradient.addColorStop(1, 'rgba(166, 5, 26, 0.2)');
        } else if (visualizerColor === 'rainbow') {
          const barHue = (hue + i * 5) % 360;
          gradient.addColorStop(0, `hsla(${barHue}, 100%, 50%, 0.8)`);
          gradient.addColorStop(1, `hsla(${barHue}, 100%, 50%, 0.2)`);
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        
        x += barWidth;
      }
    };
    
    // Функция для отрисовки круговой визуализации
    const renderCircle = (
      ctx: CanvasRenderingContext2D, 
      dataArray: Uint8Array, 
      bufferLength: number, 
      canvas: HTMLCanvasElement
    ) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) * 0.5;
      
      hue = (hue + 0.5) % 360;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      if (visualizerColor === 'accent') {
        ctx.strokeStyle = 'rgba(166, 5, 26, 0.2)';
      } else {
        ctx.strokeStyle = `hsla(${hue}, 100%, 50%, 0.2)`;
      }
      ctx.lineWidth = 2;
      ctx.stroke();
      
      const angleStep = (2 * Math.PI) / (bufferLength / 4);
      
      for (let i = 0; i < bufferLength / 4; i++) {
        const amplitude = dataArray[i] / 255;
        const adjustedRadius = radius + amplitude * radius * 0.8;
        const angle = angleStep * i;
        
        const x = centerX + Math.cos(angle) * adjustedRadius;
        const y = centerY + Math.sin(angle) * adjustedRadius;
        
        ctx.beginPath();
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        if (visualizerColor === 'accent') {
          ctx.strokeStyle = `rgba(166, 5, 26, ${0.3 + amplitude * 0.7})`;
        } else {
          const pointHue = (hue + i * 5) % 360;
          ctx.strokeStyle = `hsla(${pointHue}, 100%, 50%, ${0.3 + amplitude * 0.7})`;
        }
        
        // Добавление точек на кривой
        ctx.beginPath();
        ctx.arc(x, y, 2 + amplitude * 3, 0, 2 * Math.PI);
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fill();
      }
    };
    
    // Функция для отрисовки волновой визуализации
    const renderWave = (
      ctx: CanvasRenderingContext2D, 
      dataArray: Uint8Array, 
      bufferLength: number, 
      canvas: HTMLCanvasElement
    ) => {
      analyserRef.current!.getByteTimeDomainData(dataArray);
      
      const sliceWidth = canvas.width / bufferLength;
      let x = 0;
      
      ctx.beginPath();
      ctx.lineWidth = 2;
      hue = (hue + 0.5) % 360;
      
      if (visualizerColor === 'accent') {
        ctx.strokeStyle = 'rgba(166, 5, 26, 0.8)';
    } else {
        ctx.strokeStyle = `hsla(${hue}, 100%, 50%, 0.8)`;
      }
      
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        x += sliceWidth;
      }
      
      ctx.stroke();
    };
    
    updateVisualizer();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, visualizerMode, visualizerColor]);

  // Обработчик события "timeupdate" аудио элемента
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      const percentage = (audioRef.current.currentTime / duration) * 100;
      setProgress(percentage || 0);
    }
  };

  // Обработчик загрузки метаданных аудио
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Эффект для управления воспроизведением
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        // Возобновляем аудио-контекст при необходимости
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }
        
        audioRef.current.play().catch(error => {
          console.error("Ошибка воспроизведения:", error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  // Эффект для управления громкостью
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Функция для управления воспроизведением трека
  const handlePlayTrack = (track: Track) => {
    // Если текущий трек уже выбран, просто переключаем воспроизведение
    if (currentTrack && currentTrack.id === track.id) {
      setIsPlaying(!isPlaying);
      return;
    }
    
    // Если выбран новый трек
    setCurrentTrack(track);
    setProgress(0);
    setCurrentTime(0);
    
    // Включаем воспроизведение после установки нового трека
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Функция для управления громкостью
  const handleVolumeClick = () => {
    setIsVolumeControlVisible(!isVolumeControlVisible);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Останавливаем всплытие события
    setIsMuted(!isMuted);
  };

  // Скрываем контрол громкости при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const volumeControl = document.getElementById('volume-control');
      const volumeButton = document.getElementById('volume-button');
      
      if (
        volumeControl && 
        !volumeControl.contains(target) && 
        volumeButton && 
        !volumeButton.contains(target)
      ) {
        setIsVolumeControlVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && duration > 0) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      
      // Устанавливаем новую позицию
      const newTime = pos * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(pos * 100);
    }
  };

  // Форматирование времени в мм:сс
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Генерируем частицы для фона
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 2,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5
  }));

  // Переключение режима визуализации
  const cycleVisualizerMode = () => {
    setVisualizerMode(prev => {
      if (prev === 'bars') return 'circle';
      if (prev === 'circle') return 'wave';
      return 'bars';
    });
  };
  
  // Переключение цвета визуализации
  const toggleVisualizerColor = () => {
    setVisualizerColor(prev => prev === 'accent' ? 'rainbow' : 'accent');
  };

  // Управление навигацией между треками
  const playNextTrack = () => {
    if (!currentTrack) return;
    
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    let nextIndex;
    
    if (isRandom) {
      // Случайный трек, отличный от текущего
      do {
        nextIndex = Math.floor(Math.random() * tracks.length);
      } while (nextIndex === currentIndex && tracks.length > 1);
    } else {
      // Следующий трек по порядку или возврат к первому
      nextIndex = (currentIndex + 1) % tracks.length;
    }
    
    handlePlayTrack(tracks[nextIndex]);
  };
  
  const playPrevTrack = () => {
    if (!currentTrack) return;
    
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    let prevIndex;
    
    if (isRandom) {
      // Случайный трек, отличный от текущего
      do {
        prevIndex = Math.floor(Math.random() * tracks.length);
      } while (prevIndex === currentIndex && tracks.length > 1);
    } else {
      // Предыдущий трек по порядку или переход к последнему
      prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    }
    
    handlePlayTrack(tracks[prevIndex]);
  };
  
  // Автопереход к следующему треку по окончании текущего
  useEffect(() => {
  const handleTrackEnd = () => {
      playNextTrack();
    };
    
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener('ended', handleTrackEnd);
      
      return () => {
        audioElement.removeEventListener('ended', handleTrackEnd);
      };
    }
  }, [currentTrack, isRandom]);
  
  // Управление перетаскиванием для прогресса
  const dragControls = useDragControls();
  
  // Горячие клавиши для управления плеером
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Проверяем, что фокус не на инпуте или текстовом поле
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      
      switch (e.key) {
        case ' ': // Пробел для паузы/воспроизведения
          e.preventDefault();
          if (currentTrack) togglePlay();
          break;
        case 'ArrowRight': // Стрелка вправо для перемотки вперед
          e.preventDefault();
          if (audioRef.current && currentTrack) {
            audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 5, duration);
          }
          break;
        case 'ArrowLeft': // Стрелка влево для перемотки назад
          e.preventDefault();
          if (audioRef.current && currentTrack) {
            audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 5, 0);
          }
          break;
        case 'ArrowUp': // Стрелка вверх для увеличения громкости
          e.preventDefault();
          setVolume(prev => Math.min(prev + 0.1, 1));
          if (isMuted) setIsMuted(false);
          break;
        case 'ArrowDown': // Стрелка вниз для уменьшения громкости
          e.preventDefault();
          setVolume(prev => Math.max(prev - 0.1, 0));
          break;
        case 'n': // 'n' для следующего трека
          playNextTrack();
          break;
        case 'p': // 'p' для предыдущего трека
          playPrevTrack();
          break;
        case 'm': // 'm' для отключения звука
          setIsMuted(prev => !prev);
          break;
        case 'r': // 'r' для включения/выключения случайного порядка
          setIsRandom(prev => !prev);
          break;
        case 'v': // 'v' для циклического переключения режима визуализации
          cycleVisualizerMode();
          break;
        case 'c': // 'c' для переключения цвета визуализации
          toggleVisualizerColor();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    // Показываем подсказку по управлению
    const tipTimer = setTimeout(() => {
      setShowTip(true);
      
      // Скрываем подсказку через некоторое время
      const hideTipTimer = setTimeout(() => {
        setShowTip(false);
      }, 5000);
      
      return () => clearTimeout(hideTipTimer);
    }, 3000);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      clearTimeout(tipTimer);
    };
  }, [currentTrack, duration, isPlaying, isMuted, volume, isRandom]);

  return (
    <motion.section 
      id="sound" 
      className="color-gray-50 relative overflow-hidden py-16"
      ref={sectionRef}
      style={{ opacity: opacitySection }}
    >
      {/* Анимированные частицы в фоне - уменьшаем количество */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.slice(0, 5).map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-accent-custom"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              opacity: 0.15,
            }}
            animate={{
              y: [0, -50], // уменьшаем дистанцию движения
              opacity: [0, 0.2, 0],
              scale: [1, 1.1] // упрощаем анимацию масштаба
            }}
            transition={{
              duration: particle.duration * 1.5, // замедляем для снижения нагрузки
              repeat: Infinity,
              delay: particle.delay,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      {/* Декоративные японские иероглифы в фоне - упрощаем анимацию */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none dark:opacity-5 opacity-10">
        <div 
          className="absolute top-10 left-10 jp-heading text-[200px] text-gray-800 dark:text-gray-400"
          style={{
            opacity: 0.3,
            // убираем анимацию, оставляем статическим
          }}
        >
          音
        </div>
        <div 
          className="absolute bottom-10 right-10 jp-heading text-[150px] text-gray-800 dark:text-gray-400"
          style={{
            opacity: 0.2,
            // убираем анимацию, оставляем статическим
          }}
        >
          楽
        </div>
      </div>
      
      {/* Стилизованная окружность/диск в фоне - упрощаем */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(166, 5, 26, 0.1) 0%, rgba(166, 5, 26, 0.05) 30%, rgba(166, 5, 26, 0) 70%)',
          opacity: isPlaying ? 0.6 : 0.3,
          // убираем анимацию вращения и пульсации
        }}
      />

      <div className="container-custom relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="jp-heading text-4xl md:text-5xl font-bold text-white">
            <span className="text-accent-custom">音</span> OUR SOUND
          </h2>
          <p className="mt-4 text-xl text-gray-300">
            Listen to examples of our work and feel the Japanese aesthetics in sound
          </p>
        </motion.div>

        <motion.div 
          className="border-2 border-accent-custom relative color-gray-50 shadow-2xl rounded-lg"
          style={{ 
            scale: scalePlayer,
            rotateX: rotatePlayer,
            y: yPlayer,
            perspective: "1000px",
            transformStyle: "preserve-3d"
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ scale: 1.005 }} // оставляем простой эффект при наведении
        >
          {/* Эффект тени от плеера - упрощаем */}
          <div 
            className="absolute inset-0 blur-xl bg-accent-custom rounded-lg -z-10"
            style={{ 
              opacity: isPlaying ? 0.15 : 0, 
              transform: 'translateY(10px) scale(0.95)'
              // убираем анимацию
            }}
          />
          
          <div className="absolute inset-0" 
               style={{ 
                 backgroundImage: 'var(--paper-texture-light)',
                 backgroundRepeat: 'repeat',
                 backgroundSize: 'var(--paper-texture-size)',
                 opacity: 'var(--paper-texture-opacity)',
                 pointerEvents: 'none',
                 mixBlendMode: 'overlay'
               }}></div>
               
          {/* Декоративный бордюр в японском стиле */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute top-3 right-3 w-20 h-20 border-t-2 border-r-2 border-accent-custom"></div>
            <div className="absolute bottom-3 left-3 w-20 h-20 border-b-2 border-l-2 border-accent-custom"></div>
          </div>
          
          <div className="p-6 relative z-10">
            {/* HTML5 аудио элемент (скрытый) */}
            <audio
              ref={audioRef}
              src={currentTrack?.url}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              preload="auto"
            />
            
            {/* Звуковая визуализация - сохраняем, но упрощаем */}
            {isPlaying && currentTrack && (
              <motion.div 
                className="mb-6 relative h-40 w-full"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 160 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                <canvas
                  ref={visualizerCanvasRef}
                  className="w-full h-full rounded-lg"
                />
                
                <div className="absolute top-2 right-2 flex space-x-2">
                  <motion.button 
                    onClick={cycleVisualizerMode}
                    className="color-gray-50 text-white p-2 rounded-md shadow-md text-xs border border-accent-custom"
                    whileTap={{ scale: 0.95 }}
                  >
                    {visualizerMode === 'bars' ? 'Style: Bars' : 
                     visualizerMode === 'circle' ? 'Style: Circle' : 'Style: Wave'}
                  </motion.button>
                  
                  <motion.button 
                    onClick={toggleVisualizerColor}
                    className="color-gray-50 text-white p-2 rounded-md shadow-md text-xs border border-accent-custom"
                    whileTap={{ scale: 0.95 }}
                  >
                    {visualizerColor === 'accent' ? 'Color: Japanese' : 'Color: Rainbow'}
                  </motion.button>
                </div>
              </motion.div>
            )}
            
            {/* Текущий плеер */}
            <AnimatePresence mode="wait">
              {currentTrack ? (
                <motion.div 
                  className="mb-8"
                  key={currentTrack.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center mb-6">
                    {/* Обложка трека с эффектами - упрощаем анимации */}
                    <div 
                      className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 overflow-hidden rounded-lg border border-accent-custom relative group"
                      style={{
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        zIndex: 1
                      }}
                    >
                      {/* Эффект винилового диска - упрощаем */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div 
                          className="absolute inset-0 rounded-full bg-black opacity-60"
                          style={{
                            width: '200%',
                            height: '200%',
                            top: '-50%',
                            left: '-50%',
                            backgroundImage: `
                              radial-gradient(circle, transparent 30%, rgba(0,0,0,0.5) 30%, transparent 35%, rgba(0,0,0,0.5) 35%, transparent 40%, rgba(0,0,0,0.5) 40%, transparent 45%, rgba(0,0,0,0.5) 45%, transparent 50%, rgba(0,0,0,0.5) 50%, transparent 55%, rgba(0,0,0,0.5) 55%)
                            `,
                            backgroundSize: '120% 120%',
                            backgroundPosition: 'center',
                            zIndex: 0,
                            opacity: isPlaying ? 0.3 : 0,
                            transition: 'opacity 0.6s ease'
                            // убираем вращение
                          }}
                        />
                        
                        {/* Красный индикатор воспроизведения - упрощаем */}
                        <div 
                          className="absolute top-3 right-3 w-3 h-3 rounded-full bg-accent-custom shadow-lg"
                          style={{
                            opacity: isPlaying ? 0.8 : 0,
                            transition: "opacity 0.3s ease"
                            // убираем пульсацию
                          }}
                        />
                      </div>
                      
                      <div className="relative z-10 w-32 h-32 md:w-40 md:h-40">
                        <img 
                          src={currentTrack.cover} 
                          alt={`${currentTrack.title} cover`} 
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Наложение при наведении */}
                        <div
                          className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <button
                            onClick={togglePlay}
                            className="bg-white text-accent-custom rounded-full p-3 shadow-lg transition-transform group-hover:scale-105">
                            {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Информация о треке */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start md:items-center flex-col md:flex-row mb-2">
                        <div>
                          <h3 
                            className="text-2xl font-bold text-gray-900 dark:text-white"
                          >
                            {currentTrack.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {currentTrack.artist} • <span className="text-accent-custom">{currentTrack.category}</span>
                          </p>
                        </div>
                        <div className="flex items-center mt-3 md:mt-0">
                          {/* Кнопки управления треками - упрощаем анимации */}
                          <div className="flex items-center mr-4">
                            <button
                              onClick={playPrevTrack}
                              className="text-gray-700 dark:text-gray-300 hover:text-accent-custom p-2 mx-1 transition-colors"
                              title="Previous track (p)"
                            >
                              <FaStepBackward size={16} />
                            </button>
                            
                            <button
                              onClick={() => setIsRandom(!isRandom)}
                              className={`p-2 mx-1 transition-colors ${isRandom ? 'text-accent-custom' : 'text-gray-700 dark:text-gray-300 hover:text-accent-custom'}`}
                              title="Random order (r)"
                            >
                              <FaRandom size={16} />
                            </button>
                            
                            <button
                              onClick={playNextTrack}
                              className="text-gray-700 dark:text-gray-300 hover:text-accent-custom p-2 mx-1 transition-colors"
                              title="Next track (n)"
                            >
                              <FaStepForward size={16} />
                            </button>
                          </div>
                          
                          <div className="relative mr-3">
                            <button 
                              id="volume-button"
                              onClick={handleVolumeClick}
                              className="text-accent-custom hover:text-accent-light-custom transition-colors p-2 z-10"
                              aria-label={isMuted ? "Unmute" : "Mute"}
                              title="Volume (m to toggle)"
                            >
                              {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
                            </button>
                            
                            {isVolumeControlVisible && (
                              <div 
                                id="volume-control"
                                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 jp-border bg-white dark:bg-gray-800 shadow-lg w-36 z-10"
                              >
                                <div className="flex justify-center mb-2">
                                  <button 
                                    onClick={toggleMute}
                                    className="text-accent-custom hover:text-accent-light-custom p-1 transition-colors"
                                  >
                                    {isMuted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
                                  </button>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="1"
                                  step="0.01"
                                  value={volume}
                                  onChange={handleVolumeChange}
                                  className="w-full"
                                  style={{ accentColor: 'var(--accent)' }}
                                />
                                <div className="text-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                                  {Math.round(volume * 100)}%
                                </div>
                              </div>
                            )}
                          </div>
                          <button 
                            onClick={togglePlay}
                            className="bg-accent-custom hover:bg-accent-light-custom text-white rounded-full p-3 transition-all shadow-md"
                            aria-label={isPlaying ? "Pause" : "Play"}
                            title="Play/Pause (space)"
                          >
                            {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Прогресс-бар - упрощаем */}
                  <div className="mb-1 group">
                    <div 
                      className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden cursor-pointer relative group-hover:h-4 transition-all shadow-inner"
                      onClick={handleProgressClick}
                      onMouseDown={(e) => {
                        setIsDragging(true);
                        handleProgressClick(e);
                      }}
                      onMouseMove={(e) => {
                        if (isDragging && audioRef.current && duration > 0) {
                          const progressBar = e.currentTarget;
                          const rect = progressBar.getBoundingClientRect();
                          const pos = (e.clientX - rect.left) / rect.width;
                          const newPos = Math.max(0, Math.min(pos, 1));
                          setDragProgress(newPos * 100);
                        }
                      }}
                      onMouseUp={() => {
                        if (isDragging && audioRef.current && duration > 0) {
                          audioRef.current.currentTime = (dragProgress / 100) * duration;
                          setProgress(dragProgress);
                          setIsDragging(false);
                        }
                      }}
                      onMouseLeave={() => {
                        setIsDragging(false);
                      }}
                    >
                      <div 
                        className="h-full"
                        style={{ 
                          width: `${isDragging ? dragProgress : progress}%`,
                          background: "linear-gradient(90deg, var(--accent) 0%, var(--accent-light) 100%)"
                        }}
                      ></div>
                      
                      {/* Индикатор текущей позиции - упрощаем */}
                      <div 
                        className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white border-2 border-accent-custom rounded-full shadow-md"
                        style={{ left: `${isDragging ? dragProgress : progress}%`, marginLeft: '-6px' }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center p-8">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Select a track to listen
                  </p>
                  <button 
                    onClick={() => handlePlayTrack(tracks[0])}
                    className="jp-button inline-flex items-center"
                  >
                    <FaPlay className="mr-2" size={14} />
                    <span>Play the first track</span>
                  </button>
                </div>
              )}
            </AnimatePresence>
            
            {/* Список треков */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                <span className="text-accent-custom">トラック</span> Tracks
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tracks.map((track) => (
                  <div 
                    key={track.id}
                    className={`jp-card group cursor-pointer ${currentTrack?.id === track.id ? 'ring-2 ring-accent-custom' : ''}`}
                    onClick={() => handlePlayTrack(track)}
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img 
                        src={track.cover} 
                        alt={`${track.title} cover`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="bg-white text-accent-custom rounded-full p-3 shadow-lg transition-transform group-hover:scale-105">
                          {currentTrack?.id === track.id && isPlaying ? 
                            <FaPause size={16} /> : 
                            <FaPlay size={16} />
                          }
                        </button>
                      </div>
                      
                      {currentTrack?.id === track.id && (
                        <div className="absolute top-2 right-2 bg-accent-custom text-white text-xs px-2 py-1 rounded-full">
                          {isPlaying ? 'Playing' : 'Selected'}
                        </div>
                      )}
                      
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                        <h4 className="text-white font-bold truncate">{track.title}</h4>
                        <p className="text-gray-300 text-sm truncate">{track.artist}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-400">{track.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
} 