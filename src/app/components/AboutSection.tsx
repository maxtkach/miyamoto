import React from 'react';
import Image from 'next/image';
import MiyamotoImage from '../../../public/images/miyamoto.webp';

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-primary dark:bg-gray-900">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="jp-border p-1 inline-block">
              <div className="jp-image relative">
                <Image
                  src={MiyamotoImage}
                  alt="Miyamoto Music Studio"
                  className="w-full h-auto"
                  width={600}
                  height={600}
                />
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <h2 className="jp-heading text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="text-accent-custom">About</span> ABOUT US
            </h2>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                We are Miyamoto, a sound design and music production studio founded in 2018. Our team consists of professional composers, sound engineers, and producers with extensive experience in the field of audio production.
              </p>
              
              <p>
                Based in Berlin, our expertise includes creating soundtracks for games, films, and commercials, as well as providing audio mastering, mixing, and sound design services. We combine Japanese precision and aesthetics with modern sound production technologies in the creative heart of Europe.
              </p>
              
              <p>
                We value each client and project, striving to deliver the highest quality results. Our goal is to create sound that not only meets technical standards but also conveys emotions and enhances the overall experience of your project.
              </p>
            </div>
            
            <div className="mt-10">
              <div className="flex items-center justify-between text-gray-800 dark:text-gray-200">
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent-custom">5+</div>
                  <div className="text-sm">Years of experience</div>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent-custom">100+</div>
                  <div className="text-sm">Completed projects</div>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent-custom">20+</div>
                  <div className="text-sm">Happy clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 