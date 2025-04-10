"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

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

const beats: Beat[] = [
  {
    id: 1,
    title: "Tokyo Nights",
    artist: "Miyamoto",
    duration: "2:35",
    category: "Lo-Fi",
    url: "/audio/track1.mp3",
    coverImage: "/images/cover-1.jpg",
    key: "Am",
    bpm: 85
  },
  {
    id: 2,
    title: "Cherry Blossom",
    artist: "Miyamoto",
    duration: "3:12",
    category: "Ambient",
    url: "/audio/track2.mp3",
    coverImage: "/images/cover-2.jpg",
    key: "F",
    bpm: 72
  },
  {
    id: 3,
    title: "Kyoto Dreams",
    artist: "Miyamoto",
    duration: "2:48",
    category: "Chill",
    url: "/audio/track3.mp3",
    coverImage: "/images/cover-3.jpg",
    key: "Dm",
    bpm: 90
  },
  {
    id: 4,
    title: "Mount Fuji",
    artist: "Miyamoto",
    duration: "3:05",
    category: "Instrumental",
    url: "/audio/track4.mp3",
    coverImage: "/images/cover-4.jpg",
    key: "G",
    bpm: 78
  },
  {
    id: 5,
    title: "Zen Garden",
    artist: "Miyamoto",
    duration: "2:55",
    category: "Meditation",
    url: "/audio/track5.mp3",
    coverImage: "/images/cover-5.jpg",
    key: "C",
    bpm: 68
  },
  {
    id: 6,
    title: "Samurai",
    artist: "Miyamoto",
    duration: "3:22",
    category: "Trap",
    url: "/audio/track6.mp3",
    coverImage: "/images/cover-6.jpg",
    key: "Em",
    bpm: 140
  }
];

