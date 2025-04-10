"use client";

import React, { useEffect, useState, ReactNode } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface SmoothScrollProps {
  children: ReactNode;
}

// Расширяем определение типов для опций Lenis
interface ExtendedLenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  smooth?: boolean;  // Добавляем отсутствующее в типах свойство
  smoothTouch?: boolean;
  touchMultiplier?: number;
}

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), // easeOutExpo
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2
    } as ExtendedLenisOptions);

    // Integrate with GSAP's ScrollTrigger
    function raf(time: number) {
      lenis.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);

    // Show page after a short delay to ensure smooth transitions
    setTimeout(() => {
      setIsLoaded(true);
    }, 800);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Set up scroll-triggered animations for sections
  useEffect(() => {
    if (!isLoaded) return;

    // Get all major sections to apply scroll effects
    const sections = document.querySelectorAll('section');
    
    sections.forEach((section) => {
      // Create unroll effect for each section (like a Japanese scroll)
      gsap.fromTo(
        section,
        { 
          opacity: 0,
          y: 50,
          clipPath: 'inset(5% 0% 5% 0%)'
        },
        {
          opacity: 1,
          y: 0, 
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
      
      // Apply "ink flow" effect to headings (as if writing with a brush)
      const headings = section.querySelectorAll('h1, h2, h3, .jp-heading');
      headings.forEach((heading) => {
        gsap.fromTo(
          heading,
          { 
            opacity: 0, 
            clipPath: 'inset(0 100% 0 0)',
            filter: 'blur(5px)'
          },
          {
            opacity: 1,
            clipPath: 'inset(0 0% 0 0)',
            filter: 'blur(0px)',
            duration: 0.9,
            ease: 'power2.out',
            delay: 0.2,
            scrollTrigger: {
              trigger: heading,
              start: 'top 90%',
              toggleActions: 'play none none none',
            }
          }
        );
      });
    });
  }, [isLoaded]);

  return (
    <div className="smooth-scroll-container">
      {children}
    </div>
  );
} 