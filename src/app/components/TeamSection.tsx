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
    image: '/images/team-member-1.jpg',
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
    image: '/images/team-member-2.jpg',
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
          backgroundImage: 'url(/images/ink-brush.svg)',
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
          backgroundImage: 'url(/images/japanese-wave.svg)',
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
                  className="relative"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ 
                    opacity: loaded ? 1 : 0, 
                    y: loaded ? 0 : 50,
                    scale: hoveredMember === member.id ? 1.05 : 1,
                    boxShadow: hoveredMember === member.id ? "0px 10px 30px rgba(0, 0, 0, 0.15)" : "0px 5px 15px rgba(0, 0, 0, 0.05)"
                  }}
                  transition={{ 
                    delay: index * 0.2,
                    duration: 0.8,
                    ease: [0.23, 1, 0.32, 1]
                  }}
                  style={{ 
                    perspective: '1000px'
                  }}
                  whileHover={{ scale: 1.03 }}
                >
                  <div 
                    className="team-card relative bg-background shadow-xl rounded-lg overflow-hidden cursor-pointer color-gray-50"
                    style={{ 
                      transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
                    }}
                    onMouseEnter={() => setHoveredMember(member.id)}
                    onMouseLeave={() => setHoveredMember(null)}
                    onClick={() => handleSelectMember(member.id)}
                  >
                    <div className="md:flex">
                      {/* Image section with parallax effect */}
                      <div className="md:w-2/5 relative overflow-hidden">
                        <div 
                          className="h-72 md:h-full w-full"
                          style={{
                            backgroundImage: `url(${member.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            transform: hoveredMember === member.id ? 'scale(1.1)' : 'scale(1)',
                            transition: 'all 0.7s cubic-bezier(0.23, 1, 0.32, 1)'
                          }}
                        />
                        
                        {/* Overlay with gradient */}
                        <div 
                          className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
                          style={{
                            opacity: hoveredMember === member.id ? 0.8 : 0.5,
                            transition: 'opacity 0.5s ease'
                          }}
                        />
                        
                        {/* Japanese seal */}
                        <div 
                          className="hanko-seal absolute top-4 right-4 z-10"
                          style={{
                            transform: hoveredMember === member.id ? 'rotate(15deg) scale(1.2)' : 'rotate(0deg) scale(1)',
                            transition: 'all 0.5s ease'
                          }}
                        >
                          <span className="text-3xl">{member.seal}</span>
                        </div>
                      </div>
                      
                      {/* Content section */}
                      <div className="md:w-3/5 p-6 md:p-8 relative">
                        <div className="absolute top-3 right-3 h-16 w-16 border-t border-r border-accent-custom opacity-30" />
                        <div className="absolute bottom-3 left-3 h-16 w-16 border-b border-l border-accent-custom opacity-30" />
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
                        <p className="jp-heading text-accent-custom text-sm mb-2">{member.jpRole}</p>
                        <p className="text-gray-700 text-sm font-medium mb-4">{member.role}</p>
                        
                        <div className="h-px w-full bg-gray-200 mb-4">
                          <div className="h-full w-1/3 bg-accent-custom" />
                        </div>
                        
                        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                          {member.bio}
                        </p>
                        
                        {/* Skills preview */}
                        <div className="mt-4 space-y-2">
                          {member.skills.slice(0, 2).map((skill, idx) => (
                            <div key={idx} className="flex items-center">
                              <span className="text-xs text-gray-700 w-1/3">{skill.name}</span>
                              <div className="w-2/3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full bg-accent-custom"
                                  initial={{ width: 0 }}
                                  animate={{ width: hoveredMember === member.id ? `${skill.level}%` : '0%' }}
                                  transition={{ delay: 0.3 + idx * 0.1, duration: 1, ease: "easeOut" }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* View Profile button */}
                        <motion.div 
                          className="mt-4 flex justify-end"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: hoveredMember === member.id ? 1 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="jp-button-alt text-xs inline-flex items-center">
                            <span>VIEW PROFILE</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </motion.div>
                      </div>
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
                                <div className="absolute -top-2 -left-2 text-3xl text-accent-custom opacity-20">"</div>
                                <div className="relative z-10">
                                  {teamMembers.find(m => m.id === selectedMember)?.quote}
                                </div>
                                <div className="absolute -bottom-2 -right-2 text-3xl text-accent-custom opacity-20">"</div>
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