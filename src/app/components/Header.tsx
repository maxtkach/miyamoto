"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface NavItem {
  name: string;
  label: string;
  jp: string;
  href: string;
}

const navigation: NavItem[] = [
  { name: 'home', label: 'Home', jp: '本部', href: '/miyamoto/#home' },
  { name: 'sound', label: 'Our Sound', jp: '音', href: '/miyamoto/#sound' },
  { name: 'services', label: 'Services', jp: 'サービス', href: '/miyamoto/#services' },
  { name: 'team', label: 'Team', jp: 'チーム', href: '/miyamoto/#team' },
  { name: 'beats', label: 'Beats', jp: 'ビート', href: '/miyamoto/beats' },
  { name: 'contact', label: 'Contact', jp: 'お問い合わせ', href: '/miyamoto/#contact' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-10 bg-primary bg-opacity-80 backdrop-blur-sm dark:bg-gray-900 dark:bg-opacity-80">
      <div className="container-custom">
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center">
            <Link href="/miyamoto/" className="flex items-center">
              <span className="jp-heading text-3xl font-bold text-gray-900 dark:text-white mr-2">宮本</span>
              <div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">MIYAMOTO</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">SOUNDWORKS</div>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {navigation.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className="group relative"
              >
                <div className="text-sm text-gray-700 dark:text-gray-300 font-medium tracking-wide transition hover:text-accent-custom accent-hover-effect">
                  {item.label}
                </div>
                <div className="jp-heading text-xs text-accent-custom opacity-70 group-hover:opacity-100 transition">
                  {item.jp}
                </div>
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-accent-custom accent-hover-effect dark:hover:text-accent-custom transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open menu</span>
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary dark:bg-gray-900 shadow-lg">
          <div className="container-custom py-6 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="text-base text-gray-700 dark:text-gray-300 font-medium">
                  {item.label}
                </div>
                <div className="jp-heading text-xs text-accent-custom opacity-70">
                  {item.jp}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
} 