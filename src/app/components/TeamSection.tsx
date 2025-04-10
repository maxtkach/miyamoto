"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaInstagram, FaLinkedin, FaSoundcloud } from 'react-icons/fa';

interface Skill {
  name: string;
  level: number;
  jpName: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  jpRole: string;
  quote: string;
  seal: string; // Символ или короткий текст для печати hanko
  image: string; // Путь к фото участника команды
  bio: string;
  skills: Skill[];
  social: {
    instagram?: string;
    linkedin?: string;
    soundcloud?: string;
  };
  achievements: string[];
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Jamil Nangrahari',
    role: 'Sound Engineer & Beatmaker',
    jpRole: 'サウンドエンジニア & ビートメーカー',
    quote: 'Music is the universal language that connects all cultures and spirits.',
    seal: '音',
    image: '/miyamoto/images/team-member-1.jpg',
    bio: 'With over 8 years of experience in sound design and music production, Jamil specializes in creating unique beats that blend traditional Japanese sounds with modern electronic music. His innovative approach has earned him recognition in the industry.',
    skills: [
      { name: 'Beat Production', level: 95, jpName: 'ビート制作' },
      { name: 'Sound Design', level: 90, jpName: 'サウンドデザイン' },
      { name: 'Mixing', level: 85, jpName: 'ミキシング' },
      { name: 'Traditional Instruments', level: 80, jpName: '伝統楽器' }
    ],
    social: {
      instagram: 'https://www.instagram.com/prod.1han/',
    },
    achievements: [
      'Produced 100+ beats for international artists',
      'Golden Wave Award for Best Sound Design 2021',
      'Featured in Sound & Recording Magazine'
    ]
  },
  {
    id: 2,
    name: 'Max Tkach',
    role: 'Sound Engineer',
    jpRole: 'サウンドエンジニア',
    quote: 'Perfect sound is not just heard — it is felt with every cell of your body.',
    seal: '響',
    image: '/miyamoto/images/team-member-2.jpg',
    bio: 'Max has dedicated his career to perfecting the art of sound engineering. His meticulous attention to detail and deep understanding of acoustics allow him to create immersive audio experiences that transport listeners to different worlds.',
    skills: [
      { name: 'Mastering', level: 98, jpName: 'マスタリング' },
      { name: 'Studio Recording', level: 95, jpName: 'スタジオ録音' },
      { name: 'Acoustic Design', level: 88, jpName: '音響設計' },
      { name: 'Spatial Audio', level: 92, jpName: '空間オーディオ' }
    ],
    social: {
      instagram: 'https://www.instagram.com/work3rworldwide/',
      soundcloud: 'https://soundcloud.com/work3rblessed',
    },
    achievements: [
      '5 years of experience in sound engineering',
      'Mixed over 10 albums',
      'Certified FL Studio Expert'
    ]
  }
];

