"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FaUpload, FaLock, FaMusic, FaArrowLeft } from 'react-icons/fa';

export default function UploadPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [beatData, setBeatData] = useState({
    title: '',
    artist: 'Miyamoto',
    category: 'Lo-Fi',
    key: 'Am',
    bpm: 85
  });
  const [file, setFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '4422') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Неверный пароль');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBeatData({
      ...beatData,
      [name]: name === 'bpm' ? parseInt(value) || 0 : value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.name === 'audioFile') {
        setFile(e.target.files[0]);
      } else if (e.target.name === 'coverImage') {
        setCoverImage(e.target.files[0]);
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Пожалуйста, выберите аудиофайл');
      return;
    }

    setUploadStatus('uploading');
    
    // Здесь имитация загрузки
    // В реальном приложении здесь должен быть код для загрузки файла на сервер
    // с использованием FormData и fetch API
    setTimeout(() => {
      setUploadStatus('success');
      
      // Сбросить форму после успешной загрузки
      setTimeout(() => {
        setBeatData({
          title: '',
          artist: 'Miyamoto',
          category: 'Lo-Fi',
          key: 'Am',
          bpm: 85
        });
        setFile(null);
        setCoverImage(null);
        setUploadStatus('idle');
      }, 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="jp-texture flex-grow">
        <section className="jp-section py-12">
          <div className="container-custom">
            <div className="flex items-center mb-8">
              <Link href="/beats" className="text-accent-custom hover:text-accent-light-custom mr-4">
                <FaArrowLeft size={18} />
              </Link>
              <h1 className="jp-heading text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                <span className="text-accent-custom">アップロード</span> UPLOAD BEAT
              </h1>
            </div>
            
            <div className="jp-border bg-primary dark:bg-gray-900 p-6 relative">
              <div className="absolute inset-0 opacity-10 pointer-events-none" 
                   style={{ backgroundImage: 'var(--paper-texture-light)' }}></div>
              
              <div className="relative z-10">
                {!isAuthenticated ? (
                  <div className="max-w-md mx-auto">
                    <div className="flex justify-center mb-6">
                      <div className="bg-accent-custom bg-opacity-10 dark:bg-opacity-20 p-4 rounded-full">
                        <FaLock size={32} className="text-accent-custom" />
                      </div>
                    </div>
                    
                    <h2 className="text-xl text-center font-bold text-gray-900 dark:text-white mb-6">
                      Защищенная страница
                    </h2>
                    
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Введите пароль для доступа
                        </label>
                        <input
                          type="password"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-2 jp-border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-accent-custom transition"
                          placeholder="Пароль"
                          required
                        />
                        {error && <p className="mt-1 text-sm text-accent-custom">{error}</p>}
                      </div>
                      
                      <button 
                        type="submit" 
                        className="w-full jp-button flex items-center justify-center"
                      >
                        <FaLock className="mr-2" />
                        <span>Войти</span>
                      </button>
                    </form>
                  </div>
                ) : (
                  <div>
                    {uploadStatus === 'success' ? (
                      <div className="text-center py-8">
                        <div className="flex justify-center mb-6">
                          <div className="bg-accent-custom bg-opacity-10 dark:bg-opacity-20 p-4 rounded-full">
                            <FaMusic size={32} className="text-accent-custom" />
                          </div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          Бит успешно загружен!
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                          Ваш бит был успешно загружен и будет доступен после проверки.
                        </p>
                        <button 
                          onClick={() => setUploadStatus('idle')}
                          className="jp-button"
                        >
                          Загрузить еще один бит
                        </button>
                      </div>
                    ) : (
                      <div className="max-w-2xl mx-auto">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                          Загрузите новый бит
                        </h2>
                        
                        <form onSubmit={handleUpload} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Название бита *
                              </label>
                              <input
                                type="text"
                                id="title"
                                name="title"
                                value={beatData.title}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 jp-border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-accent-custom transition"
                                placeholder="Tokyo Nights"
                                required
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="artist" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Артист *
                              </label>
                              <input
                                type="text"
                                id="artist"
                                name="artist"
                                value={beatData.artist}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 jp-border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-accent-custom transition"
                                placeholder="Miyamoto"
                                required
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Категория *
                              </label>
                              <select
                                id="category"
                                name="category"
                                value={beatData.category}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 jp-border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-accent-custom transition"
                                required
                              >
                                <option value="Lo-Fi">Lo-Fi</option>
                                <option value="Ambient">Ambient</option>
                                <option value="Chill">Chill</option>
                                <option value="Trap">Trap</option>
                                <option value="Instrumental">Instrumental</option>
                                <option value="Meditation">Meditation</option>
                              </select>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label htmlFor="key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Ключ *
                                </label>
                                <select
                                  id="key"
                                  name="key"
                                  value={beatData.key}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-2 jp-border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-accent-custom transition"
                                  required
                                >
                                  <option value="C">C</option>
                                  <option value="C#">C#</option>
                                  <option value="D">D</option>
                                  <option value="D#">D#</option>
                                  <option value="E">E</option>
                                  <option value="F">F</option>
                                  <option value="F#">F#</option>
                                  <option value="G">G</option>
                                  <option value="G#">G#</option>
                                  <option value="A">A</option>
                                  <option value="A#">A#</option>
                                  <option value="B">B</option>
                                  <option value="Am">Am</option>
                                  <option value="A#m">A#m</option>
                                  <option value="Bm">Bm</option>
                                  <option value="Cm">Cm</option>
                                  <option value="C#m">C#m</option>
                                  <option value="Dm">Dm</option>
                                  <option value="D#m">D#m</option>
                                  <option value="Em">Em</option>
                                  <option value="Fm">Fm</option>
                                  <option value="F#m">F#m</option>
                                  <option value="Gm">Gm</option>
                                  <option value="G#m">G#m</option>
                                </select>
                              </div>
                              
                              <div>
                                <label htmlFor="bpm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  BPM *
                                </label>
                                <input
                                  type="number"
                                  id="bpm"
                                  name="bpm"
                                  value={beatData.bpm}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-2 jp-border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-accent-custom transition"
                                  min="1"
                                  max="300"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="audioFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Аудиофайл (MP3) *
                              </label>
                              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed jp-border bg-white dark:bg-gray-800">
                                <div className="space-y-1 text-center">
                                  <FaMusic className="mx-auto h-12 w-12 text-gray-400" />
                                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                    <label
                                      htmlFor="audioFile"
                                      className="relative cursor-pointer bg-white dark:bg-gray-800 font-medium text-accent-custom hover:text-accent-light-custom focus-within:outline-none"
                                    >
                                      <span>Загрузить файл</span>
                                      <input 
                                        id="audioFile" 
                                        name="audioFile" 
                                        type="file" 
                                        className="sr-only" 
                                        accept=".mp3,.wav" 
                                        onChange={handleFileChange}
                                        required
                                      />
                                    </label>
                                    <p className="pl-1">или перетащите сюда</p>
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    MP3 или WAV до 10MB
                                  </p>
                                  {file && (
                                    <p className="text-xs text-accent-custom truncate">
                                      Выбран: {file.name}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Обложка (опционально)
                              </label>
                              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed jp-border bg-white dark:bg-gray-800">
                                <div className="space-y-1 text-center">
                                  <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                    <label
                                      htmlFor="coverImage"
                                      className="relative cursor-pointer bg-white dark:bg-gray-800 font-medium text-accent-custom hover:text-accent-light-custom focus-within:outline-none"
                                    >
                                      <span>Загрузить изображение</span>
                                      <input 
                                        id="coverImage" 
                                        name="coverImage" 
                                        type="file" 
                                        className="sr-only" 
                                        accept="image/*"
                                        onChange={handleFileChange}
                                      />
                                    </label>
                                    <p className="pl-1">или перетащите сюда</p>
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    PNG, JPG, GIF до 5MB
                                  </p>
                                  {coverImage && (
                                    <p className="text-xs text-accent-custom truncate">
                                      Выбран: {coverImage.name}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <button 
                              type="submit" 
                              className="jp-button w-full flex items-center justify-center"
                              disabled={uploadStatus === 'uploading'}
                            >
                              {uploadStatus === 'uploading' ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Загрузка...
                                </>
                              ) : (
                                <>
                                  <FaUpload className="mr-2" />
                                  Загрузить бит
                                </>
                              )}
                            </button>
                            {error && <p className="mt-2 text-sm text-accent-custom">{error}</p>}
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
} 