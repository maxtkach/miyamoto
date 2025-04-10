"use client";

import React, { useState } from 'react';
import { FaMix, FaVolumeUp, FaHeadphonesAlt, FaComments } from 'react-icons/fa';

interface PriceItem {
  name: string;
  price: string;
  description: string;
}

interface Service {
  id: number;
  icon: React.ReactNode;
  title: string;
  japaneseTitle: string;
  description: string;
  kanji: string;  // Большой иероглиф для фона
  prices: PriceItem[];
}

const services: Service[] = [
  {
    id: 1,
    icon: <FaMix className="text-4xl" />,
    title: "Track Mixing",
    japaneseTitle: "トラックミキシング",
    description: "Professional track mixing to perfectly balance all elements of your composition, ensuring clarity and harmony. Our engineers use high-quality equipment and years of experience to make your music shine.",
    kanji: "混",
    prices: [
      {
        name: "Basic Mix",
        price: "150$",
        description: "Standard mixing of up to 30 tracks, 1 revision included"
      },
      {
        name: "Premium Mix",
        price: "300$",
        description: "Professional mixing of up to 50 tracks, 3 revisions included"
      },
      {
        name: "Deluxe Mix",
        price: "500$",
        description: "High-end mixing of unlimited tracks, 5 revisions, analog processing"
      }
    ]
  },
  {
    id: 2,
    icon: <FaVolumeUp className="text-4xl" />,
    title: "Mastering",
    japaneseTitle: "マスタリング",
    description: "Final polishing of your tracks to industry standards, optimizing sound for all platforms and playback systems. We enhance the overall sound while preserving the artistic intent of your music.",
    kanji: "極",
    prices: [
      {
        name: "Single Track",
        price: "75$",
        description: "Standard mastering for one track"
      },
      {
        name: "EP Package",
        price: "250$",
        description: "Professional mastering for 3-5 tracks with cohesive sound"
      },
      {
        name: "Album Package",
        price: "450$",
        description: "Complete album mastering up to 12 tracks with premium service"
      }
    ]
  },
  {
    id: 3,
    icon: <FaHeadphonesAlt className="text-4xl" />,
    title: "Sound Design",
    japaneseTitle: "サウンドデザイン",
    description: "Creation of unique sound effects and audio environments for your projects. From subtle atmospheres to impactful sound effects, we craft audio elements that elevate your creative vision.",
    kanji: "音",
    prices: [
      {
        name: "Custom SFX",
        price: "50$",
        description: "Individual sound effect creation, per sound"
      },
      {
        name: "Ambience Pack",
        price: "200$",
        description: "Set of atmospheric sounds for scene or environment"
      },
      {
        name: "Full Project",
        price: "From 500$",
        description: "Complete sound design package for films or games"
      }
    ]
  },
  {
    id: 4,
    icon: <FaComments className="text-4xl" />,
    title: "Consultation",
    japaneseTitle: "コンサルテーション",
    description: "Expert advice on your music projects from our experienced team. Whether you need guidance on production, arrangement, or technical aspects, our specialists will help you make informed decisions.",
    kanji: "談",
    prices: [
      {
        name: "Single Session",
        price: "100$",
        description: "1-hour consultation on your specific questions"
      },
      {
        name: "Project Review",
        price: "250$",
        description: "Detailed analysis of your project with recommendations"
      },
      {
        name: "Production Guidance",
        price: "500$",
        description: "Ongoing support throughout your production process"
      }
    ]
  }
];