export default function BeatPlayer() {
  const [currentBeat, setCurrentBeat] = useState<Beat | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isVolumeControlVisible, setIsVolumeControlVisible] = useState(false);
  const [isAudioContextInitialized, setIsAudioContextInitialized] = useState(false);
  
  // Используем useRef для хранения стейтов, не влияющих на рендеринг
  const audioRef = useRef<HTMLAudioElement>(null);
  const beatsContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioContextCreatedRef = useRef<boolean>(false);
  
  // Инициализация аудио контекста только на клиенте и только один раз
  useEffect(() => {
    // Не создаем AudioContext при серверном рендеринге или если он уже создан
    if (typeof window === 'undefined' || audioContextCreatedRef.current) {
      return;
    }
    
    // Создание нового аудио контекста
    const initAudioContext = () => {
      try {
        if (!audioContextRef.current) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          audioContextRef.current = new AudioContextClass();
          analyserRef.current = audioContextRef.current.createAnalyser();
          gainNodeRef.current = audioContextRef.current.createGain();
          
          if (analyserRef.current) {
            analyserRef.current.fftSize = 256;
            const bufferLength = analyserRef.current.frequencyBinCount;
            dataArrayRef.current = new Uint8Array(bufferLength);
          }
          
          if (gainNodeRef.current) {
            gainNodeRef.current.gain.value = isMuted ? 0 : volume;
          }
          
          audioContextCreatedRef.current = true;
          setIsAudioContextInitialized(true);
          console.log('AudioContext initialized successfully');
        }
      } catch (error) {
        console.error("Error initializing AudioContext:", error);
      }
    };
    
    initAudioContext();
    
    // Очистка при размонтировании
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Безопасное закрытие аудио контекста
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close().catch(err => {
            console.error("Error closing AudioContext:", err);
          });
        } catch (err) {
          console.error("Error closing AudioContext:", err);
        }
      }
    };
  }, [volume, isMuted]);
  
  // Соединение аудио элемента с контекстом после изменения аудио трека
  useEffect(() => {
    // Не выполняем на сервере или если контекст не инициализирован
    if (typeof window === 'undefined' || !audioContextRef.current || !audioRef.current 
        || !analyserRef.current || !gainNodeRef.current || !isAudioContextInitialized) {
      return;
    }
    
    // Отключаем предыдущее соединение
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect();
      } catch (error) {
        console.error("Error disconnecting source node:", error);
      }
    }
    
    try {
      // Возобновляем аудио контекст, если он приостановлен
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      // Создаем новое соединение
      sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      sourceNodeRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      
      // Обновление громкости
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
    } catch (error) {
      console.error("Error connecting audio element:", error);
    }
    
    return () => {
      // Отключаем соединение при очистке эффекта
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.disconnect();
        } catch (error) {
          console.error("Error disconnecting source node:", error);
        }
      }
    };
  }, [currentBeat, isAudioContextInitialized]);
  
  // Обновление громкости
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
  // Запуск визуализации
  const startVisualization = () => {
    if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Ensure the canvas size matches its display size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const draw = () => {
      if (!ctx || !analyserRef.current || !dataArrayRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw visualization
      const barWidth = (canvas.width / dataArrayRef.current.length) * 2.5;
      let x = 0;
      
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        const barHeight = (dataArrayRef.current[i] / 255) * canvas.height * 0.8;
        
        // Japanese-style gradient colors
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(166, 5, 26, 0.8)');
        gradient.addColorStop(1, 'rgba(199, 41, 62, 0.4)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        // Japanese styling
        if (i % 4 === 0) {
          ctx.fillStyle = 'rgba(183, 141, 18, 0.2)';
          ctx.fillRect(x, canvas.height - barHeight * 1.2, barWidth / 2, barHeight * 1.2);
        }
        
        x += barWidth + 1;
      }
      
      animationFrameRef.current = requestAnimationFrame(draw);
    };
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (isPlaying) {
      draw();
    }
  };
  
  // Handle changing the current beat
  useEffect(() => {
    // Если аудиоконтекст существует и находится в состоянии приостановки, возобновляем его
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, [currentBeat]);
  
  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      // Убедимся, что аудиоконтекст активен
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      audioRef.current.play()
        .then(() => {
          startVisualization();
        })
        .catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
    } else {
      audioRef.current.pause();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, [isPlaying]);
  
  const handlePlayBeat = (beat: Beat) => {
    // Если текущий бит уже играет и пользователь нажимает на него снова, то просто переключаем воспроизведение
    if (currentBeat && currentBeat.id === beat.id) {
      setIsPlaying(!isPlaying);
      return;
    }
    
    // Если выбирается новый бит и что-то уже играет, сначала останавливаем воспроизведение
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
    
    // Устанавливаем новый бит и начинаем воспроизведение
    setCurrentBeat(beat);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(0);
  };
  
  const togglePlayPause = () => {
    if (currentBeat) {
      setIsPlaying(!isPlaying);
    } else if (beats.length > 0) {
      // If no beat is selected, play the first one
      handlePlayBeat(beats[0]);
    }
  };
  
  // Toggle favorite status
  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем запуск воспроизведения
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(beatId => beatId !== id) 
        : [...prev, id]
    );
  };
  
  // Toggle mute status и показать/скрыть регулятор громкости
  const handleVolumeClick = () => {
    setIsVolumeControlVisible(!isVolumeControlVisible);
  };
  
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Останавливаем всплытие события
    setIsMuted(!isMuted);
  };
  
  // Скрываем контрол громкости при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeof document === 'undefined') return; // Проверка для серверного рендеринга
      
      const target = event.target as HTMLElement;
      const volumeControl = document.getElementById('beat-volume-control');
      const volumeButton = document.getElementById('beat-volume-button');
      
      if (
        volumeControl && 
        !volumeControl.contains(target) && 
        volumeButton && 
        !volumeButton.contains(target)
      ) {
        setIsVolumeControlVisible(false);
      }
    };

    if (typeof window !== 'undefined') {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, []);
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    // Если громкость изменилась с 0, то снимаем состояние mute
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
    
    // Если громкость установлена в 0, то включаем состояние mute
    if (newVolume === 0 && !isMuted) {
      setIsMuted(true);
    }
  };
  
  // Format time for display
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Update time and progress
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    
    setCurrentTime(audioRef.current.currentTime);
  };
  
  // Handle click on progress bar
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    
    const progressBar = e.currentTarget;
    const boundingRect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - boundingRect.left;
    const clickPercentage = clickPosition / boundingRect.width;
    
    const newTime = duration * clickPercentage;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  return (
    <div className="relative">
      {/* Анимированные частицы в фоне */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-accent-custom"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              opacity: 0.2,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      
      {/* Декоративные японские иероглифы в фоне */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none dark:opacity-5 opacity-10">
        <div 
          className="absolute top-10 left-10 jp-heading text-[200px] text-gray-800 dark:text-gray-400"
          style={{
            animation: 'breathe 8s ease-in-out infinite'
          }}
        >
          音
        </div>
        <div 
          className="absolute bottom-10 right-10 jp-heading text-[150px] text-gray-800 dark:text-gray-400"
          style={{
            animation: 'breathe 10s ease-in-out infinite'
          }}
        >
          楽
        </div>
      </div>
      
      {/* Стилизованная окружность/диск в фоне */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(166, 5, 26, 0.1) 0%, rgba(166, 5, 26, 0.05) 30%, rgba(166, 5, 26, 0) 70%)',
          opacity: isPlaying ? 0.8 : 0.3,
          animation: isPlaying ? 'spin 40s linear infinite, pulse 4s ease-in-out infinite' : 'none'
        }}
      />

      <div className="border-2 border-accent-custom color-gray-50 p-6 relative shadow-xl rounded-lg overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'var(--paper-texture-light)' }}></div>
        
        {/* Декоративный бордюр в японском стиле */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-3 right-3 w-20 h-20 border-t-2 border-r-2 border-accent-custom"></div>
          <div className="absolute bottom-3 left-3 w-20 h-20 border-b-2 border-l-2 border-accent-custom"></div>
        </div>
      
      {/* Visualization Canvas */}
      <canvas 
        ref={canvasRef} 
          className="w-full h-40 mb-6 border border-accent-custom color-gray-50 rounded-lg shadow-inner"
      />
      
      {/* Current Beat Player */}
      <div className="mb-8">
        {currentBeat ? (
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/3 mb-4 md:mb-0 md:mr-6">
                <div className="border border-accent-custom inline-block rounded-lg overflow-hidden shadow-lg relative group">
                <img 
                  src={currentBeat.coverImage} 
                  alt={currentBeat.title} 
                    className="w-full h-auto object-cover transition-transform duration-1000"
                    style={{
                      transform: isPlaying ? 'scale(1.05)' : 'scale(1)'
                    }}
                  />
                  
                  {/* Эффект винилового диска */}
                  <div 
                    className="absolute inset-0 rounded-full bg-black opacity-0 transition-opacity duration-500"
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
                      opacity: isPlaying ? 0.4 : 0,
                      animation: isPlaying ? 'spin 10s linear infinite' : 'none'
                    }}
                  />
                  
                  {/* Красный индикатор воспроизведения */}
                  <div 
                    className="absolute top-3 right-3 w-3 h-3 rounded-full bg-accent-custom shadow-lg transition-opacity"
                    style={{
                      opacity: isPlaying ? 1 : 0,
                      animation: isPlaying ? 'pulse 2s infinite' : 'none'
                    }}
                  />
                  
                  {/* Наложение при наведении */}
                  <div
                    className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <button
                      onClick={togglePlayPause}
                      className="bg-white text-accent-custom rounded-full p-3 shadow-lg transform transition-transform hover:scale-110 active:scale-95"
                    >
                      {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
                    </button>
                  </div>
                </div>
            </div>
            
            <div className="w-full md:w-2/3">
              <div className="flex justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white">{currentBeat.title}</h3>
                    <p className="text-gray-300">{currentBeat.artist} • {currentBeat.category}</p>
                    <div className="flex mt-1 space-x-4">
                      <div className="text-xs bg-accent-custom bg-opacity-20 text-accent-custom px-2 py-1 rounded-sm">
                        <span className="font-medium">KEY:</span> {currentBeat.key}
                      </div>
                      <div className="text-xs bg-accent-custom bg-opacity-20 text-accent-custom px-2 py-1 rounded-sm">
                        <span className="font-medium">BPM:</span> {currentBeat.bpm}
                      </div>
                    </div>
                </div>
                
                <div className="flex items-center">
                  <button 
                      onClick={(e) => currentBeat && toggleFavorite(currentBeat.id, e)}
                      className="mr-4 text-accent-custom hover:text-accent-light-custom transition-colors transform hover:scale-110 active:scale-95"
                  >
                    {favorites.includes(currentBeat.id) ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
                  </button>
                  
                  <button 
                    onClick={togglePlayPause}
                      className="bg-accent-custom hover:bg-accent-light-custom text-white rounded-full p-3 transition-colors transform hover:scale-110 active:scale-95 shadow-md"
                      style={{
                        boxShadow: isPlaying ? '0 0 15px rgba(166, 5, 26, 0.6)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
                      }}
                  >
                    {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
                  </button>
                </div>
              </div>
              
                {/* Progress Bar с индикатором текущей позиции */}
                <div className="mb-2 group">
                <div 
                    className="h-3 bg-gray-700 rounded-full overflow-hidden cursor-pointer relative group-hover:h-4 transition-all shadow-inner"
                  onClick={handleProgressClick}
                >
                  <div 
                      className="h-full bg-gradient-to-r from-accent-custom to-accent-light-custom"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  ></div>
                    {/* Индикатор текущей позиции */}
                    <div 
                      className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white border-2 border-accent-custom rounded-full shadow-md"
                      style={{ 
                        left: `${(currentTime / duration) * 100}%`, 
                        marginLeft: '-6px',
                        animation: isPlaying ? 'pulse 2s infinite' : 'none'
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>{formatTime(currentTime)}</span>
                    <span className="ml-2">{duration ? formatTime(duration) : currentBeat.duration}</span>
              </div>
              
                  {/* Volume Control с новым механизмом отображения */}
                  <div className="relative ml-auto">
                    <button 
                      id="beat-volume-button"
                      onClick={handleVolumeClick}
                      className="text-gray-300 hover:text-accent-custom transition-colors p-2 z-10 transform hover:scale-110 active:scale-95"
                    >
                      {isMuted ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
                    </button>
                    
                    {/* Volume Slider */}
                    {isVolumeControlVisible && (
                      <div 
                        id="beat-volume-control"
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 border border-accent-custom color-gray-50 shadow-lg rounded w-36 z-10"
                      >
                        <div className="flex justify-center mb-2">
                          <button 
                            onClick={toggleMute}
                            className="text-accent-custom hover:text-accent-light-custom p-1 transform hover:scale-110 active:scale-95"
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
                        <div className="text-center mt-1 text-xs text-gray-400">
                          {Math.round(volume * 100)}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>
            </div>
          </div>
        ) : (
            <div className="text-center p-6 border-2 border-dashed border-accent-custom rounded-lg color-gray-50">
              <p className="text-gray-300">
                Select a beat to play
            </p>
            <button 
              onClick={togglePlayPause} 
                className="mt-4 jp-button transform hover:scale-105 active:scale-95 transition-transform"
            >
                Play random beat
            </button>
          </div>
        )}
        
        {/* Hidden Audio Element */}
        <audio 
          ref={audioRef}
          src={currentBeat?.url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        />
      </div>
      
      {/* Beats List */}
        <div>
          <h3 className="jp-heading text-2xl font-bold mb-4 text-white">
            <span className="text-accent-custom">ビート</span> BEATS
        </h3>
        
          {/* Глобальные стили для анимаций */}
          <style jsx global>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            
            @keyframes pulse {
              0% { transform: scale(1); opacity: 0.8; }
              50% { transform: scale(1.2); opacity: 1; }
              100% { transform: scale(1); opacity: 0.8; }
            }
            
            @keyframes float {
              0% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
              100% { transform: translateY(0px); }
            }
            
            @keyframes breathe {
              0% { opacity: 0.1; transform: translateY(0); }
              50% { opacity: 0.2; transform: translateY(-10px); }
              100% { opacity: 0.1; transform: translateY(0); }
            }
          `}</style>
          
          {/* Список битов в вертикальном отображении */}
          <div className="mt-6 space-y-4">
            {beats.map((beat) => (
              <div 
                key={beat.id}
                className={`jp-card group flex cursor-pointer transition-all duration-300 color-gray-50 relative overflow-hidden h-24 ${
                  currentBeat?.id === beat.id ? 'ring-2 ring-accent-custom' : ''
                }`}
                onClick={() => handlePlayBeat(beat)}
              >
                {/* Фоновое изображение */}
                <div 
                  className="h-full w-24 flex-shrink-0 transition-transform duration-700 group-hover:scale-110 bg-center bg-cover"
                  style={{ backgroundImage: `url(${beat.coverImage})` }}
                >
                  {/* Тёмный оверлей */}
                  <div className="absolute inset-0 bg-black bg-opacity-60 group-hover:bg-opacity-40 transition-all duration-300"></div>
                </div>
                
                {/* Контент карточки */}
                <div className="p-3 flex-grow flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="text-md font-bold tracking-wide group-hover:text-accent-custom transition-colors text-white">
                        {beat.title}
                      </h4>
                      <p className="text-sm text-gray-300">{beat.artist}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="bg-accent-custom bg-opacity-80 px-2 py-1 text-xs font-medium rounded-sm shadow-sm text-white">
                        {beat.category}
                      </div>
                      <button 
                        onClick={(e) => toggleFavorite(beat.id, e)}
                        className="text-white hover:text-accent-custom transition-colors transform hover:scale-110 p-1"
                      >
                        {favorites.includes(beat.id) ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="bg-accent-custom bg-opacity-20 text-white text-xs p-1 rounded-sm">
                        {beat.key}
                      </div>
                      <div className="bg-accent-custom bg-opacity-20 text-white text-xs p-1 rounded-sm">
                        {beat.bpm} BPM
                      </div>
                      <p className="text-xs text-gray-400 ml-2">{beat.duration}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-24 bg-gray-700 bg-opacity-60 h-1 rounded overflow-hidden"
                      >
                        {currentBeat?.id === beat.id && (
                          <div 
                            className="h-full bg-accent-custom" 
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                          ></div>
                        )}
                      </div>
                      
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handlePlayBeat(beat);
                        }}
                        className={`rounded-full p-2 transform transition-all ${
                          currentBeat?.id === beat.id && isPlaying 
                            ? 'bg-accent-custom text-white shadow-glow-accent' 
                            : 'bg-white text-accent-custom scale-0 group-hover:scale-100'
                        }`}
                      >
                        {currentBeat?.id === beat.id && isPlaying ? (
                          <FaPause size={12} />
                        ) : (
                          <FaPlay size={12} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Дополнительные стили для теней */}
          <style jsx global>{`
            .shadow-glow-accent {
              box-shadow: 0 0 10px rgba(166, 5, 26, 0.7);
            }
            
            .hide-scrollbar::-webkit-scrollbar {
              height: 4px;
            }
            
            .hide-scrollbar::-webkit-scrollbar-track {
              background: rgba(0, 0, 0, 0.1);
              border-radius: 4px;
            }
            
            .hide-scrollbar::-webkit-scrollbar-thumb {
              background: var(--accent);
              border-radius: 4px;
            }
            
            .hide-scrollbar::-webkit-scrollbar-thumb:hover {
              background: var(--accent-light);
            }
          `}</style>
        </div>
      </div>
    </div>
  );
} 