/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Icon from './Icon';
import logoImage from '../assets/images/logo_nexo_educativo_1780590204486.png';

interface HeroProps {
  onCTA1Click: () => void; // Contacto
  onCTA2Click: () => void; // AI Consultant
}

export default function Hero({ onCTA1Click, onCTA2Click }: HeroProps) {
  return (
    <section id="inicio" className="relative overflow-hidden bg-gradient-to-b from-brand-orange-50/50 via-brand-sky-50/20 to-white pt-10 pb-16 lg:pt-16 lg:pb-24">
      {/* Decorative colored grid or bubbles in background for playful effect */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-brand-orange-100 to-brand-sky-100 opacity-60 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          
          {/* Text and Primary CTA Column */}
          <div className="col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Friendly Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-orange-100/70 px-4 py-1.5 text-xs sm:text-sm font-semibold text-brand-orange-700 shadow-sm border border-brand-orange-100">
              <span className="flex h-2 w-2 rounded-full bg-brand-orange-500 animate-pulse"></span>
              Capacitación & Consultoría Educativa Profesional
            </div>

            {/* Main Heading highlighting brand message */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Conectando <span className="bg-gradient-to-r from-brand-orange-500 via-brand-yellow-500 to-brand-sky-600 bg-clip-text text-transparent">Escuela, Familia</span> y Aprendizaje.
            </h1>

            {/* Slogan and introduction */}
            <p className="max-w-2xl mx-auto lg:mx-0 text-lg sm:text-xl font-medium text-gray-600 leading-relaxed">
              En <strong className="text-gray-900">Nexo Educativo</strong> construimos puentes sólidos entre padres de familia de educación básica y docentes comprometidos. Impulsamos marcas y escuelas exitosas mediante talleres innovadores, liderazgos efectivos y dinámicas memorables.
            </p>

            {/* Highlighted core experience tag list */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {['Formación Docente', 'Innovación Educativa', 'Acompañamiento Familiar', 'Liderazgo Práctico'].map((tag, i) => (
                <span 
                  key={i} 
                  className="inline-flex items-center gap-1 rounded-lg bg-gray-50 border border-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 shadow-xs"
                >
                  <Icon name="Check" className="h-3 w-3 text-brand-sky-600" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Dual Actions CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={onCTA1Click}
                className="hover:scale-[1.02] cursor-pointer inline-flex items-center justify-center rounded-2xl bg-brand-orange-500 px-8 py-4 text-base font-bold text-white transition-all hover:bg-brand-orange-600 shadow-lg shadow-brand-orange-500/20 gap-2"
              >
                Conocer Talleres
                <Icon name="ArrowRight" className="h-5 w-5" />
              </button>

              <button
                onClick={onCTA2Click}
                className="hover:scale-[1.02] cursor-pointer inline-flex items-center justify-center rounded-2xl bg-white border-2 border-brand-sky-500 text-brand-sky-600 px-8 py-4 text-base font-bold transition-all hover:bg-brand-sky-50 shadow-md gap-2"
              >
                <Icon name="Sparkles" className="h-5 w-5 text-brand-sky-500 animate-spin-slow" />
                Asesorar con IA
              </button>
            </div>

            {/* Social Trust / Statistics summary card */}
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-gray-100 text-center lg:text-left">
              <div>
                <span className="block text-2xl font-extrabold text-gray-900">+1000</span>
                <span className="text-xs font-semibold text-gray-500">Docentes Capacitados</span>
              </div>
              <div className="border-x border-gray-100 px-2">
                <span className="block text-2xl font-extrabold text-gray-900">8</span>
                <span className="text-xs font-semibold text-gray-500">Talleres Listos</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-gray-900">100%</span>
                <span className="text-xs font-semibold text-gray-500">Casos Prácticos</span>
              </div>
            </div>

          </div>

          {/* Right Playful Column with Logo and Floating Cards */}
          <div className="col-span-5 mt-12 lg:mt-0 relative flex justify-center">
            
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center">
              
              {/* Playful concentric decorative circular rings */}
              <div className="absolute inset-0 rounded-full bg-brand-orange-50/80 animate-ping opacity-20" style={{ animationDuration: '6s' }}></div>
              <div className="absolute -inset-4 rounded-full border-2 border-dashed border-brand-sky-100/80 animate-spin-slow"></div>
              <div className="absolute inset-10 rounded-full bg-linear-to-tr from-brand-orange-100/40 to-brand-sky-100/40 border border-white/60 shadow-lg"></div>

              {/* Approachable Branding Logo in center */}
              <div className="relative z-10 w-48 h-48 sm:w-56 sm:h-56 rounded-3xl bg-white flex flex-col items-center justify-center p-6 shadow-2xl border border-gray-50 animate-float">
                <img 
                  src={logoImage} 
                  alt="Nexo Educativo Logo" 
                  className="w-28 h-28 object-contain"
                  referrerPolicy="no-referrer"
                />
                <span className="mt-3 font-display text-lg font-black text-gray-900 tracking-tight text-center">
                  NEXO <span className="text-brand-orange-500ID text-brand-orange-500">EDUCATIVO</span>
                </span>
                <span className="text-[9px] font-bold text-brand-sky-600 text-center uppercase tracking-widest mt-1">
                  Cercano y Humano
                </span>
              </div>

              {/* Floating Card 1: Sinergia Familiar */}
              <div className="absolute -top-4 -left-4 sm:-left-8 z-20 bg-white rounded-xl shadow-lg border border-brand-orange-100 p-3 flex items-center gap-2 max-w-[170px] transform hover:scale-105 transition-transform">
                <div className="w-8 h-8 rounded-lg bg-brand-orange-100 flex items-center justify-center shrink-0">
                  <Icon name="Heart" className="h-4 w-4 text-brand-orange-500" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Acompañamiento</p>
                  <p className="text-xs font-bold text-gray-800">Crianza Positiva</p>
                </div>
              </div>

              {/* Floating Card 2: Liderazgo y Sinergia Escolar */}
              <div className="absolute bottom-4 -right-4 sm:-right-8 z-20 bg-white rounded-xl shadow-lg border border-brand-sky-100 p-3 flex items-center gap-2 max-w-[170px] transform hover:scale-105 transition-transform">
                <div className="w-8 h-8 rounded-lg bg-brand-sky-100 flex items-center justify-center shrink-0">
                  <Icon name="GraduationCap" className="h-4 w-4 text-brand-sky-600" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-brand-sky-500 uppercase tracking-wider">Docentes</p>
                  <p className="text-xs font-bold text-gray-800">Metodologías Activas</p>
                </div>
              </div>

              {/* Floating Card 3: Slogan Bubble */}
              <div className="absolute -bottom-6 left-6 z-20 bg-linear-to-r from-brand-orange-500 to-brand-yellow-500 text-white rounded-xl shadow-md p-2.5 px-3 max-w-[210px] transform hover:scale-105 transition-all text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-brand-orange-50/90">Nuestro Lema</p>
                <p className="text-xs font-semibold italic">"Conexión entre escuela, familia y aprendizaje"</p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