export default function ServicesSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [openPriceModal, setOpenPriceModal] = useState<number | null>(null);
  
  const handleOpenPriceModal = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenPriceModal(id);
  };

  const handleClosePriceModal = () => {
    setOpenPriceModal(null);
  };
  
  return (
    <section id="services" className="py-24 bg-light dark:bg-gray-800">
      <div className="container-custom">
        <h2 className="jp-heading text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-16">
          <span className="text-accent-custom">サービス</span> OUR SERVICES
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="jp-service-card relative overflow-hidden transform transition-all duration-300 ease-in-out"
              style={{ 
                transform: hoveredId === service.id ? 'translateY(-10px)' : 'translateY(0)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                boxShadow: hoveredId === service.id ? '0 15px 30px rgba(0, 0, 0, 0.1)' : '0 5px 15px rgba(0, 0, 0, 0.05)'
              }}
              onMouseEnter={() => setHoveredId(service.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Японская табличка - основной контейнер */}
              <div className="bg-background p-6 md:p-8 rounded relative border-2 border-gray-800 dark:border-gray-600 overflow-hidden">
                {/* Фоновый иероглиф */}
                <div className="absolute right-2 bottom-0 text-[150px] text-gray-300 dark:text-gray-600 opacity-10 jp-heading leading-none z-0 select-none">
                  {service.kanji}
                </div>
                
                {/* Красная печать в углу */}
                <div className="absolute top-4 right-4 bg-accent-custom text-gray-50 jp-heading text-xs p-2 rounded-sm transform rotate-6 shadow-sm">
                  宮本
                </div>
                
                {/* Верхняя часть карточки */}
                <div className="flex items-start mb-6 relative z-10">
                  <div className="bg-accent-custom text-gray-50 p-3 rounded-md mr-4 transform transition-transform duration-300" 
                      style={{ transform: hoveredId === service.id ? 'scale(1.1) rotate(-5deg)' : 'scale(1) rotate(0)' }}>
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold jp-title">
                      {service.title}
                    </h3>
                    <p className="jp-heading text-accent-custom text-sm mt-1">
                      {service.japaneseTitle}
                    </p>
                  </div>
                </div>
                
                {/* Декоративная линия */}
                <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-700 my-4 relative">
                  <div className="absolute w-1/3 h-full left-0 bg-accent-custom"></div>
                </div>
                
                {/* Описание услуги */}
                <div className="relative z-10 transition-all duration-300" 
                     style={{ 
                        opacity: hoveredId === service.id ? 1 : 0.8,
                        maxHeight: hoveredId === service.id ? '200px' : '80px',
                        overflow: 'hidden'
                     }}>
                  <p className="text-gray-700 dark:text-gray-300">
                    {service.description}
                  </p>
                </div>
                
                {/* Кнопка "Узнать больше" */}
                <div className={`mt-4 transition-opacity duration-300 ${hoveredId === service.id ? 'opacity-100' : 'opacity-0'}`}>
                  <button 
                    className="jp-button text-sm inline-flex items-center"
                    onClick={(e) => handleOpenPriceModal(service.id, e)}
                  >
                    <span>LEARN MORE</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
                
                {/* Японские декоративные элементы на фоне */}
                <div className="absolute top-2 left-2 h-4 w-4 border-t-2 border-l-2 border-gray-800 dark:border-gray-200 opacity-50"></div>
                <div className="absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-gray-800 dark:border-gray-200 opacity-50"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Модальное окно с прайс-листом */}
        {openPriceModal !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm" onClick={handleClosePriceModal}>
            <div 
              className="border-2 border-accent-custom color-gray-50 p-6 md:p-8 max-w-2xl w-full rounded-lg shadow-2xl transform transition-all duration-300 overflow-y-auto max-h-[80vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Японские декоративные элементы */}
              <div className="absolute top-3 right-3 w-24 h-24 border-t-2 border-r-2 border-accent-custom opacity-20 pointer-events-none"></div>
              <div className="absolute bottom-3 left-3 w-24 h-24 border-b-2 border-l-2 border-accent-custom opacity-20 pointer-events-none"></div>
              
              {/* Фоновый иероглиф */}
              <div className="absolute right-4 bottom-4 text-[200px] text-accent-custom opacity-5 jp-heading leading-none z-0 select-none pointer-events-none">
                {services.find(s => s.id === openPriceModal)?.kanji}
              </div>
              
              {/* Заголовок модального окна */}
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    {services.find(s => s.id === openPriceModal)?.title}
                  </h3>
                  <p className="jp-heading text-accent-custom text-sm mt-1">
                    {services.find(s => s.id === openPriceModal)?.japaneseTitle}
                  </p>
                </div>
                <button 
                  className="text-gray-300 hover:text-accent-custom transition-colors bg-accent-custom bg-opacity-10 p-2 rounded-full"
                  onClick={handleClosePriceModal}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Декоративная линия */}
              <div className="relative z-10 h-[2px] w-full bg-gradient-to-r from-accent-custom via-accent-custom to-transparent my-6 opacity-80"></div>

              {/* Прайс-лист */}
              <div className="grid gap-6 mt-6 relative z-10">
                {services.find(s => s.id === openPriceModal)?.prices.map((priceItem, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-700 color-gray-50 p-5 rounded-lg transform transition-all duration-300 hover:border-accent-custom hover:shadow-accent"
                    style={{
                      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
                      transform: `translateY(${index * 5}px)`,
                    }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-xl font-bold text-white">{priceItem.name}</h4>
                      <span className="text-white font-bold text-xl bg-accent-custom px-3 py-1 rounded-full">{priceItem.price}</span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{priceItem.description}</p>
                  </div>
                ))}
              </div>

              {/* Контактная информация и призыв к действию */}
              <div className="mt-10 relative z-10">
                <div className="border-t border-gray-700 pt-6 mt-6">
                  <p className="text-gray-300 mb-6">
                    Individual discounts are provided when ordering multiple services. Contact us for detailed information.
                  </p>
                  <div className="flex justify-center">
                    <a 
                      href="#contact" 
                      className="inline-flex items-center justify-center px-8 py-3 bg-accent-custom hover:bg-accent-light-custom text-white rounded-lg transition-colors duration-300 shadow-lg shadow-accent-custom/30"
                      onClick={handleClosePriceModal}
                    >
                      <span className="font-bold tracking-wide">ORDER NOW</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 