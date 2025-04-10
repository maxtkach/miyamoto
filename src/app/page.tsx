import React from 'react';

import Header from './components/Header';
import Hero from './components/Hero';
import SoundSection from './components/SoundSection';
import ServicesSection from './components/ServicesSection';
import TeamSection from './components/TeamSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <SoundSection />
        <ServicesSection />
        <TeamSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
