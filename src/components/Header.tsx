/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import logoImage from '../assets/images/logo_nexo_educativo_1780590204486.png';

interface HeaderProps {
  onNavClick: (id: string) => void;
  activeSection: string;
}

export default function Header({ onNavClick, activeSection }: HeaderProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { label: 'Inicio', id: 'inicio' },
    { label: 'Servicios', id: 'servicios' },
    { label: 'Talleres', id: 'talleres' },
    { label: 'Asesor de IA', id: 'counselor' },
    { label: 'Contacto', id: 'contacto' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo and Slogan */}
        <div 
          className="flex cursor-pointer items-center gap-3 transition-transform hover:scale-[1.01]"
          onClick={() => onNavClick('inicio')}
        >
          <img 
            src={logoImage} 
            alt="Nexo Educativo Logo" 
            className="h-12 w-12 rounded-xl object-contain shadow-sm border border-orange-50 bg-white p-0.5"
            referrerPolicy="no-referrer"
          />
          <div>
            <span className="font-display text-xl font-bold tracking-tight text-gray-900">
              NEXO <span className="text-brand-orange-500">EDUCATIVO</span>
            </span>
            <p className="hidden xs:block text-[10px] font-medium text-gray-500 tracking-wide">
              Familia, Escuela y Aprendizaje
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavClick(item.id);
                setIsOpen(false);
              }}
              className={`font-sans text-sm font-medium transition-colors hover:text-brand-orange-500 border-b-2 py-1 ${
                activeSection === item.id
                  ? 'border-brand-orange-500 text-brand-orange-500'
                  : 'border-transparent text-gray-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Desktop Action Banner */}
        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={() => onNavClick('contacto')}
            className="hover:scale-[1.02] cursor-pointer inline-flex items-center justify-center rounded-full bg-brand-orange-500 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-orange-600 shadow-md shadow-brand-orange-500/10"
          >
            Reservar Taller
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span className="sr-only">Abrir menú principal</span>
            {isOpen ? (
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2 shadow-inner" id="mobile-menu">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavClick(item.id);
                setIsOpen(false);
              }}
              className={`block w-full text-left rounded-lg px-4 py-2.5 text-base font-semibold transition-colors ${
                activeSection === item.id
                  ? 'bg-brand-orange-50 text-brand-orange-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-brand-orange-500'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                onNavClick('contacto');
                setIsOpen(false);
              }}
              className="w-full inline-flex items-center justify-center rounded-xl bg-brand-orange-500 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-orange-600"
            >
              Reservar Taller
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
