"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaInstagram, FaYoutube, FaFacebookF } from 'react-icons/fa';

// Интерфейс для частиц
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  speedX: number;
  speedY: number;
}

// Интерфейс для каллиграфических символов
interface CalligraphySymbol {
  id: number;
  x: number;
  y: number;
  symbol: string;
  size: number;
  opacity: number;
  rotation: number;
}

export default function ContactSection() {
  const [isFormLoaded, setIsFormLoaded] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formPosition, setFormPosition] = useState({ x: 0, y: 0 });
  const [hoverField, setHoverField] = useState<string | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [calligraphySymbols, setCalligraphySymbols] = useState<CalligraphySymbol[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [inkEffect, setInkEffect] = useState<{ x: number, y: number, visible: boolean }>({ x: 0, y: 0, visible: false });
  
  const formRef = useRef<HTMLDivElement>(null);
  const formControls = useAnimation();
  const stampControls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Японские символы для случайного отображения
  const japaneseSymbols = ['音', '宮', '本', '和', '愛', '美', '想', '創', '輝', '静'];
  
  // Цвета для частиц
  const particleColors = ['#FF5555', '#8A9FA6', '#E6DBCB', '#FFA59E'];
  
  useEffect(() => {
    // Добавляем небольшую задержку для анимации появления
    const timer = setTimeout(() => {
      setIsFormLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Создание начальных частиц и символов
  useEffect(() => {
    // Создаем начальные частицы
    const initialParticles: Particle[] = [];
    for (let i = 0; i < 30; i++) {
      initialParticles.push(createParticle());
    }
    setParticles(initialParticles);
    
    // Создаем плавающие японские символы
    const initialSymbols: CalligraphySymbol[] = [];
    for (let i = 0; i < 10; i++) {
      initialSymbols.push(createCalligraphySymbol());
    }
    setCalligraphySymbols(initialSymbols);
    
    // Запускаем анимацию
    const animationInterval = setInterval(() => {
      updateParticlesAndSymbols();
    }, 50);
    
    return () => clearInterval(animationInterval);
  }, []);
  
  // Инициализация и рисование на канвасе
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Устанавливаем размер канваса, соответствующий размеру окна
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawBackground(ctx);
    };
    
    // Функция для рисования японских мазков кистью на фоне
    const drawBackground = (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Добавляем несколько мазков японской кистью
      drawBrushStroke(ctx, canvas.width * 0.1, canvas.height * 0.2, canvas.width * 0.3, canvas.height * 0.3);
      drawBrushStroke(ctx, canvas.width * 0.7, canvas.height * 0.1, canvas.width * 0.8, canvas.height * 0.3);
      drawBrushStroke(ctx, canvas.width * 0.3, canvas.height * 0.7, canvas.width * 0.5, canvas.height * 0.8);
      drawBrushStroke(ctx, canvas.width * 0.8, canvas.height * 0.6, canvas.width * 0.9, canvas.height * 0.9);
      
      // Добавляем небольшие круги, напоминающие капли чернил
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 5 + 1;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fill();
      }
    };
    
    // Функция для рисования мазка кистью
    const drawBrushStroke = (
      ctx: CanvasRenderingContext2D, 
      startX: number, 
      startY: number, 
      endX: number, 
      endY: number
    ) => {
      ctx.save();
      ctx.globalAlpha = 0.1;
      
      // Создаем кривую линию с различной шириной, имитирующую мазок кистью
      const points = 8;
      const pointsArray = [];
      
      // Генерируем промежуточные точки с небольшими отклонениями
      for (let i = 0; i <= points; i++) {
        const ratio = i / points;
        const x = startX + (endX - startX) * ratio + (Math.random() - 0.5) * 30;
        const y = startY + (endY - startY) * ratio + (Math.random() - 0.5) * 30;
        pointsArray.push({ x, y });
      }
      
      // Рисуем основную линию
      ctx.beginPath();
      ctx.moveTo(pointsArray[0].x, pointsArray[0].y);
      
      for (let i = 1; i < pointsArray.length; i++) {
        // Используем кривые Безье для более плавной линии
        const prevPoint = pointsArray[i - 1];
        const currPoint = pointsArray[i];
        
        // Если есть следующая точка, используем ее для контроля
        if (i < pointsArray.length - 1) {
          const nextPoint = pointsArray[i + 1];
          const cp1x = prevPoint.x + (currPoint.x - prevPoint.x) * 0.5;
          const cp1y = prevPoint.y + (currPoint.y - prevPoint.y) * 0.5;
          const cp2x = currPoint.x + (nextPoint.x - currPoint.x) * 0.5;
          const cp2y = currPoint.y + (nextPoint.y - currPoint.y) * 0.5;
          
          ctx.quadraticCurveTo(cp1x, cp1y, currPoint.x, currPoint.y);
        } else {
          ctx.lineTo(currPoint.x, currPoint.y);
        }
      }
      
      ctx.stroke();
      ctx.restore();
    };
    
    // Инициализация при монтировании и изменении размера окна
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  // Функция создания новой частицы
  const createParticle = (x?: number, y?: number): Particle => {
    const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
    const containerHeight = containerRef.current?.offsetHeight || window.innerHeight;
    
    return {
      id: Math.random(),
      x: x || Math.random() * containerWidth,
      y: y || Math.random() * containerHeight,
      size: Math.random() * 8 + 2,
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
      opacity: Math.random() * 0.5 + 0.1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2
    };
  };
  
  // Функция создания каллиграфического символа
  const createCalligraphySymbol = (): CalligraphySymbol => {
    const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
    const containerHeight = containerRef.current?.offsetHeight || window.innerHeight;
    
    return {
      id: Math.random(),
      x: Math.random() * containerWidth,
      y: Math.random() * containerHeight,
      symbol: japaneseSymbols[Math.floor(Math.random() * japaneseSymbols.length)],
      size: Math.random() * 60 + 30,
      opacity: Math.random() * 0.2 + 0.05,
      rotation: Math.random() * 360
    };
  };
  
  // Обновление позиций частиц и символов
  const updateParticlesAndSymbols = () => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    
    // Обновляем частицы
    setParticles(prev => {
      return prev.map(particle => {
        let newX = particle.x + particle.speedX;
        let newY = particle.y + particle.speedY;
        
        // Проверяем границы и при необходимости меняем направление
        if (newX < 0 || newX > containerWidth) {
          newX = particle.x;
          particle.speedX *= -1;
        }
        
        if (newY < 0 || newY > containerHeight) {
          newY = particle.y;
          particle.speedY *= -1;
        }
        
        // Немного меняем непрозрачность для эффекта мерцания
        const newOpacity = particle.opacity + (Math.random() - 0.5) * 0.05;
        
        return {
          ...particle,
          x: newX,
          y: newY,
          opacity: Math.min(Math.max(newOpacity, 0.05), 0.6)
        };
      });
    });
    
    // Плавно перемещаем символы
    setCalligraphySymbols(prev => {
      return prev.map(symbol => {
        // Очень медленное движение для символов
        const newX = symbol.x + (Math.random() - 0.5) * 0.5;
        const newY = symbol.y + (Math.random() - 0.5) * 0.5;
        const newRotation = symbol.rotation + (Math.random() - 0.5) * 0.3;
        
        // Проверяем границы
        const x = newX < 0 ? containerWidth : newX > containerWidth ? 0 : newX;
        const y = newY < 0 ? containerHeight : newY > containerHeight ? 0 : newY;
        
        return {
          ...symbol,
          x,
          y,
          rotation: newRotation
        };
      });
    });
  };
  
  // Создание эффекта брызг чернил при клике на форму
  const createInkSplash = (x: number, y: number) => {
    // Добавляем частицы в форме брызг
    const splashParticles: Particle[] = [];
    for (let i = 0; i < 20; i++) {
      splashParticles.push({
        id: Math.random(),
        x,
        y,
        size: Math.random() * 10 + 5,
        color: '#000000',
        opacity: Math.random() * 0.5 + 0.2,
        speedX: (Math.random() - 0.5) * 10,
        speedY: (Math.random() - 0.5) * 10
      });
    }
    
    setParticles(prev => [...prev, ...splashParticles]);
    
    // Показываем эффект чернильной кляксы
    setInkEffect({
      x,
      y,
      visible: true
    });
    
    // Скрываем эффект через некоторое время
    setTimeout(() => {
      setInkEffect(prev => ({ ...prev, visible: false }));
    }, 1500);
  };
  
  // Эффект плавающей формы при движении мыши
  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Обновляем позицию мыши для взаимодействия с частицами
      setMousePosition({ x, y });
      
      // Calculate position relative to the center of the container
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Movement range in pixels (small value for subtle effect)
      const moveX = (x - centerX) / 50;
      const moveY = (y - centerY) / 50;
      
      setFormPosition({ x: moveX, y: moveY });
      
      // Влияем на движение частиц вблизи курсора
      setParticles(prev => {
        return prev.map(particle => {
          // Расстояние от частицы до курсора
          const dx = particle.x - x;
          const dy = particle.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Если частица близко к курсору, меняем её скорость
          if (distance < 100) {
            // Нормализованный вектор от курсора к частице
            const nx = dx / distance;
            const ny = dy / distance;
            
            // Чем ближе частица, тем сильнее эффект
            const factor = 1 - distance / 100;
            
            return {
              ...particle,
              speedX: particle.speedX + nx * factor * 0.5,
              speedY: particle.speedY + ny * factor * 0.5
            };
          }
          
          return particle;
        });
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Получаем форму из события
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    // Получаем значения полей
    const name = formData.get('user_name') as string;
    const email = formData.get('user_email') as string;
    const service = formData.get('service') as string;
    const message = formData.get('message') as string;
    
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      // URL Google Forms
      const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScbf9wCPF1oq357su40D17zAyCrep30QeGz-cF6L8MIInQM5Q/formResponse';
      
      console.log('Preparing Google Form submission...');
      
      // Формируем URL с параметрами
      const url = new URL(googleFormUrl);
      
      // Используем правильные ID полей Google Forms
      url.searchParams.append('entry.1752367064', name); // ID для имени
      url.searchParams.append('entry.765967897', email); // ID для email
      url.searchParams.append('entry.1636822330', service || 'Not specified'); // ID для услуги
      url.searchParams.append('entry.1123326561', message); // ID для сообщения
      
      // Отправляем данные через скрытый iframe для обхода CORS
      const iframe = document.createElement('iframe');
      iframe.name = 'hidden-iframe';
      iframe.id = 'hidden-iframe';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      // Создаем временную форму
      const tempForm = document.createElement('form');
      tempForm.action = url.toString();
      tempForm.method = 'POST';
      tempForm.target = 'hidden-iframe';
      
      // Добавляем поля к форме
      const appendField = (name: string, value: string) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        tempForm.appendChild(input);
      };
      
      appendField('entry.1752367064', name);
      appendField('entry.765967897', email);
      appendField('entry.1636822330', service || 'Not specified');
      appendField('entry.1123326561', message);
      
      // Добавляем форму, отправляем и удаляем её
      document.body.appendChild(tempForm);
      tempForm.submit();
      
      setTimeout(() => {
        document.body.removeChild(tempForm);
        document.body.removeChild(iframe);
      }, 1000);
      
      console.log('Form submitted successfully');
      
      // Анимация успешной отправки
      await stampControls.start({
        scale: [0.8, 1.2, 1],
        rotate: [-5, 5, 0],
        transition: { duration: 0.5 }
      });
      
      setIsFormSubmitted(true);
      form.reset();
      
      // Эффект брызг чернил в позиции формы
      if (formRef.current) {
        const rect = formRef.current.getBoundingClientRect();
        createInkSplash(rect.width / 2, rect.height / 2);
      }
      
      // Анимация пост-отправки
      await formControls.start({
        y: [0, -20, 0],
        transition: { duration: 0.7, ease: "easeInOut" }
      });
      
      // Через 3 секунды сбрасываем состояние
      setTimeout(() => {
        setIsFormSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section id="contact" className="jp-section relative overflow-hidden py-24">
      <div 
        className="container-custom relative z-10" 
        ref={containerRef} 
        onMouseMove={handleMouseMove}
      >
        <div className="text-center mb-12">
          <motion.h2 
            className="jp-heading text-4xl md:text-5xl font-bold jp-title mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-accent-custom">お問い合わせ</span> CONTACT US
          </motion.h2>
          <motion.div
            className="w-24 h-1 bg-accent-custom mx-auto my-4"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          />
          <motion.p 
            className="mt-4 text-xl text-gray-700"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Get in touch with us to discuss your project
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div 
            className="relative z-10"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <motion.div 
              className={`jp-border form-letter letter-paper bg-background p-8 relative jp-stamp ${isFormSubmitted ? 'stamped' : ''}`}
              animate={formControls}
              style={{
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)', 
                transform: `perspective(1000px) rotateX(${formPosition.y}deg) rotateY(${-formPosition.x}deg)`,
                transition: 'transform 0.1s ease-out'
              }}
              ref={formRef}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                createInkSplash(x, y);
              }}
            >
              {/* Эффект чернильной кляксы */}
              <AnimatePresence>
                {inkEffect.visible && (
                  <motion.div 
                    className="absolute z-0 pointer-events-none"
                    style={{ 
                      left: inkEffect.x, 
                      top: inkEffect.y, 
                      transform: 'translate(-50%, -50%)'
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.15 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                  >
                    <svg width="200" height="200" viewBox="0 0 200 200">
                      <path d="M100,20 C150,20 180,70 180,100 C180,140 150,180 100,180 C50,180 20,150 20,100 C20,60 50,20 100,20 Z" fill="currentColor" className="text-accent-custom" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Декоративные элементы */}
              <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-accent-custom opacity-30"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-accent-custom opacity-30"></div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Form</h3>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <motion.div
                  whileHover={{ y: -2 }}
                  onHoverStart={() => setHoverField('name')}
                  onHoverEnd={() => setHoverField(null)}
                >
                  <label 
                    htmlFor="name" 
                    className={`block text-gray-700 mb-2 transition-all duration-300 ${hoverField === 'name' ? 'text-accent-custom' : ''}`}
                  >
                    Name
                  </label>
                  <div className="relative">
                  <input 
                    type="text" 
                    id="name" 
                      name="user_name" 
                      className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-accent-custom focus:ring-0 bg-transparent text-gray-800"
                    required 
                  />
                    <div 
                      className={`absolute bottom-0 left-0 h-0.5 bg-accent-custom transform origin-left transition-transform duration-300 ${hoverField === 'name' ? 'scale-x-100' : 'scale-x-0'}`} 
                      style={{ width: '100%' }}
                    ></div>
                </div>
                </motion.div>
                
                <motion.div
                  whileHover={{ y: -2 }}
                  onHoverStart={() => setHoverField('email')}
                  onHoverEnd={() => setHoverField(null)}
                >
                  <label 
                    htmlFor="email" 
                    className={`block text-gray-700 mb-2 transition-all duration-300 ${hoverField === 'email' ? 'text-accent-custom' : ''}`}
                  >
                    Email
                  </label>
                  <div className="relative">
                  <input 
                    type="email" 
                    id="email" 
                      name="user_email" 
                      className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-accent-custom focus:ring-0 bg-transparent text-gray-800"
                    required 
                  />
                    <div 
                      className={`absolute bottom-0 left-0 h-0.5 bg-accent-custom transform origin-left transition-transform duration-300 ${hoverField === 'email' ? 'scale-x-100' : 'scale-x-0'}`} 
                      style={{ width: '100%' }}
                    ></div>
                </div>
                </motion.div>
                
                <motion.div
                  whileHover={{ y: -2 }}
                  onHoverStart={() => setHoverField('service')}
                  onHoverEnd={() => setHoverField(null)}
                >
                  <label 
                    htmlFor="service" 
                    className={`block text-gray-700 mb-2 transition-all duration-300 ${hoverField === 'service' ? 'text-accent-custom' : ''}`}
                  >
                    Service
                  </label>
                  <div className="relative">
                  <select 
                    id="service" 
                    name="service" 
                      className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-accent-custom focus:ring-0 bg-transparent text-gray-800 appearance-none"
                  >
                      <option value="">Select service</option>
                    <option value="mastering">Mastering</option>
                    <option value="mixing">Mixing</option>
                    <option value="recording">Recording</option>
                      <option value="beats">Beat Production</option>
                    <option value="sound-design">Sound Design</option>
                    <option value="arrangement">Arrangement</option>
                  </select>
                    <div 
                      className={`absolute bottom-0 left-0 h-0.5 bg-accent-custom transform origin-left transition-transform duration-300 ${hoverField === 'service' ? 'scale-x-100' : 'scale-x-0'}`} 
                      style={{ width: '100%' }}
                    ></div>
                    <div className="absolute right-4 top-2.5 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                </div>
                </motion.div>
                
                <motion.div
                  whileHover={{ y: -2 }}
                  onHoverStart={() => setHoverField('message')}
                  onHoverEnd={() => setHoverField(null)}
                >
                  <label 
                    htmlFor="message" 
                    className={`block text-gray-700 mb-2 transition-all duration-300 ${hoverField === 'message' ? 'text-accent-custom' : ''}`}
                  >
                    Message
                  </label>
                  <div className="relative">
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={5} 
                      className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-accent-custom focus:ring-0 bg-transparent text-gray-800" 
                    required
                  ></textarea>
                    <div 
                      className={`absolute bottom-0 left-0 h-0.5 bg-accent-custom transform origin-left transition-transform duration-300 ${hoverField === 'message' ? 'scale-x-100' : 'scale-x-0'}`} 
                      style={{ width: '100%' }}
                    ></div>
                </div>
                </motion.div>
                
                {errorMessage && (
                  <div className="text-accent-custom text-sm">{errorMessage}</div>
                )}
                
                <div>
                  <motion.button 
                    type="submit" 
                    className="jp-button ink-splash-button w-full flex items-center justify-center group relative overflow-hidden"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    animate={stampControls}
                  >
                    <span className="relative z-10 flex items-center">
                      {isSubmitting ? 'SENDING...' : 'SEND'}
                      {!isSubmitting && (
                        <motion.span
                          className="ml-2"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                        >
                          <FaPaperPlane className="h-4 w-4" />
                        </motion.span>
                      )}
                    </span>
                    <div className="absolute inset-0 overflow-hidden">
                      <div 
                        className="w-full h-full bg-accent-custom transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
                      />
                    </div>
                  </motion.button>
                </div>
              </form>
              
              {/* Red Hanko stamp that appears on submission */}
              <AnimatePresence>
                {isFormSubmitted && (
                  <motion.div 
                    className="absolute -right-10 top-10 bg-accent-custom text-white jp-heading p-6 rounded-full shadow-lg z-20 flex items-center justify-center border-2 border-red-700"
                    initial={{ scale: 0, rotate: -20, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <div className="text-center">
                      <div className="text-2xl">送信</div>
                      <div className="text-xs mt-1">SENT</div>
            </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="relative z-10"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="jp-border bg-background p-8 h-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h3>
              
              <div className="space-y-8">
                <motion.div 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="bg-accent-custom p-3 rounded-full text-white mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Email</h4>
                    <a 
                      href="mailto:info@miyamoto-soundworks.com" 
                      className="text-gray-700 hover:text-accent-custom transition-colors"
                    >
                      info@miyamoto-soundworks.com
                    </a>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="bg-accent-custom p-3 rounded-full text-white mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Location</h4>
                    <p className="text-gray-700">
                      Berlin, Germany
                    </p>
                  </div>
                </motion.div>
              </div>
              
              {/* Japanese-style artwork */}
              <div className="mt-12 relative">
                <div className="absolute top-0 right-0 jp-heading text-8xl text-accent-custom opacity-10">音</div>
                
                <div className="relative z-10">
                  <p className="text-gray-700 mb-6">
                    Our studio is located in the creative heart of Berlin, where Eastern philosophy meets Western technology. We work with clients worldwide and provide remote services for all your audio production needs.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 relative z-10">
                <h4 className="font-bold text-gray-900 mb-4">Social Media</h4>
                <div className="flex space-x-4">
                  <motion.a 
                    href="#" 
                    className="bg-gray-200 p-3 rounded-full text-accent-custom hover:bg-accent-custom hover:text-white transition-colors"
                    whileHover={{ y: -5, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaInstagram className="h-5 w-5" />
                  </motion.a>
                  <motion.a 
                    href="#" 
                    className="bg-gray-200 p-3 rounded-full text-accent-custom hover:bg-accent-custom hover:text-white transition-colors"
                    whileHover={{ y: -5, rotate: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaYoutube className="h-5 w-5" />
                  </motion.a>
                  <motion.a 
                    href="#" 
                    className="bg-gray-200 p-3 rounded-full text-accent-custom hover:bg-accent-custom hover:text-white transition-colors"
                    whileHover={{ y: -5, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaFacebookF className="h-5 w-5" />
                  </motion.a>
                </div>
              </div>
              
              <motion.div 
                className="mt-12 bg-gradient-to-r from-accent-custom to-red-800 p-6 rounded-lg text-white shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <h4 className="font-bold text-xl mb-2">Urgent Project?</h4>
                <p className="text-sm mb-4">Contact us now for a quick response</p>
                <a 
                  href="mailto:urgent@miyamoto-soundworks.com" 
                  className="inline-flex items-center bg-white text-accent-custom px-4 py-2 rounded font-bold text-sm hover:bg-gray-100 transition-colors"
                >
                  CONTACT NOW
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Частицы и интерактивные элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Рендеринг плавающих частиц */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              background: particle.color,
              opacity: particle.opacity,
            }}
            initial={false}
            animate={{
              x: particle.x,
              y: particle.y,
            }}
            transition={{
              duration: 0.1,
              ease: 'linear'
            }}
          />
        ))}
        
        {/* Рендеринг каллиграфических символов */}
        {calligraphySymbols.map(symbol => (
          <motion.div
            key={symbol.id}
            className="absolute jp-heading text-accent-custom pointer-events-none"
            style={{
              left: symbol.x,
              top: symbol.y,
              fontSize: symbol.size,
              opacity: symbol.opacity,
              transform: `rotate(${symbol.rotation}deg)`,
            }}
            initial={false}
            animate={{
              rotate: symbol.rotation,
            }}
            transition={{
              duration: 0.5,
              ease: 'linear'
            }}
          >
            {symbol.symbol}
          </motion.div>
        ))}
      </div>
      
      {/* Декоративный фон */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.1 }}
      />
      
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle, rgba(200, 200, 200, 0.3) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}></div>
        </div>
        
        {/* Decorative shapes */}
        <div className="absolute -left-64 -top-64 w-[500px] h-[500px] rounded-full bg-accent-custom opacity-5 blur-3xl"></div>
        <div className="absolute -right-64 -bottom-64 w-[500px] h-[500px] rounded-full bg-accent-custom opacity-5 blur-3xl"></div>
      </div>
    </section>
  );
} 