export default function TeamSection() {
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [mouseBrushPosition, setMouseBrushPosition] = useState({ x: 0, y: 0 });
  const [isDetailView, setIsDetailView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Animation on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Handle mouse movement for brush effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    
    const rect = sectionRef.current.getBoundingClientRect();
    setMouseBrushPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleSelectMember = (id: number) => {
    setSelectedMember(id);
    setIsDetailView(true);
  };

  const handleClose = () => {
    setIsDetailView(false);
    setTimeout(() => setSelectedMember(null), 500);
  };

  return (
    <section 
      id="team" 
      className="jp-section bg-primary color-gray-50 py-24 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      ref={sectionRef}
    >
      {/* Grid background effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: 'linear-gradient(to right, rgba(200, 200, 200, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(200, 200, 200, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          backgroundPosition: 'center center'
        }}></div>
      </div>
      
      {/* Decorative accent lines */}
      <div className="absolute left-0 top-[20%] w-full h-[1px] bg-gradient-to-r from-transparent via-accent-custom to-transparent opacity-20"></div>
      <div className="absolute right-0 top-[60%] w-full h-[1px] bg-gradient-to-r from-accent-custom via-transparent to-accent-custom opacity-20"></div>
      
      {/* Decorative circles */}
      <div className="absolute -left-40 top-40 w-80 h-80 rounded-full bg-accent-custom opacity-5 blur-3xl"></div>
      <div className="absolute -right-40 bottom-40 w-80 h-80 rounded-full bg-accent-custom opacity-5 blur-3xl"></div>
      
      {/* Moving brush stroke background effect */}
      <div 
        className="absolute pointer-events-none opacity-10 z-0"
        style={{
          left: mouseBrushPosition.x - 150,
          top: mouseBrushPosition.y - 150,
          width: 300,
          height: 300,
          backgroundImage: 'url(/miyamoto/images/ink-brush.svg)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          transition: 'transform 0.1s ease-out',
          transform: 'rotate(15deg)',
          filter: 'blur(5px)'
        }}
      />
      
      {/* Decorative Japanese wave pattern background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(/miyamoto/images/japanese-wave.svg)',
          backgroundSize: '100px',
          backgroundRepeat: 'repeat',
          transform: 'rotate(5deg) scale(1.5)',
          transformOrigin: 'center'
        }}/>
      </div>

      <div className="container-custom relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="relative inline-block">
            <h2 className="jp-heading text-4xl md:text-6xl font-bold text-gray-900">
              <span className="text-accent-custom mr-3">チーム</span> TEAM
            </h2>
            <motion.div 
              className="absolute -bottom-4 left-0 h-1 bg-accent-custom"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.5, duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            />
          </div>
          <motion.p 
            className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
          >
            Our masters of sound craft unique audio experiences that blend Japanese aesthetic traditions with cutting-edge technology
          </motion.p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isDetailView ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {teamMembers.map((member, index) => (
                <motion.div 
                  key={member.id}
                  className={`team-portrait relative overflow-hidden rounded-lg jp-border transition-all duration-300 ${
                    hoveredMember === member.id ? 'scale-105' : 'scale-100'
                  }`}
                  onMouseEnter={() => setHoveredMember(member.id)}
                  onMouseLeave={() => setHoveredMember(null)}
                  onClick={() => handleSelectMember(member.id)}
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7)), url(${member.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Team member info */}
                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white">{member.name}</h3>
                        <p className="text-accent-custom jp-heading">{member.jpRole}</p>
                      </div>
                      <div className="hanko-seal">{member.seal}</div>
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-200 italic opacity-80">
                      &ldquo;{member.quote}&rdquo;
                    </p>
                    
                    <div className="flex space-x-3 mt-4">
                      {member.social.instagram && (
                        <a href={member.social.instagram} className="text-gray-300 hover:text-accent-custom transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        </a>
                      )}
                      {member.social.soundcloud && (
                        <a href={member.social.soundcloud} className="text-gray-300 hover:text-accent-custom transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-6.417 14.583c-.354-.318-.583-.79-.583-1.323 0-.532.229-1.003.583-1.323v2.646zm1.167.417c-.212 0-.323-.103-.323-.316v-3.432c0-.213.111-.316.323-.316.213 0 .323.103.323.316v3.432c0 .213-.11.316-.323.316zm1.167 0c-.213 0-.323-.103-.323-.316v-3.743c0-.213.11-.317.323-.317.213 0 .323.104.323.317v3.743c0 .213-.11.316-.323.316zm1.166 0c-.213 0-.323-.103-.323-.316v-5.047c0-.213.11-.316.323-.316.213 0 .323.103.323.316v5.047c0 .213-.11.316-.323.316zm1.167 0c-.213 0-.323-.103-.323-.316v-5.047c0-.213.11-.316.323-.316.213 0 .323.103.323.316v5.047c0 .213-.11.316-.323.316zm1.166 0c-.212 0-.323-.103-.323-.316v-4.737c0-.213.111-.316.323-.316.214 0 .324.103.324.316v4.737c0 .213-.109.316-.324.316zm6.126.009c-.213 0-.323-.103-.323-.316v-3.437c.001-.212.11-.316.323-.316.213 0 .323.104.323.316v3.437c0 .213-.11.316-.323.316zm-3.646-.009c-.213 0-.323-.103-.323-.316v-4.123c0-.213.11-.316.323-.316.213 0 .323.103.323.316v4.123c0 .213-.11.316-.323.316zm1.166 0c-.213 0-.323-.103-.323-.316v-3.649c0-.213.11-.316.323-.316.213 0 .323.103.323.316v3.649c0 .213-.11.316-.323.316zm1.167 0c-.213 0-.323-.103-.323-.316v-3.031c0-.213.11-.316.323-.316.213 0 .323.103.323.316v3.031c0 .213-.11.316-.323.316zm1.166 0c-.213 0-.324-.103-.324-.316v-3.432c0-.213.111-.316.324-.316.213 0 .323.103.323.316v3.432c0 .213-.11.316-.323.316z"/>
                          </svg>
                        </a>
                      )}
                      {member.social.linkedin && (
                        <a href={member.social.linkedin} className="text-gray-300 hover:text-accent-custom transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <AnimatePresence>
              {selectedMember !== null && (
                <motion.div 
                  key="detail"
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={handleClose}
                >
                  <motion.div 
                    className="rice-paper bg-background w-full max-w-5xl rounded-lg overflow-hidden relative color-gray-50"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Close button */}
                    <button 
                      className="absolute top-4 right-4 z-20 text-gray-500 hover:text-accent-custom bg-white rounded-full p-2 shadow-lg transition-colors"
                      onClick={handleClose}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    
                    <div className="flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh]">
                      {/* Image column */}
                      <div className="md:w-2/5 relative h-48 md:h-auto">
                        <div 
                          className="h-full w-full"
                          style={{
                            backgroundImage: `url(${teamMembers.find(m => m.id === selectedMember)?.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        />
                        
                        {/* Overlay with gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                        
                        {/* Name overlay on image */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                          <div className="flex items-center">
                            {/* Red seal */}
                            <div className="hanko-seal mr-3 transform scale-75">
                              <span className="text-3xl">{teamMembers.find(m => m.id === selectedMember)?.seal}</span>
                            </div>
                            
                            <div>
                              <motion.h3 
                                className="text-2xl font-bold text-white"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                              >
                                {teamMembers.find(m => m.id === selectedMember)?.name}
                              </motion.h3>
                              <motion.p 
                                className="jp-heading text-accent-custom text-sm"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                              >
                                {teamMembers.find(m => m.id === selectedMember)?.jpRole}
                              </motion.p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Content column */}
                      <div className="md:w-3/5 p-4 md:p-6">
                        {/* Decorative elements - made smaller and less intrusive */}
                        <div className="absolute top-4 right-4 h-12 w-12 border-t-2 border-r-2 border-accent-custom opacity-20" />
                        <div className="absolute bottom-4 left-4 h-12 w-12 border-b-2 border-l-2 border-accent-custom opacity-20" />
                        
                        <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                          {/* Column 1: Role, Quote, Bio */}
                          <div>
                            {/* Role and quote */}
                            <div className="mb-4">
                              <motion.p 
                                className="text-gray-700 font-medium mb-2 text-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                              >
                                {teamMembers.find(m => m.id === selectedMember)?.role}
                              </motion.p>
                              
                              <motion.div 
                                className="jp-border p-3 bg-gray-50 relative italic text-gray-700 text-sm"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.6 }}
                              >
                                <div className="absolute -top-2 -left-2 text-3xl text-accent-custom opacity-20">&ldquo;</div>
                                <div className="relative z-10">
                                  {teamMembers.find(m => m.id === selectedMember)?.quote}
                                </div>
                                <div className="absolute -bottom-2 -right-2 text-3xl text-accent-custom opacity-20">&rdquo;</div>
                              </motion.div>
                            </div>
                            
                            {/* Bio */}
                            <motion.div 
                              className="mb-4"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.7, duration: 0.6 }}
                            >
                              <h4 className="text-sm font-bold text-gray-900 mb-1">Biography</h4>
                              <p className="text-gray-700 text-sm">
                                {teamMembers.find(m => m.id === selectedMember)?.bio}
                              </p>
                            </motion.div>
                          </div>
                          
                          {/* Column 2: Skills, Achievements, Social */}
                          <div>
                            {/* Skills */}
                            <motion.div 
                              className="mb-4"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.8, duration: 0.6 }}
                            >
                              <h4 className="text-sm font-bold text-gray-900 mb-1">Expertise</h4>
                              <div className="space-y-2">
                                {teamMembers.find(m => m.id === selectedMember)?.skills.map((skill, idx) => (
                                  <div key={idx} className="flex flex-col">
                                    <div className="flex justify-between items-center mb-1">
                                      <div className="flex items-center">
                                        <span className="text-xs text-gray-800">{skill.name}</span>
                                        <span className="jp-heading text-accent-custom text-xs ml-2 opacity-70">{skill.jpName}</span>
                                      </div>
                                      <span className="text-xs text-accent-custom">{skill.level}%</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                      <motion.div 
                                        className="h-full bg-accent-custom"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${skill.level}%` }}
                                        transition={{ delay: 0.9 + idx * 0.1, duration: 1, ease: "easeOut" }}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                            
                            {/* Achievements */}
                            <motion.div 
                              className="mb-4"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.9, duration: 0.6 }}
                            >
                              <h4 className="text-sm font-bold text-gray-900 mb-1">Achievements</h4>
                              <ul className="space-y-1">
                                {teamMembers.find(m => m.id === selectedMember)?.achievements.map((achievement, idx) => (
                                  <motion.li 
                                    key={idx} 
                                    className="flex items-start"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1 + idx * 0.1, duration: 0.5 }}
                                  >
                                    <div className="bg-accent-custom p-1 rounded-full mr-2 mt-0.5 h-3 w-3 flex items-center justify-center">
                                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                      </svg>
                                    </div>
                                    <span className="text-gray-700 text-xs">{achievement}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </motion.div>
                            
                            {/* Social links */}
                            <motion.div 
                              className="flex space-x-3"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.2 }}
                            >
                              {teamMembers.find(m => m.id === selectedMember)?.social.instagram && (
                                <a href={teamMembers.find(m => m.id === selectedMember)?.social.instagram} className="text-gray-500 hover:text-accent-custom transition-colors">
                                  <FaInstagram className="w-4 h-4" />
                                </a>
                              )}
                              {teamMembers.find(m => m.id === selectedMember)?.social.linkedin && (
                                <a href={teamMembers.find(m => m.id === selectedMember)?.social.linkedin} className="text-gray-500 hover:text-accent-custom transition-colors">
                                  <FaLinkedin className="w-4 h-4" />
                                </a>
                              )}
                              {teamMembers.find(m => m.id === selectedMember)?.social.soundcloud && (
                                <a href={teamMembers.find(m => m.id === selectedMember)?.social.soundcloud} className="text-gray-500 hover:text-accent-custom transition-colors">
                                  <FaSoundcloud className="w-4 h-4" />
                                </a>
                              )}
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
} 