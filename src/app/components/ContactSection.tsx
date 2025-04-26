"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function ContactSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="contact" className="jp-section relative overflow-hidden py-24 bg-[#0f0f0f]">
      <div 
        className="container-custom relative z-10" 
        ref={containerRef}
      >
        <div className="text-center mb-12">
          <motion.h2 
            className="jp-heading text-4xl md:text-5xl font-bold jp-title mb-2 text-white"
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
            className="mt-4 text-xl text-gray-300"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Get in touch with us to discuss your project
          </motion.p>
        </div>

        <div className="flex flex-col items-center">
          <motion.div 
            className="w-full max-w-3xl relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            ref={formRef}
          >
            <div className="jp-border bg-[#0f0f0f] p-8 rounded-lg shadow-lg">
              {/* Декоративные элементы */}
              <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-accent-custom opacity-20"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-accent-custom opacity-20"></div>
              
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="jp-heading text-accent-custom mr-2">問い合わせ</span> 
                <span>Contact Form</span>
              </h3>
              
              {/* Интегрированная Google Form в iframe */}
              <div className="w-full relative overflow-hidden bg-[#0f0f0f] rounded-lg">
                {!isLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0f0f0f]">
                    <div className="w-8 h-8 border-t-2 border-accent-custom rounded-full animate-spin"></div>
                  </div>
                )}
                
                <div className="form-container" style={{ height: 'auto' }}>
                  <iframe 
                    src="https://docs.google.com/forms/d/e/1FAIpQLScbf9wCPF1oq357su40D17zAyCrep30QeGz-cF6L8MIInQM5Q/viewform?embedded=true&usp=pp_url&theme=dark&bgcolor=0f0f0f" 
                    width="100%" 
                    height="640px" 
                    frameBorder="0" 
                    marginHeight={0} 
                    marginWidth={0}
                    style={{
                      backgroundColor: '#0f0f0f',
                      borderRadius: '0px',
                      border: 'none',
                      filter: 'invert(0.85) hue-rotate(180deg)',
                      opacity: isLoaded ? 1 : 0,
                      transition: 'opacity 0.5s ease',
                      maxWidth: '100%',
                      overflow: 'hidden'
                    }}
                    onLoad={() => setIsLoaded(true)}
                  >
                    Loading form...
                  </iframe>
                </div>
                
                {/* Декоративный символ */}
                <div className="absolute top-4 right-4 jp-heading text-4xl text-accent-custom opacity-10 pointer-events-none">連絡</div>
              </div>
              
              <div className="mt-8 text-gray-400 text-sm">
                <p>Please fill out the form above to get in touch with our team. We will respond to your inquiry as soon as possible.</p>
              </div>
            </div>
            
            {/* Краткая контактная информация под формой */}
            <div className="mt-8 flex justify-center space-x-8 text-white">
              <div className="flex flex-col items-center">
                <div className="text-accent-custom mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <a href="mailto:info@miyamoto-soundworks.com" className="text-gray-300 hover:text-accent-custom transition-colors">
                  info@miyamoto-soundworks.com
                </a>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="text-accent-custom mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-gray-300">Berlin, Germany</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Минимальные декоративные элементы фона */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Фоновый узор */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle, rgba(200, 200, 200, 0.3) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}></div>
        </div>
        
        {/* Декоративные формы */}
        <div className="absolute -left-64 -top-64 w-[500px] h-[500px] rounded-full bg-accent-custom opacity-5 blur-3xl"></div>
        <div className="absolute -right-64 -bottom-64 w-[500px] h-[500px] rounded-full bg-accent-custom opacity-5 blur-3xl"></div>
      </div>
      
      {/* CSS для стилизации встроенного iframe */}
      <style jsx global>{`
        /* Стилизация iframe для Google Forms */
        .form-container {
          position: relative;
          overflow: hidden;
          border-radius: 0;
        }
        
        /* Убираем скроллбар у iframe */
        iframe {
          scrollbar-width: none; /* Firefox */
        }
        
        iframe::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
        
        /* Скрываем внешние рамки формы в iframe */
        iframe html body form {
          border: none !important;
          box-shadow: none !important;
        }
      `}</style>
    </section>
  );
} 