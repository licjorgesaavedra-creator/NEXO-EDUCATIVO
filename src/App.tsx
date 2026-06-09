/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WORKSHOPS, SERVICES } from './data';
import { Workshop } from './types';
import Icon from './components/Icon';
import logoImage from './assets/images/logo_nexo_educativo_1780590204486.png';
import { generateWorkshopBrochure } from './utils/pdfGenerator';

export default function App() {
  // Navigation active tab
  const [activeSection, setActiveSection] = useState('inicio');

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Workshop Category Filter state
  const [categoryFilter, setCategoryFilter] = useState<'Todos' | 'Padres de Familia' | 'Formación Escuela-Familia'>('Todos');

  // Privacy Notice state
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Terms of Service state
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  // Detailed Modal/Drawer state
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);

  // PDF Brochure preview state
  const [previewWorkshopPdf, setPreviewWorkshopPdf] = useState<Workshop | null>(null);

  // PDF Brochure simulated generation states
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfGenStep, setPdfGenStep] = useState(0); // 0 = pre, 1 = structure, 2 = layout, 3 = download

  const handleDownloadPdf = (workshop: Workshop) => {
    setIsGeneratingPdf(true);
    setPdfGenStep(0);
    
    // Step 0 -> Step 1 (600ms)
    setTimeout(() => {
      setPdfGenStep(1);
      
      // Step 1 -> Step 2 (700ms)
      setTimeout(() => {
        setPdfGenStep(2);
        
        // Step 2 -> Step 3 (800ms)
        setTimeout(() => {
          setPdfGenStep(3);
          
          // Generate and save the real PDF
          try {
            generateWorkshopBrochure(workshop);
          } catch (err) {
            console.error('Error generating real PDF:', err);
          }
          
          // Reset states after complete (600ms after download start)
          setTimeout(() => {
            setIsGeneratingPdf(false);
            setPdfGenStep(0);
            setPreviewWorkshopPdf(null);
          }, 600);
          
        }, 800);
      }, 700);
    }, 600);
  };

  // Private Strategic Portal States
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem('nexo_strategic_unlocked') === 'true';
  });
  const [isPrivatePanelOpen, setIsPrivatePanelOpen] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('nexo_checked_steps');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Business strategy custom settings
  const [calcSchools, setCalcSchools] = useState(3);
  const [calcTicket, setCalcTicket] = useState(12500);
  const [pitchTopic, setPitchTopic] = useState('frustrated');
  const [pitchSchoolType, setPitchSchoolType] = useState('preescolar');
  const [activeStratTab, setActiveStratTab] = useState('naming'); // naming, valueprop, checklist, leads
  const [isCopied, setIsCopied] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Pendiente' | 'Contactado' | 'Finalizado'>('Todos');

  // Leads/Registrations Database State
  const [contactLeads, setContactLeads] = useState<{
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    workshopId: string;
    message: string;
    date: string;
    status: 'Pendiente' | 'Contactado' | 'Finalizado';
    notes?: string;
  }[]>(() => {
    try {
      const stored = localStorage.getItem('nexo_contact_leads');
      if (stored) {
        // Ensure old stored leads have a status and notes set
        const parsed = JSON.parse(stored);
        const migrated = parsed.map((l: any) => ({
          ...l,
          status: l.status || 'Pendiente',
          notes: l.notes || ''
        }));
        return migrated;
      }
      
      // Pre-populate with 2 realistic pedagogical demo inquiries
      const demoLeads = [
        {
          id: 'demo-1',
          name: 'Dra. Patricia Garza (Colegio Montesión)',
          email: 'patricia.garza@montesion.edu.mx',
          phone: '+52 81 8356 4410',
          role: 'director',
          workshopId: 'limites-disciplina-positiva',
          message: 'Me interesa cotizar el taller de Disciplina Positiva y Límites con Amor de forma presencial para el inicio de ciclo escolar. Contamos con unos 120 padres de familia interesados.',
          date: new Date(Date.now() - 3600000 * 4).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }),
          status: 'Pendiente' as const,
          notes: 'Nota: Contactar de preferencia por teléfono por las mañanas. Muy interesada en agendar para agosto de 2026.'
        },
        {
          id: 'demo-2',
          name: 'Prof. Bernardo Treviño',
          email: 'bernardo.trevino@outlook.com',
          phone: '+52 33 1240 9855',
          role: 'teacher',
          workshopId: 'habitos-estudio-casa',
          message: 'Tenemos problemas en las tardes con el desborde con las tareas. Quisiera saber si la conferencia de Hábitos de Estudio sin Lágrimas se puede adaptar para docentes también.',
          date: new Date(Date.now() - 3600000 * 22).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }),
          status: 'Contactado' as const,
          notes: 'Nota: Enviada información general por correo el día de ayer. Pendiente de su confirmación.'
        }
      ];
      localStorage.setItem('nexo_contact_leads', JSON.stringify(demoLeads));
      return demoLeads;
    } catch {
      return [];
    }
  });

  const hasPendingLeads = contactLeads.some(l => l.status === 'Pendiente');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'parent', // parent, teacher, director
    workshopId: '',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Filtered workshops based on search and category tab
  const filteredWorkshops = WORKSHOPS.filter(ws => {
    const matchesSearch = ws.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ws.slogan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ws.description.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (categoryFilter === 'Todos') return true;

    const isEscuelaFamilia = ws.id === 'liderazgo-colaborativo-escuela' || ws.id === 'alianza-escuela-hogar-acuerdos';
    if (categoryFilter === 'Formación Escuela-Familia') {
      return isEscuelaFamilia;
    } else if (categoryFilter === 'Padres de Familia') {
      return !isEscuelaFamilia;
    }
    return true;
  });

  // Submit Contact Inquiry
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    // Validate email format in real-time
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    if (!isEmailValid) return;

    // Create a new lead item
    const newLead = {
      id: Math.random().toString(36).substring(2, 9),
      name: formData.name,
      email: formData.email,
      phone: formData.phone || 'No especificado',
      role: formData.role,
      workshopId: formData.workshopId || 'General',
      message: formData.message || 'Sin mensaje adicional.',
      date: new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }),
      status: 'Pendiente' as const,
      notes: ''
    };

    const updatedLeads = [newLead, ...contactLeads];
    setContactLeads(updatedLeads);
    localStorage.setItem('nexo_contact_leads', JSON.stringify(updatedLeads));

    // Simulate direct dispatch
    setFormSubmitted(true);
  };

  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [aiReplyDrafts, setAiReplyDrafts] = useState<Record<string, string>>({});
  const [generatingReplyForId, setGeneratingReplyForId] = useState<string | null>(null);

  const handleGenerateAiReply = async (lead: any) => {
    setGeneratingReplyForId(lead.id);
    try {
      const response = await fetch('/api/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead })
      });
      const data = await response.json();
      if (data.text) {
        setAiReplyDrafts(prev => ({ ...prev, [lead.id]: data.text }));
      } else if (data.error) {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión con el servidor de Nexo Educativo.');
    } finally {
      setGeneratingReplyForId(null);
    }
  };

  const handleSaveLeadNotes = (leadId: string, notes: string) => {
    const updated = contactLeads.map(l => l.id === leadId ? { ...l, notes } : l);
    setContactLeads(updated);
    localStorage.setItem('nexo_contact_leads', JSON.stringify(updated));
  };

  const handleDeleteLead = (leadId: string) => {
    const updated = contactLeads.filter(l => l.id !== leadId);
    setContactLeads(updated);
    localStorage.setItem('nexo_contact_leads', JSON.stringify(updated));
  };

  const handleChangeLeadStatus = (leadId: string, newStatus: 'Pendiente' | 'Contactado' | 'Finalizado') => {
    const updated = contactLeads.map(l => l.id === leadId ? { ...l, status: newStatus } : l);
    setContactLeads(updated);
    localStorage.setItem('nexo_contact_leads', JSON.stringify(updated));
  };

  const handleClearAllLeads = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar todas las solicitudes registradas?')) {
      setContactLeads([]);
      localStorage.setItem('nexo_contact_leads', JSON.stringify([]));
    }
  };

  // Pre-fill form selection when clicking "Reservar/Interesado" on a workshop
  const handleSelectWorkshopForForm = (wsId: string) => {
    setFormData(prev => ({ ...prev, workshopId: wsId }));
    const formSection = document.getElementById('contacto');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle Login authentication
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passcode.trim().replace(/[\s+-]/g, ''); // strip spaces, dashes, + signs
    if (cleanPass === '3318286167' || cleanPass === '523318286167' || passcode.toLowerCase().trim() === 'jorge33' || passcode.toLowerCase().trim() === 'nexo2026') {
      setIsUnlocked(true);
      localStorage.setItem('nexo_strategic_unlocked', 'true');
      setShowLoginModal(false);
      setLoginError(null);
      setIsPrivatePanelOpen(true);
      setPasscode('');
    } else {
      setLoginError('Código incorrecto. Utiliza tu número de celular registrado (+52 33 1828 6167) o las claves "jorge33" o "nexo2026" para verificar.');
    }
  };

  // Toggle checklist steps
  const handleToggleStep = (stepId: string) => {
    const updated = checkedSteps.includes(stepId)
      ? checkedSteps.filter(id => id !== stepId)
      : [...checkedSteps, stepId];
    setCheckedSteps(updated);
    localStorage.setItem('nexo_checked_steps', JSON.stringify(updated));
  };

  // Reset unlock state
  const handleLockSession = () => {
    setIsUnlocked(false);
    localStorage.removeItem('nexo_strategic_unlocked');
    setIsPrivatePanelOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      
      {/* EXCLUSIVE FULL-WIDTH HORIZONTAL BRANDING STRIP (Franja de Poder Nexo) */}
      <div className="w-full bg-gradient-to-b from-white to-slate-50/50 border-b border-slate-200/80 relative overflow-hidden py-9 sm:py-12 shadow-2xs select-none">
        {/* Upper colored accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-orange-500 via-brand-yellow-400 to-brand-blue-500"></div>
        
        {/* Ambient backlight glow blobs for rich institutional presentation */}
        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-orange-500/5 blur-3xl pointer-events-none"></div>
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-blue-500/5 blur-3xl pointer-events-none"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          
          {/* Main Visual Group */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left w-full lg:w-auto">
            {/* Massive branding frame wrapping the logo horizontally (spanning a high-power strip) */}
            <div 
              onClick={() => handleNavClick('inicio')}
              className="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-white rounded-[32px] flex items-center justify-center border-2 border-slate-200 shadow-xl p-3 shrink-0 cursor-pointer transition-all duration-300 hover:scale-105 active:scale-98 relative group ring-6 ring-slate-100/30 font-sans"
            >
              <img 
                src={logoImage} 
                alt="Logo Nexo Educativo" 
                className="w-full h-full object-contain p-1 filter drop-shadow-sm select-none"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1.5 bg-brand-orange-500 text-white font-extrabold text-[8px] uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-xs group-hover:bg-brand-blue-500 transition-colors">
                CONEXIÓN FAMILIAR
              </span>
            </div>

            {/* Powerful Messaging Column */}
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue-50 border border-brand-blue-100 rounded-full text-brand-blue-700 tracking-wider text-[10px] sm:text-xs font-black uppercase font-sans">
                ★ MODELO DE CRECIMIENTO PEDAGÓGICO INTEGRAL
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-none uppercase">
                NEXO <span className="text-brand-blue-500">EDUCATIVO</span>
              </h1>
              <p className="text-slate-650 font-bold text-xs sm:text-sm md:text-base leading-relaxed tracking-normal font-sans">
                Acompañamiento profesional y talleres curriculares personalizados de alta trascendencia para <span className="text-brand-orange-600 font-extrabold underline decoration-brand-orange-200 underline-offset-4">familias, docentes y centros escolares</span>.
              </p>
            </div>
          </div>

          {/* Right Floating Presentational Panel (increases architectural layout power) */}
          <div className="hidden lg:flex flex-col items-end text-right max-w-xs space-y-2.5 shrink-0">
            <div className="bg-white border-2 border-slate-150 p-4.5 rounded-2xl shadow-sm space-y-2 relative">
              <div className="absolute top-0 right-6 translate-y-[-50%] bg-brand-yellow-400 text-slate-950 text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shadow-2xs font-sans">
                ESTRATEGIA 2026
              </div>
              <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-sans">Nuestra Sinergia</h4>
              <p className="text-[10px] font-bold text-slate-650 leading-relaxed font-sans">
                Fortalecemos la alianza clave entre <span className="text-brand-blue-600">Escuela y Hogar</span> para edificar entornos de aprendizaje de alto impacto y disciplina con amor.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* HEADER SECTION - Beautiful Modern Design */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 p-4 shadow-sm">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo & Headline */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => handleNavClick('inicio')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-2xs overflow-hidden shrink-0 transition-transform duration-200 hover:scale-105 active:scale-95">
              <img 
                src={logoImage} 
                alt="Logo Nexo" 
                className="w-full h-full object-contain p-0.5"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-md sm:text-lg font-black tracking-tight leading-none text-slate-900 uppercase">
                NEXO <span className="text-brand-blue-500 font-extrabold">EDUCATIVO</span>
              </h2>
              <span className="text-[9px] font-black text-brand-orange-600 tracking-wider uppercase block mt-0.5 font-sans">
                Acompañamiento Familiar
              </span>
            </div>
          </div>
          
          {/* Nav pills */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-full">
            {[
              { label: 'Inicio', id: 'inicio' },
              { label: 'Servicios', id: 'servicios' },
              { label: 'Talleres', id: 'talleres' },
              { label: 'Inscripciones', id: 'contacto' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all duration-200 cursor-pointer ${
                  activeSection === item.id
                    ? 'bg-brand-blue-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Quick CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <span className="text-xs font-semibold bg-brand-green-50 text-brand-green-700 px-3 py-1 rounded-full border border-brand-green-150">
              ★ Consultoría Familiar Real
            </span>
            <div className="relative flex items-center gap-1.5">
              <button 
                onClick={() => isUnlocked ? setIsPrivatePanelOpen(true) : setShowLoginModal(true)}
                className="p-2.5 bg-slate-50 border border-slate-205 hover:bg-slate-100 hover:border-slate-300 text-slate-500 hover:text-brand-blue-500 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center shadow-2xs relative"
                title="Panel Estratégico Fundador"
              >
                <Icon name="Compass" className="h-4 w-4" />
                {hasPendingLeads && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 border border-white"></span>
                  </span>
                )}
              </button>
              {hasPendingLeads && (
                <button 
                  onClick={() => isUnlocked ? setIsPrivatePanelOpen(true) : setShowLoginModal(true)}
                  className="hidden xl:inline-flex items-center gap-1 py-1 px-2.5 bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-black uppercase tracking-wider rounded-full cursor-pointer animate-pulse hover:bg-rose-100 transition-colors"
                  title="Hay nuevas solicitudes de asesoría pendientes"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  Nuevas Solicitudes
                </button>
              )}
            </div>
            <button 
              onClick={() => handleNavClick('contacto')}
              className="bg-brand-blue-500 hover:bg-brand-blue-600 text-white px-5 py-2 rounded-full font-bold text-xs shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer"
            >
              Contactar
            </button>
          </div>

        </div>
      </header>

      {/* CORE HERO SECTION */}
      <section id="inicio" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Modern Welcomer Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Identity & Professional Card (col-span-4) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 p-8 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
            
            {/* Background geometric accents */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-blue-50/50 rounded-full pointer-events-none"></div>

            <div>
              {/* Badge */}
              <div className="bg-brand-blue-50 text-brand-blue-700 text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full mb-6 inline-block">
                Fundadora Especialista
              </div>

              {/* Logo / Founder Circle Card */}
              <div className="w-36 h-36 bg-white border border-slate-200 rounded-3xl mb-6 overflow-hidden shadow-md flex items-center justify-center p-2.5 shrink-0 transition-transform duration-300 hover:scale-105">
                <img 
                  src={logoImage} 
                  alt="Nexo" 
                  className="w-full h-full object-contain filter drop-shadow-sm" 
                  referrerPolicy="no-referrer"
                />
              </div>

              <h2 className="text-xl font-extrabold text-slate-905 leading-tight mb-2 tracking-tight">EXPERIENCIA E IMPACTO</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 italic p-3.5 bg-slate-50 rounded-2xl border border-slate-100/70">
                "Mi meta es guiar el acompañamiento y crecimiento a padres de familia y escuelas, dotando de hábitos sólidos y disciplina amorosa."
              </p>

              {/* Strengths labels list */}
              <div className="mt-4 space-y-2.5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Mi Especialidad:</p>
                {[
                  { text: 'Orientación y Formación para Padres de Familia', color: 'bg-brand-orange-50 text-[#c2410c]' },
                  { text: 'Liderazgo Parental y Gestión de Límites', color: 'bg-brand-blue-50 text-[#0369a1]' },
                  { text: 'Fortalecimiento de la Alianza Escuela-Hogar', color: 'bg-brand-green-50 text-[#047857]' },
                  { text: 'Formación de Hábitos, Responsabilidad y Autonomía', color: 'bg-slate-100 text-slate-700' }
                ].map((st, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 bg-brand-blue-500 rounded-full flex-shrink-0 animate-ping"></span>
                    <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${st.color} shadow-2xs`}>
                      {st.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-slate-900 font-extrabold text-3xl leading-none">+15</p>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-1">Años conectando hogares</p>
              </div>
              <button 
                onClick={() => handleNavClick('contacto')}
                className="bg-brand-orange-500 hover:bg-brand-orange-600 text-white px-4 py-2 rounded-full font-bold text-xs shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer"
              >
                Inscribirme
              </button>
            </div>

          </div>

          {/* Slogan and Value Proposition Box (col-span-8) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 p-8 sm:p-10 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300">
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-orange-50 px-4 py-1.5 text-xs font-bold text-[#c2410c] border border-brand-orange-100">
                <span className="flex h-2 w-2 rounded-full bg-brand-orange-500 animate-pulse"></span>
                Tres Dimensiones de Impacto Real
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight uppercase">
                DISEÑANDO ESPACIOS DE <span className="text-brand-blue-500 underline decoration-2 decoration-brand-blue-100 underline-offset-4">CONEXIÓN</span> Y <span className="text-brand-green-500 underline decoration-2 decoration-brand-green-100 underline-offset-4 font-extrabold">CRECIMIENTO</span> FAMILIAR.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
                Soy una profesional con amplia experiencia en la educación básica. Mi objetivo es acompañarte a consolidar una <strong className="font-bold text-slate-800">ruta formativa de excelencia</strong>. Generamos impacto real mediante conferencias llenas de emoción, talleres interactivos y asesorías prácticas que dinamizan la crianza positiva en casa.
              </p>

              {/* Playful Interactive Info Cards within Hero - Triple dimensions representing the logo! */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                
                <div className="bg-brand-blue-50/50 border border-brand-blue-100 p-4 rounded-2xl flex flex-col justify-between hover:bg-brand-blue-50 transition-colors">
                  <div className="flex gap-2.5 items-start">
                    <div className="w-8 h-8 bg-brand-blue-500 rounded-xl flex items-center justify-center shrink-0">
                      <Icon name="BookOpen" className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-brand-blue-700 uppercase">Orientación</h3>
                      <p className="text-[10px] text-slate-500 mt-1 font-semibold leading-normal">Círculo Azul: Hábitos, rutinas y organización escolar saludable.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-orange-50/50 border border-brand-orange-100 p-4 rounded-2xl flex flex-col justify-between hover:bg-brand-orange-50 transition-colors">
                  <div className="flex gap-2.5 items-start">
                    <div className="w-8 h-8 bg-brand-orange-500 rounded-xl flex items-center justify-center shrink-0">
                      <Icon name="Heart" className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-brand-orange-700 uppercase">Acompañamiento</h3>
                      <p className="text-[10px] text-slate-500 mt-1 font-semibold leading-normal">Círculo Naranja: Disciplina con respeto, firmeza amorosa y asertividad.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-green-50/50 border border-brand-green-100 p-4 rounded-2xl flex flex-col justify-between hover:bg-brand-green-50 transition-colors">
                  <div className="flex gap-2.5 items-start">
                    <div className="w-8 h-8 bg-brand-green-500 rounded-xl flex items-center justify-center shrink-0">
                      <Icon name="Compass" className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-brand-green-700 uppercase">Crecimiento</h3>
                      <p className="text-[10px] text-slate-500 mt-1 font-semibold leading-normal">Círculo Verde: Liderazgo positivo e involucramiento activo de padres.</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Interaction Area */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <p className="text-xs font-semibold text-slate-400 tracking-wide text-center sm:text-left">
                ✨ Elige un taller vivencial o envíanos un mensaje directo para programar una consultoría en tu escuela.
              </p>
              <div className="flex gap-2 shrink-0">
                <button 
                  onClick={() => handleNavClick('talleres')}
                  className="bg-brand-blue-500 hover:bg-brand-blue-600 text-white rounded-full px-5 py-2.5 text-xs font-bold uppercase shadow-xs transition-all cursor-pointer"
                >
                  Explorar Talleres
                </button>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ADDITIONAL SERVICES SECTION */}
      <section id="servicios" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-24">
        
        {/* Title */}
        <div className="text-center space-y-3 mb-12">
          <span className="font-bold uppercase text-xs tracking-widest text-brand-blue-600 bg-brand-blue-50/85 px-4.5 py-1.5 rounded-full border border-brand-blue-100 shadow-2xs">
            Nuestros Caminos de Excelencia
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 uppercase tracking-tight">
            Servicios de Consultoría y Orientación
          </h2>
          <p className="text-sm font-semibold text-slate-505 max-w-xl mx-auto">
            Acompañamos hogares e instituciones a consolidar vínculos inquebrantables con metodologías dinámicas y herramientas vivenciales.
          </p>
        </div>

        {/* Services Elegant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {SERVICES.map((srv, index) => {
            const colors = [
              { bg: 'bg-white', accentCat: 'bg-brand-blue-500', icon: 'text-white border-brand-blue-100', text: 'text-brand-blue-800' },
              { bg: 'bg-white', accentCat: 'bg-brand-orange-500', icon: 'text-white border-brand-orange-100', text: 'text-[#ea580c]' },
              { bg: 'bg-white', accentCat: 'bg-brand-green-500', icon: 'text-white border-brand-green-100', text: 'text-brand-green-800' },
            ];
            const designPreset = colors[index % colors.length];

            return (
              <div 
                key={srv.id}
                className={`${designPreset.bg} border border-slate-200/80 rounded-3xl p-8 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between`}
              >
                <div>
                  {/* Header Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 ${designPreset.accentCat} rounded-2xl flex items-center justify-center shadow-xs`}>
                      <Icon name={srv.iconName} className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-100">
                      Nexo Premium
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 mb-3 tracking-tight">{srv.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6 font-medium">{srv.description}</p>
                  
                  {/* Benefits mini bullets */}
                  <div className="border-t border-slate-100 pt-5 space-y-3">
                    {srv.benefits.map((bn, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2.5 text-[12px] font-semibold text-slate-600">
                        <span className="text-brand-blue-500 font-extrabold shrink-0">✓</span>
                        <span>{bn}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-slate-100">
                  <button 
                    onClick={() => {
                      setFormData(prev => ({ ...prev, message: `Hola, estoy interesado en el servicio de ${srv.title}.` }));
                      handleNavClick('contacto');
                    }}
                    className="w-full text-center bg-slate-50 hover:bg-slate-150 text-slate-700 rounded-full py-2.5 text-xs font-bold uppercase transition-colors tracking-wider border border-slate-205 cursor-pointer"
                  >
                    Solicitar Información
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* OUR VALUES SECTION */}
      <section id="valores" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-24">
        
        {/* Title */}
        <div className="text-center space-y-3 mb-12">
          <span className="font-bold uppercase text-xs tracking-widest text-brand-orange-600 bg-brand-orange-50 px-4.5 py-1.5 rounded-full border border-brand-orange-100 shadow-2xs">
            Filosofía Nexo
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 uppercase tracking-tight">
            Nuestros Valores
          </h2>
          <p className="text-sm font-semibold text-slate-500 max-w-xl mx-auto">
            Los pilares fundamentales que guían nuestro acompañamiento y transforman las comunidades educativas en México.
          </p>
        </div>

        {/* 3 Columns Bento Grid for Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Cercanía Humana */}
          <div className="bg-white border border-slate-200/85 p-8 rounded-3xl shadow-2xs hover:shadow-sm transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform duration-300">
                <Icon name="Heart" className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                Cercanía Humana
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                Compromiso con el acompañamiento cálido, empático y contextualizado de cada maestro, directivo y padre de familia.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-100">
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-wider">
                Acompañamiento Empático
              </span>
            </div>
          </div>

          {/* Innovación Significativa */}
          <div className="bg-white border border-slate-200/85 p-8 rounded-3xl shadow-2xs hover:shadow-sm transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform duration-300">
                <Icon name="Sparkles" className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                Innovación Significativa
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                Promoción de metodologías del siglo XXI (ABP, Neuroeducación, Tecnología) adaptadas a la realidad de las aulas de México.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-100">
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">
                Pedagogía del Siglo XXI
              </span>
            </div>
          </div>

          {/* Colaboración Sistémica */}
          <div className="bg-white border border-slate-200/85 p-8 rounded-3xl shadow-2xs hover:shadow-sm transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-sky-50 border border-sky-100 rounded-2xl flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform duration-300">
                <Icon name="Users2" className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                Colaboración Sistémica
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                Entendimiento de que la verdadera calidad educativa se logra cuando cooperan armónicamente directivos, docentes y familias.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-100">
              <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-wider">
                Sinergia Educativa
              </span>
            </div>
          </div>

        </div>

      </section>

      {/* MASTER WORKSHOPS SECTION */}
      <section id="talleres" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-24">
        
        {/* Header container */}
        <div className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase bg-brand-orange-50 text-brand-orange-700 border border-brand-orange-100 px-3.5 py-1.5 rounded-full shadow-2xs">
                Catálogo de Soluciones Prácticas
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 uppercase leading-tight tracking-tight">
                Talleres de Alto Impacto
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-500">
                Ofrecemos talleres especializados de aplicación inmediata para padres de familia y acompañamiento estratégico en el hogar.
              </p>
            </div>

            {/* Search tool block */}
            <div className="w-full lg:w-auto relative max-w-md">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
                <Icon name="Search" className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Buscar tema, palabras clave..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-72 bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-full text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-blue-500 hover:border-slate-300 transition-colors"
              />
            </div>

          </div>
        </div>

        {/* Category Filter Tab Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-10 bg-slate-50 border border-slate-200/80 p-2 rounded-2xl max-w-3xl">
          {[
            { id: 'Todos', label: 'Todos los Talleres', count: WORKSHOPS.length },
            { 
              id: 'Padres de Familia', 
              label: 'Padres de Familia', 
              count: WORKSHOPS.filter(ws => !(ws.id === 'liderazgo-colaborativo-escuela' || ws.id === 'alianza-escuela-hogar-acuerdos')).length 
            },
            { 
              id: 'Formación Escuela-Familia', 
              label: 'Formación Escuela-Familia', 
              count: WORKSHOPS.filter(ws => (ws.id === 'liderazgo-colaborativo-escuela' || ws.id === 'alianza-escuela-hogar-acuerdos')).length 
            }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id as any)}
              className={`flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-wide cursor-pointer focus:outline-none ${
                categoryFilter === tab.id
                  ? 'bg-brand-blue-500 text-white shadow-md border border-brand-blue-600 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100 border border-transparent'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                categoryFilter === tab.id 
                  ? 'bg-brand-blue-600 text-white' 
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Workshops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredWorkshops.map(ws => (
            <div 
              key={ws.id}
              className="bg-white border border-slate-200/85 p-8 rounded-3xl shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-4">
                  <span className={`text-[10px] font-bold border px-3 py-1 rounded-full ${
                    ws.id === 'liderazgo-colaborativo-escuela' || ws.id === 'alianza-escuela-hogar-acuerdos'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-2xs'
                      : 'bg-brand-orange-50 text-brand-orange-700 border border-brand-orange-100'
                  }`}>
                    {ws.id === 'liderazgo-colaborativo-escuela' || ws.id === 'alianza-escuela-hogar-acuerdos'
                      ? 'FORMACIÓN ESCUELA-FAMILIA'
                      : 'FORMACIÓN FAMILIAR'}
                  </span>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    ws.id === 'liderazgo-colaborativo-escuela' || ws.id === 'alianza-escuela-hogar-acuerdos'
                      ? 'bg-indigo-50/80 border border-indigo-100/55'
                      : 'bg-brand-orange-50'
                  }`}>
                    <Icon 
                      name={ws.iconName} 
                      className={`h-5 w-5 ${
                        ws.id === 'liderazgo-colaborativo-escuela' || ws.id === 'alianza-escuela-hogar-acuerdos'
                          ? 'text-indigo-600'
                          : 'text-brand-orange-600'
                      }`} 
                    />
                  </div>
                </div>

                <h4 className="font-extrabold text-xl text-slate-900 leading-snug mb-1 tracking-tight">{ws.title}</h4>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 italic">{ws.slogan}</p>
                
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium mb-6">{ws.description}</p>
              </div>

              <div className="border-t border-slate-100 pt-5 flex items-center justify-between mt-auto">
                <button
                  onClick={() => setSelectedWorkshop(ws)}
                  className="text-xs font-bold text-brand-blue-500 hover:text-brand-blue-600 transition-colors uppercase tracking-wider"
                >
                  Ver programa completo →
                </button>
                <button
                  onClick={() => handleSelectWorkshopForForm(ws.id)}
                  className="bg-brand-blue-500 hover:bg-brand-blue-600 text-white text-[11px] font-bold uppercase tracking-wide px-4.5 py-2.5 rounded-full shadow-xs hover:shadow-sm transition-all cursor-pointer"
                >
                  Me interesa
                </button>
              </div>
            </div>
          ))}

          {filteredWorkshops.length === 0 && (
            <div className="col-span-1 md:col-span-2 text-center py-10 bg-slate-100 rounded-3xl border border-dashed border-slate-200">
              <p className="text-xs sm:text-sm text-slate-405 font-semibold italic">No se encontraron talleres con esos términos de búsqueda.</p>
            </div>
          )}
        </div>

      </section>

      {/* DYNAMIC REGISTRATION AND INFORMATION REQUEST FORM */}
      <section id="contacto" className="mx-auto max-w-4xl px-4 sm:px-6 mt-20">
        
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
          
          <div className="text-center space-y-2 mb-10">
            <span className="text-brand-blue-700 text-xs bg-brand-blue-50/80 border border-brand-blue-100 uppercase font-bold px-4 py-1.5 rounded-full inline-block">
              ¿Listo para Agendar o Solicitar Información?
            </span>
            <h3 className="text-3xl font-extrabold text-slate-950 uppercase tracking-tight">
              Registra tu interés o solicita asesoría
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 max-w-md mx-auto">
              Compártenos de qué forma podemos apoyarte a potenciar la crianza y el estudio autónomo en tu hogar. Te contactamos en un plazo máximo de 24 horas hábiles.
            </p>
          </div>

          {formSubmitted ? (
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] p-8 rounded-3xl text-center space-y-5 shadow-xs">
              <div className="w-14 h-14 bg-[#4ade80] rounded-full flex items-center justify-center mx-auto shadow-2xs">
                <Icon name="Check" className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-xl font-extrabold text-slate-900 uppercase">¡Registro recibido con éxito!</h4>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                Hemos recibido tus datos con atención. Te guiaremos personalmente para revisar los pormenores del taller o servicio solicitado. ¡Gracias por confiar en Nexo Educativo!
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="bg-brand-blue-500 hover:bg-brand-blue-600 text-white px-6 py-2 rounded-full text-xs font-bold transition-all"
              >
                Enviar nueva solicitud
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-slate-500">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="ej. Mtra. Sofía Rodríguez o Carlos Pérez"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-blue-500 rounded-xl px-4 py-3 text-xs font-semibold focus:bg-white focus:outline-none transition-colors duration-200 text-slate-800"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-slate-500">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="ej. carlos.perez@dominio.com"
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-xs font-semibold focus:bg-white focus:outline-none transition-all duration-200 text-slate-800 ${
                      formData.email !== ''
                        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
                          ? 'border-emerald-500 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500/20 bg-emerald-50/5'
                          : 'border-rose-500 focus:border-rose-600 focus:ring-1 focus:ring-rose-500/20 bg-rose-50/5'
                        : 'border-slate-200 focus:border-brand-blue-500'
                    }`}
                  />
                  {formData.email !== '' && (
                    <div className="flex items-center gap-1.5 mt-1 transition-all duration-300">
                      {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? (
                        <>
                          <Icon name="Check" className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Formato de correo válido</span>
                        </>
                      ) : (
                        <>
                          <Icon name="AlertTriangle" className="h-3.5 w-3.5 text-rose-500" />
                          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Introduce un formato de correo válido (ejemplo@dominio.com)</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Telephone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-slate-500">Teléfono o WhatsApp</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="ej. +52 81 1234 5678"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-blue-500 rounded-xl px-4 py-3 text-xs font-semibold focus:bg-white focus:outline-none transition-colors duration-200 text-slate-800"
                  />
                </div>

                {/* Profile Role select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-slate-500">¿Quién eres?</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-blue-500 rounded-xl px-4 py-3 text-xs font-semibold focus:bg-white focus:outline-none transition-colors duration-200 text-slate-850"
                  >
                    <option value="parent">Padre / Madre de Familia</option>
                    <option value="teacher">Docente frente a grupo</option>
                    <option value="director">Directivo o Coordinador Escolar</option>
                  </select>
                </div>

              </div>

              {/* Selected Workshop linking dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500">Taller o Programa de Interés</label>
                <select
                  value={formData.workshopId}
                  onChange={(e) => setFormData(prev => ({ ...prev, workshopId: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-blue-500 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:bg-white text-slate-700"
                >
                  <option value="">-- Elige un programa de interés (Opcional) --</option>
                  {WORKSHOPS.map(w => (
                    <option key={w.id} value={w.id}>👪 {w.title}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase text-slate-500">Mensaje o Pregunta Específica</label>
                  <span className={`text-[10px] font-bold tracking-wider uppercase transition-colors ${
                    500 - formData.message.length <= 50 ? 'text-brand-orange-550 animate-pulse' : 'text-slate-400'
                  }`}>
                    {500 - formData.message.length} de 500 restantes
                  </span>
                </div>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value.slice(0, 500) }))}
                  placeholder="Compártenos qué edad tienen tus hijos, qué retos de crianza o acompañamiento escolar enfrentan..."
                  rows={4}
                  maxLength={500}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-blue-500 rounded-xl px-4 py-3 text-xs font-semibold focus:bg-white focus:outline-none transition-all duration-200 text-slate-800"
                />
              </div>

              {/* Form validation warning */}
              <div className="flex items-center gap-2.5 bg-brand-blue-50/55 text-brand-blue-700 border border-brand-blue-100 p-4 rounded-xl">
                <Icon name="Sparkles" className="h-4 w-4 shrink-0" />
                <p className="text-[11px] font-bold">
                  No solicitamos información sensible de tarjetas ni claves. Tu privacidad está resguardada de forma profesional con soporte de Nexo Educativo.
                </p>
              </div>

              <div className="pt-2 text-right">
                <button
                  type="submit"
                  className="bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-extrabold px-8 py-3 rounded-full shadow-xs hover:shadow-sm transition-all duration-200 text-xs uppercase tracking-wide cursor-pointer"
                >
                  Confirmar Registro / Solicitar Información
                </button>
              </div>

            </form>
          )}

        </div>

      </section>

      {/* FOOTER */}
      <footer className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-24 border-t border-slate-200 pt-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          
          <div className="md:col-span-5 space-y-4">
            <h4 className="text-lg font-extrabold">NEXO <span className="text-brand-orange-500">EDUCATIVO</span></h4>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xs block leading-relaxed font-semibold">
              La conexión real entre escuela, familia y aprendizaje. Creamos espacios prácticos, amenos y cercanos con un enfoque pedagógico humanista.
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-normal">
              Especialista en Capacitación, Sinergia Familiar y Crecimiento.
            </p>
          </div>

          <div className="md:col-span-4 space-y-4">
            <h5 className="font-bold text-xs uppercase text-slate-800">Ubicación</h5>
            <div className="text-xs text-slate-500 space-y-2.5 font-semibold">
              <p className="flex items-center gap-2">
                <Icon name="MapPin" className="h-4 w-4 text-brand-orange-500 shrink-0" />
                <span>Guadalajara, Jalisco, México (Presenciales y Online a todo el país)</span>
              </p>
              <p className="flex items-center gap-2">
                <Icon name="Mail" className="h-4 w-4 text-brand-blue-500 shrink-0" />
                <span>licjorgesaavedra@gmail.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Icon name="Phone" className="h-4 w-4 text-brand-green-500 shrink-0" />
                <span>+52 33 1828 6167</span>
              </p>
            </div>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h5 className="font-bold text-xs uppercase text-slate-800">Filosofía de impacto</h5>
            <div className="p-4 bg-brand-orange-50/50 border border-brand-orange-100 rounded-2xl text-[11px] sm:text-xs font-semibold text-slate-650 leading-relaxed italic">
              "Una escuela que fortalece la alianza corresponsable con las familias es una escuela de verdadera excelencia."
            </div>
          </div>

        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 font-semibold gap-4">
          <p>© {new Date().getFullYear()} Nexo Educativo. Todos los derechos reservados.</p>
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => setIsPrivacyModalOpen(true)}
              className="hover:underline cursor-pointer border-none bg-transparent p-0 font-semibold text-[10px] text-slate-400 hover:text-brand-blue-500 transition-colors focus:outline-none"
            >
              Aviso de Privacidad
            </button>
            <span>•</span>
            <button 
              onClick={() => setIsTermsModalOpen(true)}
              className="hover:underline cursor-pointer border-none bg-transparent p-0 font-semibold text-[10px] text-slate-400 hover:text-brand-blue-500 transition-colors focus:outline-none"
            >
              Términos del Servicio
            </button>
            <span>•</span>
            <button 
              onClick={() => isUnlocked ? setIsPrivatePanelOpen(true) : setShowLoginModal(true)}
              className="hover:underline text-[10px] text-slate-450 hover:text-brand-blue-500 font-semibold cursor-pointer flex items-center gap-1.5 focus:outline-none transition-colors border-none bg-transparent p-0"
            >
              🔑 Acceso Estratégico
              {hasPendingLeads && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-600 text-[9px] font-black uppercase tracking-wider rounded-full animate-pulse ml-1 shrink-0">
                  <span className="w-1 h-1 rounded-full bg-rose-500 animate-ping"></span>
                  Nuevas Solicitudes
                </span>
              )}
            </button>
            <span>•</span>
            <span className="text-brand-orange-650 bg-brand-orange-50 px-3 py-1 rounded-full border border-brand-orange-100 font-semibold shadow-2xs">
              Cercanos y Profesionales
            </span>
          </div>
        </div>

      </footer>

      {/* DETAILED WORKSHOP DRAWER / MODAL DIAGRAM */}
      {selectedWorkshop && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl max-w-2xl w-full p-8 shadow-lg space-y-6 relative max-h-[90vh] overflow-y-auto w-full">
            
            {/* Loading/Simulated PDF Compilation Overlay */}
            {isGeneratingPdf && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center p-8 z-30 rounded-3xl animate-fade-in">
                <div className="space-y-6 text-center max-w-sm">
                  {/* Decorative Brand Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange-50 rounded-full border border-brand-orange-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-orange-500 animate-ping"></span>
                    <span className="text-[10px] font-black uppercase text-brand-orange-700 tracking-wider font-sans">Compilador Digital Nexo</span>
                  </div>

                  {/* Rotating spinner */}
                  <div className="relative mx-auto w-14 h-14 flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-brand-orange-500 border-l-brand-blue-500 rounded-full animate-spin"></div>
                    <div className="w-3.5 h-3.5 bg-yellow-450 rounded-full animate-pulse"></div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-black text-slate-850 uppercase tracking-wide">
                      Generando Folleto Digital
                    </h4>
                    <p className="text-[10px] font-semibold text-slate-500 italic max-w-xs leading-normal">
                      Diseñando y personalizando un dossier PDF exclusivo con los objetivos pedagógicos y el temario oficial de Nexo Educativo.
                    </p>
                  </div>

                  {/* Progress steps container */}
                  <div className="space-y-2 bg-slate-50 border border-slate-150 p-4 rounded-2xl text-left font-sans w-full">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      {pdfGenStep >= 1 ? (
                        <span className="text-emerald-500 font-bold">✓</span>
                      ) : (
                        <span className="w-3 h-3 border-2 border-brand-orange-500 border-t-transparent rounded-full animate-spin inline-block"></span>
                      )}
                      <span className={pdfGenStep >= 1 ? 'text-slate-400 font-medium' : 'text-slate-800 font-extrabold'}>
                        1. Analizando contenidos del taller
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold">
                      {pdfGenStep >= 2 ? (
                        <span className="text-emerald-500 font-bold">✓</span>
                      ) : pdfGenStep === 1 ? (
                        <span className="w-3 h-3 border-2 border-brand-orange-500 border-t-transparent rounded-full animate-spin inline-block"></span>
                      ) : (
                        <span className="text-slate-300">○</span>
                      )}
                      <span className={pdfGenStep >= 2 ? 'text-slate-400 font-medium' : pdfGenStep === 1 ? 'text-slate-800 font-extrabold' : 'text-slate-400'}>
                        2. Aplicando branding e identidad visual
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold">
                      {pdfGenStep >= 3 ? (
                        <span className="text-emerald-500 font-bold">✓</span>
                      ) : pdfGenStep === 2 ? (
                        <span className="w-3 h-3 border-2 border-brand-orange-500 border-t-transparent rounded-full animate-spin inline-block"></span>
                      ) : (
                        <span className="text-slate-300">○</span>
                      )}
                      <span className={pdfGenStep >= 3 ? 'text-slate-400 font-medium' : pdfGenStep === 2 ? 'text-slate-800 font-extrabold' : 'text-slate-400'}>
                        3. Maquetando estructura gráfica
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold">
                      {pdfGenStep === 3 ? (
                        <span className="w-3 h-3 border-2 border-brand-blue-500 border-t-transparent rounded-full animate-spin inline-block"></span>
                      ) : (
                        <span className="text-slate-300">○</span>
                      )}
                      <span className={pdfGenStep === 3 ? 'text-brand-blue-600 font-extrabold animate-pulse' : 'text-slate-400'}>
                        4. Descargando folleto oficial...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => setSelectedWorkshop(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Icon name="X" className="h-4 w-4 text-slate-600" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 pr-6">
              <span className={`inline-block text-[10px] font-bold uppercase border px-3 py-1 rounded-full ${
                selectedWorkshop.id === 'liderazgo-colaborativo-escuela' || selectedWorkshop.id === 'alianza-escuela-hogar-acuerdos'
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-2xs'
                  : 'bg-brand-orange-50 text-brand-orange-700 border border-brand-orange-100'
              }`}>
                {selectedWorkshop.id === 'liderazgo-colaborativo-escuela' || selectedWorkshop.id === 'alianza-escuela-hogar-acuerdos'
                  ? 'Formación Escuela-Familia'
                  : 'Padres de Familia'}
              </span>
              
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 uppercase leading-snug">
                {selectedWorkshop.title}
              </h3>
              <p className="text-xs font-bold text-slate-450 uppercase tracking-wider italic">
                "{selectedWorkshop.slogan}"
              </p>
            </div>

            {/* Key Metadata Table */}
            <div className="flex flex-col sm:flex-row gap-4 justify-around bg-slate-50 border border-slate-150 p-4 rounded-xl text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <span className="text-brand-orange-500">⏱</span>
                <span>Duración: {selectedWorkshop.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brand-blue-500">💡</span>
                <span>Metodología: {selectedWorkshop.methodology}</span>
              </div>
            </div>

            <div className="space-y-4">
              
              {/* Objectives lists */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Objetivos del Taller</h4>
                <div className="space-y-2">
                  {selectedWorkshop.objectives.map((obj, oIdx) => (
                    <div key={oIdx} className="flex gap-2.5 text-xs font-semibold text-slate-600">
                      <span className="text-brand-green-500 font-extrabold shrink-0">✦</span>
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Topics block */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Temario que abarcaremos</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedWorkshop.topics.map((tp, tIdx) => (
                    <div key={tIdx} className="bg-slate-50 border border-slate-150 p-3 rounded-xl text-xs font-semibold text-slate-700">
                      <span className="text-brand-orange-500 mr-2">■</span> {tp}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Actions inside modal */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-[10px] font-bold text-slate-400 text-center sm:text-left max-w-xs">
                ¿Quieres este taller personalizado o con adecuaciones especiales para tu grupo?
              </p>
              <div className="flex gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto shrink-0 justify-end">
                <button
                  onClick={() => setPreviewWorkshopPdf(selectedWorkshop)}
                  className="flex-grow sm:flex-grow-0 border border-brand-orange-200 hover:border-brand-orange-300 bg-brand-orange-50/70 hover:bg-brand-orange-100/50 text-brand-orange-700 px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
                  title="Vista Previa de Folleto PDF Profesional"
                >
                  <Icon name="Eye" className="h-3.5 w-3.5 text-brand-orange-500" />
                  <span>Folleto PDF</span>
                </button>
                <button
                  onClick={() => setSelectedWorkshop(null)}
                  className="flex-grow sm:flex-grow-0 border border-slate-205 rounded-full px-4 py-2 text-xs font-bold text-slate-600 cursor-pointer"
                >
                  Regresar
                </button>
                <button
                  onClick={() => {
                    handleSelectWorkshopForForm(selectedWorkshop.id);
                    setSelectedWorkshop(null);
                  }}
                  className="flex-grow sm:flex-grow-0 bg-brand-yellow-400 hover:bg-brand-yellow-500 rounded-full px-5 py-2 text-xs font-bold text-slate-900 transition-colors cursor-pointer"
                >
                  ¡Me interesa registrarme!
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PDF BROCHURE PREVIEW MODAL */}
      {previewWorkshopPdf && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 md:p-8 animate-fade-in">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl max-w-3xl w-full p-4 md:p-6 shadow-2xl flex flex-col max-h-[92vh] relative">
            
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-205">
              <div>
                <h3 className="text-sm font-black text-slate-850 flex items-center gap-2">
                  <Icon name="Eye" className="h-5 w-5 text-brand-orange-500" />
                  <span>VISTA PREVIA DEL FOLLETO PDF</span>
                </h3>
                <p className="text-[10px] font-semibold text-slate-500">
                  Previsualiza el formato oficial de exportación antes de guardarlo en tu dispositivo.
                </p>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                <button
                  onClick={() => setPreviewWorkshopPdf(null)}
                  className="px-3.5 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-655 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none"
                  disabled={isGeneratingPdf}
                >
                  <Icon name="X" className="h-3.5 w-3.5 text-slate-500" />
                  <span>Cerrar</span>
                </button>
                <button
                  onClick={() => handleDownloadPdf(previewWorkshopPdf)}
                  className="px-4 py-1.5 bg-brand-orange-500 hover:bg-brand-orange-600 text-white rounded-full text-xs font-black transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center gap-1.5 focus:outline-none"
                  disabled={isGeneratingPdf}
                >
                  <Icon name="Download" className="h-3.5 w-3.5 text-white" />
                  <span>Descargar PDF</span>
                </button>
              </div>
            </div>

            {/* Inner scrollable paper area mimicking a real A4 or Letter physical report sheet */}
            <div className="flex-1 overflow-y-auto py-6 px-1 md:px-4 bg-slate-200/40 rounded-2xl border border-slate-150 my-4 shadow-inner flex justify-center">
              
              <div className="bg-white max-w-[612px] w-full min-h-[792px] shadow-lg border border-slate-300 rounded-sm p-8 md:p-10 font-sans text-slate-800 space-y-6 relative flex flex-col justify-between selection:bg-brand-orange-100">
                
                {/* Simulated PDF Compile Progress Overlaid inside sheet for high-fidelity interactive flow */}
                {isGeneratingPdf && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center p-8 z-30 rounded-sm animate-fade-in">
                    <div className="space-y-6 text-center max-w-sm">
                      {/* Decorative Brand Badge */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange-50 rounded-full border border-brand-orange-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-orange-500 animate-ping"></span>
                        <span className="text-[10px] font-black uppercase text-brand-orange-700 tracking-wider font-sans">Compilador Digital Nexo</span>
                      </div>

                      {/* Rotating spinner */}
                      <div className="relative mx-auto w-14 h-14 flex items-center justify-center">
                        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-brand-orange-500 border-l-brand-blue-500 rounded-full animate-spin"></div>
                        <div className="w-3.5 h-3.5 bg-yellow-450 rounded-full animate-pulse"></div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-black text-slate-850 uppercase tracking-wide">
                          Descargando Folleto Digital
                        </h4>
                        <p className="text-[10px] font-semibold text-slate-500 italic max-w-xs leading-normal">
                          Diseñando y personalizando un dossier PDF exclusivo con los objetivos pedagógicos y el temario oficial de Nexo Educativo.
                        </p>
                      </div>

                      {/* Progress steps container */}
                      <div className="space-y-2 bg-slate-50 border border-slate-150 p-4 rounded-2xl text-left font-sans w-full shadow-xs">
                        <div className="flex items-center gap-2 text-xs font-semibold">
                          {pdfGenStep >= 1 ? (
                            <span className="text-emerald-500 font-bold">✓</span>
                          ) : (
                            <span className="w-3 h-3 border-2 border-brand-orange-500 border-t-transparent rounded-full animate-spin inline-block"></span>
                          )}
                          <span className={pdfGenStep >= 1 ? 'text-slate-400 font-medium' : 'text-slate-800 font-extrabold'}>
                            1. Analizando contenidos del taller
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-semibold">
                          {pdfGenStep >= 2 ? (
                            <span className="text-emerald-500 font-bold">✓</span>
                          ) : pdfGenStep === 1 ? (
                            <span className="w-3 h-3 border-2 border-brand-orange-500 border-t-transparent rounded-full animate-spin inline-block"></span>
                          ) : (
                            <span className="text-slate-300">○</span>
                          )}
                          <span className={pdfGenStep >= 2 ? 'text-slate-400 font-medium' : pdfGenStep === 1 ? 'text-slate-800 font-extrabold' : 'text-slate-400'}>
                            2. Aplicando branding e identidad visual
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-semibold">
                          {pdfGenStep >= 3 ? (
                            <span className="text-emerald-500 font-bold">✓</span>
                          ) : pdfGenStep === 2 ? (
                            <span className="w-3 h-3 border-2 border-brand-orange-500 border-t-transparent rounded-full animate-spin inline-block"></span>
                          ) : (
                            <span className="text-slate-300">○</span>
                          )}
                          <span className={pdfGenStep >= 3 ? 'text-slate-400 font-medium' : pdfGenStep === 2 ? 'text-slate-800 font-extrabold' : 'text-slate-400'}>
                            3. Maquetando estructura gráfica
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-semibold">
                          {pdfGenStep === 3 ? (
                            <span className="w-3 h-3 border-2 border-brand-blue-500 border-t-transparent rounded-full animate-spin inline-block"></span>
                          ) : (
                            <span className="text-slate-300">○</span>
                          )}
                          <span className={pdfGenStep === 3 ? 'text-brand-blue-600 font-extrabold animate-pulse' : 'text-slate-400'}>
                            4. Descargando folleto oficial...
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actual Paper mock-up content begins here */}
                <div className="space-y-6">
                  {/* Real Top Highlight bar */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-brand-orange-500"></div>

                  <div className="flex justify-between items-start pt-2">
                    <div className="space-y-0.5">
                      <span className="text-lg font-black text-slate-800 tracking-tight block">
                        NEXO <span className="text-brand-orange-500">EDUCATIVO</span>
                      </span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">
                        Fortaleciendo Familias y Centros Escolares
                      </span>
                      <span className="text-[7.5px] font-semibold text-slate-400/85 block">
                        Consultora Pedagógica e Institucional
                      </span>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                        previewWorkshopPdf.id === 'liderazgo-colaborativo-escuela' || previewWorkshopPdf.id === 'alianza-escuela-hogar-acuerdos'
                          ? 'text-indigo-700 bg-indigo-50 border-indigo-200'
                          : 'text-brand-blue-600 bg-brand-blue-50 border-brand-blue-100'
                      }`}>
                        {previewWorkshopPdf.id === 'liderazgo-colaborativo-escuela' || previewWorkshopPdf.id === 'alianza-escuela-hogar-acuerdos'
                          ? 'FORMACIÓN ESCUELA-FAMILIA'
                          : previewWorkshopPdf.type === 'family'
                            ? 'ESCUELA PARA PADRES'
                            : 'DOSSIER INFORMATIVO; CAPACITACIÓN'}
                      </span>
                    </div>
                  </div>

                  <hr className="border-slate-150" />

                  {/* Header Title Information */}
                  <div className="space-y-2">
                    <span className="text-[8px] font-extrabold tracking-widest text-slate-400 uppercase block">
                      FOLLETO INFORMATIVO DE TALLER
                    </span>
                    <h2 className="text-base font-black text-slate-900 tracking-tight leading-snug uppercase">
                      {previewWorkshopPdf.title}
                    </h2>
                    <p className="text-[9.5px] font-medium text-slate-500 bg-slate-50 border-l-2 border-brand-orange-500 pl-2 py-1 italic">
                      "{previewWorkshopPdf.slogan}"
                    </p>
                  </div>

                  {/* Double Columns Metrics */}
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-150 p-3 rounded-lg text-[8.5px] font-bold text-slate-600">
                    <div>
                      <span className="text-slate-400 uppercase block tracking-wider">Duración prevista</span>
                      <span className="text-brand-orange-600 text-[11px] font-black">{previewWorkshopPdf.duration}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase block tracking-wider">Metodología académica</span>
                      <span className="text-brand-blue-600 text-[11px] font-black">{previewWorkshopPdf.methodology}</span>
                    </div>
                  </div>

                  {/* Program Description */}
                  <div className="space-y-1.5">
                    <h4 className="text-[9.5px] font-black text-slate-800 uppercase tracking-wider">
                      1. Sinopsis del programa
                    </h4>
                    <p className="text-[9.5px] text-slate-650 leading-relaxed text-justify whitespace-pre-line">
                      {previewWorkshopPdf.description}
                    </p>
                  </div>

                  {/* Specific Objectives */}
                  <div className="space-y-2">
                    <h4 className="text-[9.5px] font-black text-slate-800 uppercase tracking-wider">
                      2. Objetivos específicos
                    </h4>
                    <ul className="space-y-1.5">
                      {previewWorkshopPdf.objectives.map((obj, i) => (
                        <li key={i} className="flex gap-2 text-[9.5px] text-slate-650 leading-normal">
                          <span className="text-brand-orange-500 font-bold shrink-0">✦</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Syllabus / Temarios */}
                  <div className="space-y-1.5">
                    <h4 className="text-[9.5px] font-black text-slate-800 uppercase tracking-wider">
                      3. Ejes temáticos y contenido
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {previewWorkshopPdf.topics.map((tp, i) => (
                        <div key={i} className="flex gap-2 bg-slate-50 border border-slate-150 rounded p-2 items-start">
                          <span className="text-brand-blue-500 text-[9px] font-bold mt-0.5">{i + 1}.</span>
                          <span className="text-[9px] font-bold text-slate-700 leading-normal">{tp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Section replicating exactly page length */}
                <div className="space-y-2 pt-4 border-t border-slate-150 mt-auto">
                  <div className="flex justify-between items-center text-[7.5px] text-slate-450 font-bold uppercase tracking-wider">
                    <span>NEXO EDUCATIVO © 2026</span>
                    <span>Guadalajara, Jalisco, México</span>
                  </div>
                  <p className="text-[7.5px] text-slate-400 italic leading-snug">
                    Consulte adaptaciones curriculares específicas, agendas disponibles por plantel educativo en Guadalajara, Jalisco, y opciones de acompañamiento consultivo virtual para otras entidades.
                  </p>
                  <p className="text-[7.5px] font-black text-brand-blue-600">
                    Contacto: contacto@nexoeducativo.com  |  WhatsApp: +52 33 1828 6167
                  </p>
                </div>

              </div>

            </div>

            {/* Bottom Status Controls */}
            <div className="flex items-center justify-between text-[10px] font-semibold text-slate-505 pt-2 px-1 border-t border-slate-205">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-green-500 inline-block animate-pulse"></span>
                <span>Renderizado a Escala Carta</span>
              </span>
              <span>1 Página Completa</span>
            </div>

          </div>
        </div>
      )}

      {/* AVISO DE PRIVACIDAD MODAL COMPLIANT WITH MEXICAN LAW (LFPDPPP) */}
      {isPrivacyModalOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 md:p-8 animate-fade-in text-left">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-4 md:p-6 shadow-2xl flex flex-col max-h-[92vh] relative">
            
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-200">
              <div className="text-left">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 tracking-wide uppercase">
                  <Icon name="Shield" className="h-5 w-5 text-brand-blue-500" />
                  <span>Aviso de Privacidad Integral</span>
                </h3>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                  Conforme a la Ley Federal de Protección de Datos Personales de México (LFPDPPP)
                </p>
              </div>
              <button
                onClick={() => setIsPrivacyModalOpen(false)}
                className="p-1 px-3 bg-slate-100 hover:bg-slate-200 text-slate-705 rounded-full text-xs font-bold transition-all cursor-pointer focus:outline-none"
              >
                Cerrar
              </button>
            </div>

            {/* Content body */}
            <div className="flex-1 overflow-y-auto py-4 px-1 text-slate-705 space-y-4 text-xs font-medium leading-relaxed text-justify">
              <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-2xl text-[11px] text-slate-650">
                <span className="font-extrabold text-slate-800 block mb-1">Responsable del Tratamiento de sus Datos</span>
                <strong>Nexo Educativo</strong>, bajo la dirección de su titular consultor con sede de operación en Guadalajara, Jalisco, México; con correo electrónico oficial <span className="text-brand-blue-600 font-bold">licjorgesaavedra@gmail.com</span> y teléfono/WhatsApp <span className="text-brand-green-650 font-bold">+52 33 1828 6167</span>, es el responsable del uso, tratamiento, salvaguarda y protección de los datos personales que usted nos proporcione de manera libre e informada.
              </div>

              <div className="space-y-1">
                <h4 className="font-black text-[11px] text-slate-900 uppercase tracking-wider">1. Datos Personales Recabados</h4>
                <p className="text-slate-650">
                  Para llevar a cabo las finalidades descritas en el presente aviso, recolectamos de manera directa o mediante nuestros formularios y herramientas de mensajería digital los siguientes datos personales comunes y no sensibles:
                </p>
                <ul className="list-disc pl-5 space-y-0.5 text-slate-650 text-left">
                  <li>Nombre completo del padre, madre, tutor de familia, docente o directivo escolar.</li>
                  <li>Teléfono de contacto móvil o teléfono fijo (con soporte directo para WhatsApp).</li>
                  <li>Dirección de correo electrónico activa.</li>
                  <li>Nombre de la institución educativa o plantel escolar del que forma parte o al que solicita talleres.</li>
                  <li>Ciudad o Estado de procedencia (con prioridad de atención presencial en Guadalajara, Jalisco y estados colindantes de la República Mexicana).</li>
                </ul>
              </div>

              <div className="space-y-1">
                <h4 className="font-black text-[11px] text-slate-900 uppercase tracking-wider">2. Finalidades del Tratamiento de los Datos</h4>
                <p className="text-slate-650">
                  Los datos personales que recabamos de usted se utilizarán exclusivamente para las siguientes finalidades primarias y necesarias de nuestro servicio pedagógico profesional:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-705 text-left">
                  <li>Proveer cotizaciones formales, guías curriculares, dossiers informativos y temarios oficiales en PDF sobre nuestros talleres formativos de alto impacto.</li>
                  <li>Coordinar, agendar y dar seguimiento personalizado a citas presenciales u online sobre disciplina inteligente, liderazgo parental y límites sanos.</li>
                  <li>Establecer canales de comunicación asertiva para la resolución de dudas con los padres de familia y comités escolares.</li>
                  <li>Registrar y organizar las solicitudes de contacto y pre-registro en nuestros sistemas administrativos de control pedagógico seguro.</li>
                </ul>
                <p className="text-slate-650 mt-2">
                  <strong>Finalidades secundarias alternativas:</strong> Ocasionalmente podremos enviar contenidos informativos, artículos recomendados y cápsulas de valor sobre el fomento de hábitos, responsabilidades y desarrollo autónomo en la infancia y juventud. Si usted no desea recibir este tipo de información, puede manifestar su negativa de forma inmediata y sencilla enviando un mensaje directo de WhatsApp o correo electrónico con la palabra "BAJA".
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-black text-[11px] text-slate-900 uppercase tracking-wider">3. Limitación y Transferencia de Datos</h4>
                <p className="text-slate-650">
                  Le informamos con total seguridad de que sus datos personales <strong>NO son vendidos, transferidos, alquilados ni compartidos</strong> con terceras personas, instituciones comerciales, redes publicitarias ni consultores externos bajo ningún concepto de lucro o marketing indirecto. Toda la información queda estrictamente resguardada bajo los mecanismos de seguridad física, administrativa y digital de Nexo Educativo, salvo los mandatos de carácter oficial emitidos por autoridades competentes de los Estados Unidos Mexicanos previstos en la legislación.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-black text-[11px] text-slate-900 uppercase tracking-wider">4. Ejercicio de los Derechos ARCO (LFPDPPP)</h4>
                <p className="text-slate-650">
                  Usted tiene en todo momento el pleno derecho legal de acceder a sus datos personales en nuestro poder (<strong>Acceso</strong>); solicitar su rectificación o actualización en caso de que su información sea errónea o incompleta (<strong>Rectificación</strong>); solicitar su eliminación definitiva de todas nuestras listas si considera que el tratamiento no se ajusta a los fines autorizados (<strong>Cancelación</strong>); así como manifestar su oposición legítima para el tratamiento específico de sus datos en canales concretos (<strong>Oposición</strong>).
                </p>
                <p className="text-slate-650">
                  Para ejercer cualquiera de sus Derechos ARCO, únicamente deberá enviar una petición clara y directa vía correo electrónico a <span className="text-brand-blue-600 font-bold">licjorgesaavedra@gmail.com</span> o mediante mensaje de texto por WhatsApp al teléfono <span className="text-brand-green-650 font-bold">+52 33 1828 6167</span>, acreditando debidamente su identidad. Su solicitud será atendida y procesada con total gratuidad en un plazo máximo de 10 días hábiles, emitiendo una notificación de confirmación formal que garantice la tutela efectiva de sus derechos de privacidad.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-black text-[11px] text-slate-900 uppercase tracking-wider">5. Tecnologías de Rastreo y Guardado Local</h4>
                <p className="text-slate-650">
                  Esta plataforma web interactiva recopila cookies de sesión y almacenamiento temporal (<span className="font-mono">localStorage</span>) indispensables para recordar sus preferencias de filtración curricular (<em>Padres de Familia</em> o <em>Formación Escuela-Familia</em>) y guardar su avance de navegación escolar a fin de garantizarle una carga veloz y libre de fallos. No realizamos inserciones de scripts publicitarios externos ni rastreamos su comportamiento de software con miras a comercializar perfiles virtuales de consumo.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-black text-[11px] text-slate-900 uppercase tracking-wider">6. Consentimiento del Usuario</h4>
                <p className="text-slate-650">
                  Al proporcionarnos sus datos personales para la solicitud de dossiers, temarios de talleres curriculares o información general de asesoría, se da por enterado y expresa su entera aceptación de los términos establecidos en este aviso, autorizándonos expresamente a resguardar y dar uso a su información en sintonía con las políticas regulatorias vigentes.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-black text-[11px] text-slate-900 uppercase tracking-wider">7. Modificaciones en las Cláusulas de Privacidad</h4>
                <p className="text-slate-650">
                  El presente aviso puede cambiar, contraerse o expandirse como resultado de innovadoras normativas oficiales sobre derechos de datos personales sustentadas por el INAI en México. Le invitamos a consultar periódicamente esta sección en el pie de página de nuestro portal web para revisar la vigencia legal del acuerdo de privacidad.
                </p>
              </div>

              <hr className="border-slate-150" />
              
              <div className="text-[10px] text-slate-400 font-extrabold text-center uppercase tracking-wider">
                Vigencia Legal en todo el Territorio Nacional: Junio de 2026 | Nexo Educativo México
              </div>
            </div>

            {/* Footer buttons */}
            <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setIsPrivacyModalOpen(false)}
                className="px-6 py-2.5 bg-brand-blue-500 hover:bg-brand-blue-600 text-white font-extrabold uppercase text-[10px] sm:text-xs rounded-xl tracking-wider shadow-sm cursor-pointer transition-all focus:outline-none"
              >
                Aceptar y Entendido
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TÉRMINOS DEL SERVICIO MODAL COMPLIANT WITH MEXICAN LAW AND PEDAGOGICAL CONSULTATION */}
      {isTermsModalOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 md:p-8 animate-fade-in text-left">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-4 md:p-6 shadow-2xl flex flex-col max-h-[92vh] relative">
            
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-200">
              <div className="text-left">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 tracking-wide uppercase">
                  <Icon name="Shield" className="h-5 w-5 text-brand-orange-500" />
                  <span>Términos y Condiciones del Servicio</span>
                </h3>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                  Nexo Educativo • Guadalajara, Jalisco, México
                </p>
              </div>
              <button
                onClick={() => setIsTermsModalOpen(false)}
                className="p-1 px-3 bg-slate-100 hover:bg-slate-200 text-slate-705 rounded-full text-xs font-bold transition-all cursor-pointer focus:outline-none"
              >
                Cerrar
              </button>
            </div>

            {/* Content body */}
            <div className="flex-1 overflow-y-auto py-4 px-1 text-slate-705 space-y-4 text-xs font-medium leading-relaxed text-justify font-sans">
              <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-2xl text-[11px] text-slate-650">
                <span className="font-extrabold text-slate-800 block mb-1">Preámbulo y Alcance de las Condiciones</span>
                Bienvenido al portal web de <strong>Nexo Educativo</strong>. Al acceder, navegar o utilizar este sitio web, descargar los dossiers informativos o pre-registrar sus datos para solicitar talleres, usted acepta de manera expresa e innegociable estar sujeto a los presentes términos y condiciones de servicio. Si no está de acuerdo, le instamos a abstenerse del uso de la página.
              </div>

              <div className="space-y-1">
                <h4 className="font-black text-[11px] text-slate-900 uppercase tracking-wider">1. Naturaleza de los Servicios</h4>
                <p className="text-slate-650">
                  Nexo Educativo proporciona servicios profesionales independientes relacionados con la consultoría pedagógica, psicopedagogía social, capacitación escolar y talleres formativos de alto impacto dirigidos a padres de familia, alumnos, docentes y equipos directivos de centros escolares.
                </p>
                <p className="text-slate-650">
                  La información descrita en esta plataforma (temarios, duraciones, metodologías y sugerencias de temáticas) es puramente orientativa e ilustrativa. El diseño final de cada taller o diplomado se formalizará de manera particular atendiendo las necesidades de cada contratante.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-black text-[11px] text-slate-900 uppercase tracking-wider">2. Propiedad Intelectual y Derechos de Autor</h4>
                <p className="text-slate-650">
                  Todo el contenido disponible en este portal, incluyendo de manera enunciativa pero no limitativa: nombres de talleres, slogans formativos, logotipos, diseños, tipografía, textos, esquemas pedagógicos, bases de datos y los códigos de generación de temarios informativos, son propiedad intelectual exclusiva de <strong>Nexo Educativo de México</strong> y/o su titular Jorge Saavedra.
                </p>
                <p className="text-slate-650">
                  Queda estrictamente prohibida la reproducción parcial o total, redistribución comercial, alteración, plagio o explotación industrial de las metodologías de talleres o material curricular proporcionado en este sitio, sin el consentimiento formal y por escrito de su autor.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-black text-[11px] text-slate-900 uppercase tracking-wider">3. Cotizaciones y Contratación de Talleres</h4>
                <p className="text-slate-650">
                  Cualquier estimación económica o cotización simulada a través de nuestros gestores informativos tiene un carácter provisional y no constituye una oferta contractual legalmente vinculante. Las reservaciones de fechas de impartición, tarifas oficiales de honorarios y compromisos de viáticos (especialmente fuera de la Zona Metropolitana de Guadalajara) se regirán obligatoriamente bajo un contrato exclusivo de prestación de servicios profesionales respaldado por la legislación civil.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-black text-[11px] text-slate-900 uppercase tracking-wider">4. Limitación de Responsabilidad Educativa</h4>
                <p className="text-slate-650">
                  Nexo Educativo provee guías y herramientas de crianza, aserción de límites y fortalecimiento del vínculo escuela-familia basadas en metodologías científicas y psicopedagógicas validadas internacionalmente. No obstante, las dinámicas de conducta infantiles y juveniles se asocian a múltiples factores biopsicosociales ajenos a la intervención del consultor.
                </p>
                <p className="text-slate-650">
                  Por lo tanto, Nexo Educativo y su titular no asumen responsabilidad alguna por los resultados conductuales individuales, desatenciones pedagógicas familiares o decisiones internas de los centros escolares que pudieran acontecer con posterioridad a las sesiones o talleres impartidos.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-black text-[11px] text-slate-900 uppercase tracking-wider">5. Uso Correcto de Canales y WhatsApp</h4>
                <p className="text-slate-650">
                  El usuario se compromete a realizar un uso correcto, ético y legítimo de las herramientas de contacto interactivo, incluyendo el botón de llamada directa y los links de envío de mensajes de WhatsApp. Queda prohibida la transmisión de virus, spam comercial o de carácter asocial, así como el envío de lenguaje ofensivo o la suplantación de la identidad de otra persona o institución educativa.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-black text-[11px] text-slate-900 uppercase tracking-wider">6. Modificaciones de los Términos</h4>
                <p className="text-slate-650">
                  Nexo Educativo se reserva el derecho de efectuar, en cualquier momento y sin previo aviso, modificaciones o actualizaciones a las políticas operativas, temarios escolares o a los presentes términos del servicio. Dichas adecuaciones entrarán en vigor de forma inmediata al ser publicadas en este mismo apartado legal.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-black text-[11px] text-slate-900 uppercase tracking-wider">7. Legislación y Jurisdicción Aplicable</h4>
                <p className="text-slate-650">
                  La interpretación, cumplimiento y posibles controversias de este portal digital o los servicios profesionales de Nexo Educativo se regularán bajo las normativas civiles de los Estados Unidos Mexicanos y el Estado de Jalisco, sometiéndose voluntariamente a los tribunales competentes de la ciudad de <strong>Guadalajara, Jalisco, México</strong>, renunciando expresamente a cualquier otro fuero que pudiera corresponderles por razón de sus domicilios presentes o futuros.
                </p>
              </div>

              <hr className="border-slate-150" />
              
              <div className="text-[10px] text-slate-400 font-extrabold text-center uppercase tracking-wider">
                Vigencia de Servicio en todo el Territorio Nacional: Junio de 2026 | Nexo Educativo
              </div>
            </div>

            {/* Footer buttons */}
            <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setIsTermsModalOpen(false)}
                className="px-6 py-2.5 bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-extrabold uppercase text-[10px] sm:text-xs rounded-xl tracking-wider shadow-sm cursor-pointer transition-all focus:outline-none"
              >
                Aceptar Términos y Condiciones
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <div id="whatsapp-float" className="fixed bottom-6 right-6 z-40 group flex items-center flex-row-reverse gap-3">
        {/* The button */}
        <a 
          href="https://wa.me/523318286167?text=Hola!%20Me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20talleres%20de%20Nexo%20Educativo."
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          aria-label="Contactar por WhatsApp"
        >
          {/* Pulsing visual effect */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-35 -z-10"></span>
          
          {/* WhatsApp Icon */}
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.261 2.268 3.504 5.284 3.505 8.492-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.51 1.45 5.48 1.45 5.51 0 9.99-4.48 10-10 .01-2.65-1.02-5.15-2.9-7.03C17.29 1.7 14.8 1.01 12.01 1a10 10 0 0 0-10 10c-.01 1.98.51 3.9 1.51 5.51l-1 3.61 3.73-.98zM18.05 14.8c-.33-.17-1.95-.96-2.25-1.07-.3-.11-.52-.17-.74.17-.22.33-.85 1.07-1.04 1.28-.19.22-.38.25-.71.08a9 9 0 0 1-2.63-1.62 10 10 0 0 1-1.82-2.27c-.19-.33-.02-.51.15-.68.15-.15.33-.38.5-.57.16-.18.22-.31.33-.52.11-.22.05-.41-.02-.57-.08-.16-.74-1.79-1-2.45-.27-.64-.545-.55-.745-.55h-.645c-.22 0-.58.08-.88.41a3.86 3.86 5 0 0-.01 1.25c0 2.45 1.79 4.8 2.03 5.13.25.33 3.52 5.37 8.52 7.53 1.19.51 2.12.82 2.85 1.05 1.2.38 2.29.33 3.15.2 1-.15 2-.59 2.28-1.14.28-.55.28-1.02.19-1.12-.08-.1-.31-.16-.64-.32z"/>
          </svg>
        </a>

        {/* Tooltip on the left */}
        <div className="bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md opacity-0 translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap border border-slate-800">
          ¿Tienes dudas? ¡Charlemos! 💬
        </div>
      </div>

      {/* LOGIN SECURITY MODAL FOR JORGE SAAVEDRA */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-8 shadow-2xl relative space-y-6">
            
            <button
              onClick={() => {
                setShowLoginModal(false);
                setLoginError(null);
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Icon name="X" className="h-4 w-4" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-brand-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Icon name="Compass" className="h-6 w-6 text-brand-orange-600" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-950 uppercase tracking-tight">Acceso Estratégico</h3>
              <p className="text-xs text-slate-500">
                Esta sección contiene la estrategia privada de marca personal, propuesta de valor comercial y roadmap financiero para <strong>Jorge Saavedra</strong>.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Código de Autorización o WhatsApp</label>
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Introduce celular de soporte o clave..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-center font-semibold focus:bg-white focus:border-brand-blue-500 focus:outline-none transition-all"
                />
                <p className="text-[9px] text-slate-400 text-center">
                  Sugerencia: Puedes usar tu número registrado con clave de área o contraseñas autorizadas.
                </p>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-[11px] text-red-600 font-medium text-center">
                  ⚠️ {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-brand-blue-500 hover:bg-brand-blue-600 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
              >
                Verificar & Desbloquear
              </button>
            </form>
          </div>
        </div>
      )}

      {/* STRATEGIC WORKSPACE OVERLAY FOR JORGE SAAVEDRA */}
      {isPrivatePanelOpen && isUnlocked && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl w-full max-w-5xl my-4 shadow-2xl flex flex-col min-h-[90vh] lg:min-h-[80vh] max-h-[95vh] overflow-hidden">
            
            {/* Header Area */}
            <div className="border-b border-slate-800 bg-slate-900/95 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-brand-orange-500 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Estrategia Exclusiva de Lanzamiento
                  </span>
                  <span className="text-slate-500 text-xs font-mono">• Sesión Privada</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <span>Portal de Posicionamiento Comercial</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Plan de Acción 30 días para <strong>Jorge Saavedra</strong> como Consultor y Conferencista Referente en México.
                </p>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto self-stretch sm:self-auto justify-end">
                <button
                  onClick={handleLockSession}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-350 border border-slate-755 rounded-lg text-[10px] font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer"
                  title="Bloquear sesión privada"
                >
                  🔒 Cerrar Sesión
                </button>
                <button
                  onClick={() => setIsPrivatePanelOpen(false)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                >
                  <Icon name="X" className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Strategy Hub Tab Selector */}
            <div className="bg-slate-900/80 px-6 py-2 border-b border-slate-800 flex gap-2 overflow-x-auto shrink-0 scrollbar-none">
              {[
                { id: 'naming', label: '🏷️ Identidad & Nombre', icon: 'Award' },
                { id: 'valueprop', label: '🎯 Propuesta de Valor', icon: 'Target' },
                { id: 'checklist', label: '⚡ Plan 30 Días & Ventas', icon: 'Calendar' },
                { id: 'leads', label: '📥 Solicitudes de Asesoría', icon: 'Mail' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveStratTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all uppercase tracking-wide cursor-pointer flex items-center gap-2 border ${
                    activeStratTab === tab.id
                      ? 'bg-brand-blue-500 text-white border-brand-blue-550 shadow-sm'
                      : 'bg-slate-850 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                  {tab.id === 'leads' && contactLeads.length > 0 && (
                    <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black animate-pulse">
                      {contactLeads.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Strategic Content Area */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-slate-950 text-slate-300">
              
              {/* TAB 1: NAMING & IDENTITY DISCUSSIONS */}
              {activeStratTab === 'naming' && (
                <div className="space-y-6 max-w-4xl animate-fade-in">
                  <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
                    <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide text-brand-orange-500">
                      Análisis de Marca Comercial vs Marca Personal
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Para consolidarte como conferencista de alto nivel y consultor cotizado en México, la arquitectura de marca debe balancear la formalidad institucional con el carisma humano. Analizamos las mejores opciones para ti:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Brand 1: Nexo Educativo */}
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold bg-brand-blue-950 text-brand-blue-300 border border-brand-blue-900 px-2 rounded-full uppercase">
                          Marca Corporativa / Institucional
                        </span>
                        <span className="text-yellow-400 text-xs">★★★★☆</span>
                      </div>
                      <h4 className="text-sm font-extrabold text-white uppercase">Opción А: Nexo Educativo</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Excelente para vender programas modulares y capacitaciones integrales a juntas directivas de colegios. Ofrece robustez, escalabilidad y permite delegar la impartición futura a directores asociados.
                      </p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[10px] space-y-1">
                        <p className="text-brand-green-500 font-bold">✓ Fortalezas: B2B impecable, catálogo reutilizable</p>
                        <p className="text-red-400 font-bold">✗ Limitaciones: Menos conectividad emocional directa</p>
                      </div>
                    </div>

                    {/* Brand 2: Personal Brand */}
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold bg-brand-orange-950 text-brand-orange-300 border border-brand-orange-900 px-2 rounded-full uppercase">
                          Marca Personal Premium
                        </span>
                        <span className="text-yellow-400 text-xs">★★★★★</span>
                      </div>
                      <h4 className="text-sm font-extrabold text-white uppercase">Opción B: Jorge Saavedra</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Es el verdadero imán de ventas de alto valor. Las personas y directivos escolares confían en personas expertas. La marca personal impulsa la venta como conferencista de congresos y consultor principal.
                      </p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[10px] space-y-1">
                        <p className="text-brand-green-500 font-bold">✓ Fortalezas: Alta rentabilidad, cotización Premium</p>
                        <p className="text-red-400 font-bold">✗ Limitaciones: Depende de ti para entregarse</p>
                      </div>
                    </div>
                  </div>

                  {/* Winner Recommendation */}
                  <div className="bg-gradient-to-r from-brand-orange-950/40 to-indigo-950/40 border border-brand-orange-900/60 p-6 rounded-2xl space-y-4 relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 pointer-events-none">
                      <Icon name="Award" className="w-40 h-40" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-brand-orange-500 text-white rounded-lg flex items-center justify-center font-bold text-lg">
                        🏆
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-brand-orange-400 uppercase tracking-widest">Recomendación de Nombre y Estructura Comercial</h4>
                        <h3 className="text-base font-extrabold text-white uppercase">El Enfoque de Marca Endosada</h3>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300">
                      Tu mejor nombre comercial no es elegir una sobre otra, sino implementar una <strong>estrategia de marca endosada</strong>:
                    </p>
                    <div className="bg-slate-950/70 p-4 border border-slate-800 rounded-xl max-w-md">
                      <p className="text-xs font-mono text-center text-slate-205">
                        <span className="text-white font-extrabold text-sm block mb-1">Mtro. Jorge Saavedra</span>
                        <span className="text-slate-500 uppercase tracking-wider text-[10px]">Presenta / Avalado con la Metodología de</span>
                        <span className="text-brand-blue-400 font-bold text-xs block mt-1">NEXO EDUCATIVO</span>
                      </p>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300">
                      <strong>Por qué funciona:</strong> Te permite publicitarte en ponencias escolares con tu nombre propio para generar autoridad indiscutible, y al mismo tiempo puedes dar seguimiento comercial institucionalizando la facturación y la entrega de temarios bajo "Nexo Educativo".
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: UNIQUE VALUE PROPOSITIONS */}
              {activeStratTab === 'valueprop' && (
                <div className="space-y-6 max-w-4xl animate-fade-in">
                  <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
                    <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide text-brand-blue-400">
                      La Propuesta de Valor Diferenciada
                    </h3>
                    <p className="text-xs text-slate-450 leading-relaxed">
                      El dolor principal en colegios privados es la pérdida de autoridad institucional y la hostilidad de padres exigentes. Tu propuesta de valor debe resolver esto atacando ambos lados (escuela y familia):
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-900 border border-slate-805 rounded-2xl space-y-4">
                      <div className="w-8 h-8 rounded-full bg-slate-850 flex items-center justify-center text-brand-orange-500">
                        <Icon name="Target" className="h-4 w-4" />
                      </div>
                      <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Propuesta Maestra B2B (Colegios Privados)</h4>
                      <p className="text-xs font-medium text-slate-300 leading-relaxed">
                        "Erradicamos el desviste escolar familiar transformando las rutinas vespertinas en hábitos de estudio autónomos, lo que permite al colegio elevar su nivel académico y liberar a sus maestros de intermediar fricciones constantes en el hogar."
                      </p>
                    </div>

                    <div className="p-6 bg-slate-900 border border-slate-805 rounded-2xl space-y-4">
                      <div className="w-8 h-8 rounded-full bg-slate-850 flex items-center justify-center text-brand-blue-500">
                        <Icon name="Heart" className="h-4 w-4" />
                      </div>
                      <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Propuesta Humana B2C (Padres de Familia)</h4>
                      <p className="text-xs font-medium text-slate-300 leading-relaxed">
                        "Te enseñamos metodologías pedagógicas vivenciales para erradicar las lágrimas en las tareas diarias, consolidar límites sin culpa y lograr que tus hijos estudien de forma autónoma con una estructura sana en casa."
                      </p>
                    </div>
                  </div>

                  {/* Elevator Pitch script */}
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                    <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                      <span>⚡ Tu Elevator Pitch Comercial para directores de colegios:</span>
                    </h4>
                    <p className="text-xs italic text-slate-300 leading-relaxed bg-slate-950 p-4 border border-slate-850 rounded-xl">
                      "Muchos colegios privados gastan miles de pesos en capacitaciones puramente teóricas para maestros, pero el problema es que el aprendizaje real colapsa hoy en las tardes en casa porque papá y mamá no tienen técnicas de contención afectiva ni rutinas de estudio autónomo. Yo conecto de forma práctica el hogar con el aula para asegurar el éxito escolar duradero mediante la corresponsabilidad real."
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: PLAN 30 DIAS & OUTREACH GENERATOR */}
              {activeStratTab === 'checklist' && (
                <div className="space-y-8 max-w-4xl animate-fade-in">
                  
                  {/* First Service Pitch Details */}
                  <div className="bg-gradient-to-r from-brand-blue-950/40 to-slate-900 border border-brand-blue-900/40 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-blue-500 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                        💸
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold text-brand-blue-400 uppercase tracking-widest">Servicio de Arranque Rápido para Facturar</h4>
                        <h3 className="text-base font-extrabold text-white uppercase">El Taller de Cohesión Familiar Patrocinado (B2B)</h3>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong>Tu primer servicio comercial estratégico:</strong> No intentes vender asesorías individuales de una en una al principio (requiere mucho esfuerzo de prospección). En su lugar, vende un <strong>"Taller Patrocinado para Padres y Maestros de 120 Minutos"</strong> directamente a directores de colegios privados. 
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      El colegio te paga una inversión fija escolar única para abrir la sesión presencial u online de forma masiva a todas sus familias, eliminando la barrera de cobrarles boleto por boleto.
                    </p>
                  </div>

                  {/* Interactive Financial Calculator */}
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
                    <div className="flex items-center gap-2 text-white">
                      <span>🧮</span>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Interactiva: Simulador Financiero de Arranque (30 Días)</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>Colegios Adquiridos:</span>
                            <span className="text-brand-orange-500 font-bold">{calcSchools} colegios</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={calcSchools}
                            onChange={(e) => setCalcSchools(Number(e.target.value))}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-orange-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>Precio Sugerido del Taller:</span>
                            <span className="text-brand-blue-400 font-bold">${calcTicket.toLocaleString()} MXN</span>
                          </div>
                          <input
                            type="range"
                            min="5000"
                            max="30000"
                            step="2500"
                            value={calcTicket}
                            onChange={(e) => setCalcTicket(Number(e.target.value))}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-blue-500"
                          />
                        </div>
                      </div>

                      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 flex flex-col justify-center items-center text-center space-y-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Facturación Bruta Estimada:</p>
                        <p className="text-2xl sm:text-3xl font-black text-brand-green-500">
                          ${(calcSchools * calcTicket).toLocaleString()} MXN
                        </p>
                        <p className="text-[10px] text-slate-500 max-w-xs leading-normal">
                          Para ganar esta cantidad necesitas vender solo <strong>{calcSchools} talleres patrocinados</strong> de 2 horas. Te deja tiempo libre y máximo posicionamiento.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Steps Roadmap checklist with state persistence */}
                  <div className="bg-slate-905 border border-slate-800 p-6 rounded-2xl space-y-4">
                    <h4 className="text-xs font-bold uppercase text-slate-350 tracking-wider flex items-center justify-between">
                      <span>📋 Roadmap de Acción de 30 Días e Hitos Interactivos:</span>
                      <span className="text-[10px] font-mono text-slate-500">Haz clic en cada paso completado</span>
                    </h4>

                    <div className="space-y-3">
                      {[
                        { id: 'step1', days: 'Días 1-5', title: 'Afinar Ponencia de Frustración e Inteligencia Emocional', desc: 'Prepara un temario visual de 3 láminas centrado en "Tolerancia a la frustración familiar" y tu propuesta corresponsable.' },
                        { id: 'step2', days: 'Días 6-12', title: 'Prospección Caliente de 15 Colegios Privados', desc: 'Envía un mensaje dinámico vía WhatsApp / LinkedIn directo a directores o coordinadores de Guadalajara con el teaser script.' },
                        { id: 'step3', days: 'Días 13-18', title: 'Llamadas Express de Descubrimiento de 5 mins', desc: 'Explora sus fricciones actuales (pérdida de autoridad docente, quejas de padres de familia). Agenda propuesta formal.' },
                        { id: 'step4', days: 'Días 19-25', title: 'Envío de Propuesta de Taller Patrocinado Escolar', desc: 'Presenta el taller grupal cerrado para su colegio por $12,500 MXN. Ofrece la opción de pago diferido o un bono especial.' },
                        { id: 'step5', days: 'Días 26-30', title: 'Impartición, Cierre de Caja y Solicitud de Testimonios', desc: 'Imparte tu primer taller y obtén cartas de recomendación directas de los directores para abrir las puertas al siguiente colegio.' }
                      ].map(step => {
                        const isChecked = checkedSteps.includes(step.id);
                        return (
                          <div 
                            key={step.id}
                            onClick={() => handleToggleStep(step.id)}
                            className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex gap-3.5 items-start ${
                              isChecked 
                                ? 'bg-slate-900/50 border-brand-green-900/60 opacity-70' 
                                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border mt-0.5 transition-colors ${
                              isChecked ? 'bg-brand-green-500 border-brand-green-600 text-white' : 'border-slate-700 bg-slate-950'
                            }`}>
                              {isChecked && <Icon name="Check" className="h-3 w-3" />}
                            </div>
                            <div className="space-y-1">
                              <div className="flex gap-2 items-center flex-wrap">
                                <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded uppercase">
                                  {step.days}
                                </span>
                                <h5 className={`text-xs font-bold ${isChecked ? 'line-through text-slate-500' : 'text-white'}`}>
                                  {step.title}
                                </h5>
                              </div>
                              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pitch script generator tool */}
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">🖨️ Generador de Mensajes Directos para WhatsApp / LinkedIn</h4>
                      <p className="text-[11px] text-slate-400">
                        Selecciona el tema central del taller y copia el texto adaptado para enviarlo a un director de colegio.
                      </p>
                    </div>

                    <div className="flex gap-2 flex-wrap bg-slate-950 p-1 border border-slate-850 rounded-xl">
                      {[
                        { id: 'frustrated', label: 'Tolerancia a Frustración' },
                        { id: 'habitos', label: 'Estudio Autónomo en el Hogar' },
                        { id: 'sinergia', label: 'Sinergia Escuela-Padres' }
                      ].map(topic => (
                        <button
                          key={topic.id}
                          onClick={() => setPitchTopic(topic.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wide cursor-pointer ${
                            pitchTopic === topic.id
                              ? 'bg-slate-800 text-white'
                              : 'text-slate-550 hover:bg-slate-900 hover:text-slate-300'
                          }`}
                        >
                          {topic.label}
                        </button>
                      ))}
                    </div>

                    {/* Output generator textbox */}
                    <div className="relative">
                      <textarea
                        readOnly
                        rows={8}
                        value={
                          pitchTopic === 'frustrated'
                            ? `Estimada Dirección Escolar,\n\nLe escribo de forma personalizada tras observar una creciente preocupación por los retos de autorregulación y tolerancia a la frustración infantil en las aulas.\n\nHe diseñado una ponencia práctica de 60 minutos dirigida a sus padres de familia titulada: "El colapso de la tolerancia a la frustración infantil: Cómo reconstruir límites en casa".\n\n¿Tendría disponibles 5 minutos esta semana para explorar cómo podemos implementar esta conferencia patrocinada en su colegio bajo el respaldo de Nexo Educativo?\n\nAtentamente,\nJorge Saavedra\nConsultor Pedagógico & Conferencista\nWhatsApp: +52 33 1828 6167`
                            : pitchTopic === 'habitos'
                            ? `Estimado(a) Director(a),\n\n¿Cómo influye la falta de estudio autónomo en casa en el rendimiento académico de sus alumnos? He desarrollado una conferencia-taller titulada "Hábitos de Estudio sin Lágrimas: Activación de la Autonomía Infantil".\n\nEstá pensada para entrenar a sus padres en rutinas efectivas, aliviando la carga académica a sus maestros. ¿Le parece bien si platicamos brevemente este jueves por la mañana para presentarle los detalles?\n\nAtentamente,\nJorge Saavedra\nWhatsApp: +52 33 1828 6167`
                            : `Estimado(a) Director(a),\n\nLa brecha corresponsable entre las familias y el cuerpo docente está generando altos niveles de deserción emocional en las escuelas. He preparado una auditoría y capacitación express titulada "Alianza Escuela-Hogar: Sinergia para el Aprendizaje Coorresponsable".\n\nMe gustaría presentarle el marco pedagógico de Nexo Educativo en una sesión virtual rápida de zoom de 5 minutos el próximo martes. ¿Tiene disponibilidad en su agenda?\n\nQuedo a sus órdenes.\nJorge Saavedra\nWhatsApp: +52 33 1828 6167`
                        }
                        className="w-full bg-slate-950 border border-slate-850 p-4 rounded-xl text-xs font-mono leading-relaxed text-slate-300 focus:outline-none focus:border-brand-blue-500"
                      />

                      <button
                        onClick={() => {
                          const val = pitchTopic === 'frustrated'
                            ? `Estimada Dirección Escolar,\n\nLe escribo de forma personalizada tras observar una creciente preocupación por los retos de autorregulación y tolerancia a la frustración infantil en las aulas.\n\nHe diseñado una ponencia práctica de 60 minutos dirigida a sus padres de familia titulada: "El colapso de la tolerancia a la frustración infantil: Cómo reconstruir límites en casa".\n\n¿Tendría disponibles 5 minutos esta semana para explorar cómo podemos implementar esta conferencia patrocinada en su colegio bajo el respaldo de Nexo Educativo?\n\nAtentamente,\nJorge Saavedra\nConsultor Pedagógico & Conferencista\nWhatsApp: +52 33 1828 6167`
                            : pitchTopic === 'habitos'
                            ? `Estimado(a) Director(a),\n\n¿Cómo influye la falta de estudio autónomo en casa en el rendimiento académico de sus alumnos? He desarrollado una conferencia-taller titulada "Hábitos de Estudio sin Lágrimas: Activación de la Autonomía Infantil".\n\nEstá pensada para entrenar a sus padres en rutinas efectivas, aliviando la carga académica a sus maestros. ¿Le parece bien si platicamos brevemente este jueves por la mañana para presentarle los detalles?\n\nAtentamente,\nJorge Saavedra\nWhatsApp: +52 33 1828 6167`
                            : `Estimado(a) Director(a),\n\nLa brecha corresponsable entre las familias y el cuerpo docente está generando altos niveles de deserción emocional en las escuelas. He preparado una auditoría y capacitación express titulada "Alianza Escuela-Hogar: Sinergia para el Aprendizaje Coorresponsable".\n\nMe gustaría presentarle el marco pedagógico de Nexo Educativo en una sesión virtual rápida de zoom de 5 minutos el próximo martes. ¿Tiene disponibilidad en su agenda?\n\nQuedo a sus órdenes.\nJorge Saavedra\nWhatsApp: +52 33 1828 6167`;
                          navigator.clipboard.writeText(val);
                          setIsCopied(true);
                          setTimeout(() => setIsCopied(false), 2000);
                        }}
                        className="absolute right-3.5 bottom-3.5 bg-brand-blue-500 hover:bg-brand-blue-600 text-white font-bold text-[10px] px-3.5 py-2 rounded-lg leading-none transition-all uppercase cursor-pointer"
                      >
                        {isCopied ? '¡Copiado! 📋' : 'Copiar Mensaje'}
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: LEADS & CONTACT INQUIRIES REGISTER */}
              {activeStratTab === 'leads' && (
                <div className="space-y-6 max-w-5xl animate-fade-in">
                  
                  {/* Summary Stats Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Total Solicitudes</span>
                      <span className="text-2xl font-extrabold text-white">{contactLeads.length}</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">⚠️ Pendientes</span>
                      <span className="text-2xl font-extrabold text-amber-500">
                        {contactLeads.filter(l => l.status === 'Pendiente').length}
                      </span>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">💬 Contactados</span>
                      <span className="text-2xl font-extrabold text-sky-400">
                        {contactLeads.filter(l => l.status === 'Contactado').length}
                      </span>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">✅ Finalizados</span>
                      <span className="text-2xl font-extrabold text-emerald-400">
                        {contactLeads.filter(l => l.status === 'Finalizado').length}
                      </span>
                    </div>
                  </div>

                  {/* Filter Pills Bar */}
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 shrink-0">
                        <Icon name="Filter" className="h-3 w-3 text-slate-400" />
                        Filtrar por Estado:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(['Todos', 'Pendiente', 'Contactado', 'Finalizado'] as const).map(status => {
                          const count = status === 'Todos' 
                            ? contactLeads.length 
                            : contactLeads.filter(l => l.status === status).length;
                          const isActive = statusFilter === status;
                          return (
                            <button
                              key={status}
                              onClick={() => setStatusFilter(status)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                isActive
                                  ? status === 'Pendiente'
                                    ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/10'
                                    : status === 'Contactado'
                                    ? 'bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/10'
                                    : status === 'Finalizado'
                                    ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/10'
                                    : 'bg-white text-slate-950 shadow-sm'
                                  : 'bg-slate-800 hover:bg-slate-750 text-slate-300'
                              }`}
                            >
                              {status === 'Todos' ? '📂' : status === 'Pendiente' ? '⚠️' : status === 'Contactado' ? '💬' : '✅'} {status} ({count})
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Mostrando <span className="font-bold text-white">
                        {contactLeads.filter(l => statusFilter === 'Todos' || l.status === statusFilter).length}
                      </span> de {contactLeads.length} registros
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 bg-slate-900/60 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white">Registro Privado de Clientes y Prospectos</h4>
                        <p className="text-[11px] text-slate-400">
                          Aquí se guardan las consultas enviadas por el formulario de contacto del sitio web. Solo tú puedes verlas en esta sesión autorizada.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {contactLeads.length > 0 && (
                          <>
                            <button
                              onClick={() => {
                                const headers = 'ID,Fecha,Estado,Nombre,Correo,Telefono,Rol,Taller,Mensaje\n';
                                const rows = contactLeads.map(l => 
                                  `"${l.id}","${l.date}","${l.status}","${l.name.replace(/"/g, '""')}","${l.email}","${l.phone}","${l.role}","${l.workshopId}","${l.message.replace(/"/g, '""')}"`
                                ).join('\n');
                                const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.setAttribute('href', url);
                                link.setAttribute('download', `Contactos_NexoEducativo_${new Date().toISOString().split('T')[0]}.csv`);
                                link.click();
                              }}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
                            >
                              📥 Exportar Excel
                            </button>
                            <button
                              onClick={handleClearAllLeads}
                              className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-950/70 text-rose-350 border border-rose-900/50 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
                            >
                              🗑️ Limpiar Todo
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {contactLeads.length === 0 ? (
                      <div className="p-12 text-center space-y-3">
                        <div className="w-12 h-12 bg-slate-800/80 rounded-2xl flex items-center justify-center text-slate-500 mx-auto">
                          <Icon name="Inbox" className="h-6 w-6" />
                        </div>
                        <p className="text-xs font-semibold text-slate-400 font-sans">No hay solicitudes de asesoría registradas todavía.</p>
                        <p className="text-[10px] text-slate-500 max-w-sm mx-auto font-sans">
                          Cuando los usuarios llenen el formulario interactivo de abajo, sus datos de contacto y mensajes de interés aparecerán aquí en tiempo real de forma segura.
                        </p>
                      </div>
                    ) : contactLeads.filter(l => statusFilter === 'Todos' || l.status === statusFilter).length === 0 ? (
                      <div className="p-12 text-center space-y-2">
                        <div className="w-10 h-10 bg-slate-800/55 rounded-2xl flex items-center justify-center text-slate-500 mx-auto">
                          <Icon name="Search" className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-400">Ninguna solicitud coincide con el filtro "{statusFilter}"</p>
                        <button 
                          onClick={() => setStatusFilter('Todos')}
                          className="text-[10px] text-brand-blue-400 underline font-extrabold uppercase hover:text-brand-blue-350 cursor-pointer"
                        >
                          Ver todas las solicitudes
                        </button>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-800/60 font-sans">
                        {contactLeads
                          .filter(l => statusFilter === 'Todos' || l.status === statusFilter)
                          .map((lead) => {
                            const matchingWorkshop = WORKSHOPS.find(w => w.id === lead.workshopId);
                            const currentStatus = lead.status || 'Pendiente';
                            const isExpanded = expandedLeadId === lead.id;
                            const draftText = aiReplyDrafts[lead.id];
                            const isGenerating = generatingReplyForId === lead.id;

                            return (
                              <div 
                                key={lead.id} 
                                className={`transition-all duration-300 border-l-4 border-b border-slate-800/60 ${
                                  isExpanded ? 'bg-slate-900/40 p-6 space-y-5' : 'hover:bg-slate-900/10 p-4 space-y-2'
                                } ${
                                  currentStatus === 'Pendiente'
                                    ? 'border-l-amber-500/80'
                                    : currentStatus === 'Contactado'
                                    ? 'border-l-sky-500/80'
                                    : 'border-l-emerald-500/80'
                                }`}
                              >
                                {/* Header / Trigger Bar */}
                                <div 
                                  onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
                                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none text-left"
                                >
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap text-slate-400">
                                      <span className="text-[10px] font-bold font-mono">
                                        ⏱️ {lead.date}
                                      </span>
                                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider border ${
                                        lead.role === 'director' 
                                          ? 'bg-blue-950 text-blue-300 border-blue-900' 
                                          : lead.role === 'teacher'
                                          ? 'bg-orange-950 text-orange-300 border-orange-900'
                                          : 'bg-emerald-950 text-emerald-300 border-emerald-900'
                                      }`}>
                                        👤 {lead.role === 'director' ? 'Directivo Escolar' : lead.role === 'teacher' ? 'Docente' : 'Padre de Familia'}
                                      </span>
                                      {lead.workshopId && lead.workshopId !== 'General' && (
                                        <span className="text-[9px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-full font-bold">
                                          🏷️ {matchingWorkshop ? matchingWorkshop.title.split(':')[0] : lead.workshopId}
                                        </span>
                                      )}
                                      
                                      {/* Visual Status Indicator */}
                                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider border flex items-center gap-1 ${
                                        currentStatus === 'Pendiente'
                                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                          : currentStatus === 'Contactado'
                                          ? 'bg-sky-505/10 text-sky-400 border-sky-505/20'
                                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                      }`}>
                                        {currentStatus === 'Pendiente' ? '⚠️' : currentStatus === 'Contactado' ? '💬' : '✅'} {currentStatus}
                                      </span>
                                    </div>
                                    <h5 className="text-[14px] font-bold text-white flex items-center gap-2.5">
                                      {lead.name}
                                      <span className="text-[10px] text-slate-505 font-semibold flex items-center gap-1">
                                        {isExpanded ? (
                                          <><span>▲</span> <span className="underline select-none text-rose-450">Contraer detalles</span></>
                                        ) : (
                                          <><span>▼</span> <span className="underline select-none text-brand-blue-400">Ver detalles, notas e IA</span></>
                                        )}
                                      </span>
                                    </h5>
                                  </div>

                                  {/* Actions Block (Interactive Status Picker + Trash button) */}
                                  <div 
                                    className="flex items-center gap-2.5 self-start sm:self-center"
                                    onClick={(e) => e.stopPropagation()} // Stop propagation from status selection
                                  >
                                    {/* Dropdown status selector */}
                                    <div className="bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 shrink-0">
                                      <span className="text-[9px] font-black uppercase text-slate-500">Estado:</span>
                                      <select
                                        value={currentStatus}
                                        onChange={(e) => handleChangeLeadStatus(lead.id, e.target.value as 'Pendiente' | 'Contactado' | 'Finalizado')}
                                        className={`bg-transparent text-xs font-extrabold focus:outline-none cursor-pointer pr-1 w-28 ${
                                          currentStatus === 'Pendiente'
                                            ? 'text-amber-500'
                                            : currentStatus === 'Contactado'
                                            ? 'text-sky-400'
                                            : 'text-emerald-400'
                                        }`}
                                      >
                                        <option value="Pendiente" className="bg-slate-900 text-amber-500 font-bold">⚠️ Pendiente</option>
                                        <option value="Contactado" className="bg-slate-900 text-sky-400 font-bold">💬 Contactado</option>
                                        <option value="Finalizado" className="bg-slate-900 text-emerald-400 font-bold">✅ Finalizado</option>
                                      </select>
                                    </div>

                                    <button
                                      onClick={() => handleDeleteLead(lead.id)}
                                      className="p-1.5 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                                      title="Eliminar registro"
                                    >
                                      <Icon name="Trash2" className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>

                                {/* Collapsed Preview (if not expanded, show a tiny teaser) */}
                                {!isExpanded && (
                                  <div className="text-[11px] text-slate-400 truncate pl-1 max-w-2xl italic text-left">
                                    "{lead.message}"
                                  </div>
                                )}

                                {/* Extended UI content when expanded */}
                                {isExpanded && (
                                  <div className="pt-2 grid grid-cols-1 lg:grid-cols-12 gap-5 font-sans text-left">
                                    
                                    {/* Left Column (Details, Message, and Notes) */}
                                    <div className="lg:col-span-7 space-y-4">
                                      
                                      {/* Contact badges */}
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-850">
                                        <a 
                                          href={`mailto:${lead.email}`}
                                          className="flex items-center gap-2 text-xs text-slate-400 hover:text-brand-blue-400 transition-colors"
                                        >
                                          <Icon name="Mail" className="h-3.5 w-3.5 text-brand-blue-500 shrink-0" />
                                          <span className="truncate underline font-mono font-semibold">{lead.email}</span>
                                        </a>
                                        <a 
                                          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="flex items-center gap-2 text-xs text-slate-400 hover:text-brand-green-400 transition-colors"
                                        >
                                          <Icon name="Phone" className="h-3.5 w-3.5 text-brand-green-500 shrink-0" />
                                          <span className="font-mono underline font-semibold">{lead.phone} (Ir a WhatsApp)</span>
                                        </a>
                                      </div>

                                      {/* Customer inquiry message */}
                                      <div className="space-y-1">
                                        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                          <Icon name="MessageSquare" className="h-3 w-3 text-slate-500" />
                                          Mensaje del cliente:
                                        </span>
                                        <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl text-xs text-slate-200 italic leading-relaxed font-semibold">
                                          "{lead.message}"
                                        </div>
                                      </div>

                                      {/* Admin notes space */}
                                      <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <Icon name="FileText" className="h-3 w-3 text-brand-blue-400" />
                                            Notas de Seguimiento y Acuerdos:
                                          </span>
                                          <span className="text-[9px] text-slate-500 font-mono">💾 Auto-guardado</span>
                                        </div>
                                        <textarea
                                          value={lead.notes || ''}
                                          onChange={(e) => handleSaveLeadNotes(lead.id, e.target.value)}
                                          placeholder="Escribe notas de seguimiento aquí... (ej. 'Llamarlo el lunes', 'Envió cotización')"
                                          className="w-full h-24 bg-slate-950/90 border border-slate-800 hover:border-slate-700 focus:border-brand-blue-500/70 focus:outline-none p-3.5 rounded-xl text-xs text-slate-200 leading-relaxed font-sans"
                                        />
                                      </div>
                                    </div>

                                    {/* Right Column (AI-Powered Automated Reply Assistant) */}
                                    <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between gap-4">
                                      <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="flex h-2 w-2 relative shrink-0">
                                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue-400 opacity-75"></span>
                                              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue-500"></span>
                                            </span>
                                            <span className="text-[10px] font-black uppercase text-slate-300 tracking-wider">Asistente de Respuesta IA</span>
                                          </div>
                                          <span className="text-[9px] bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700 text-slate-400 font-bold font-mono shrink-0">
                                            Nexo Consultor
                                          </span>
                                        </div>
                                        <p className="text-[11px] text-slate-400 leading-normal">
                                          Genera una propuesta personalizada de respuesta adaptada al perfil del contacto, su interés y las notas guardadas.
                                        </p>
                                      </div>

                                      {/* Generated AI Answer Block */}
                                      {draftText ? (
                                        <div className="space-y-2 text-left">
                                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block font-mono">Propuesta redactada por IA:</span>
                                          <div className="bg-slate-950/90 border border-slate-850 p-3 h-48 overflow-y-auto rounded-xl text-[11px] text-slate-300 whitespace-pre-wrap font-sans leading-relaxed selection:bg-brand-blue-500/30">
                                            {draftText}
                                          </div>
                                          <div className="grid grid-cols-2 gap-2 text-left">
                                            <button
                                              onClick={() => {
                                                navigator.clipboard.writeText(draftText);
                                                alert('¡Propuesta copiada en el portapapeles! 📋');
                                              }}
                                              className="w-full py-2 bg-slate-850 hover:bg-slate-750 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 border border-slate-750"
                                            >
                                              📋 Copiar texto
                                            </button>
                                            <a
                                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(draftText)}`}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="w-full py-2 bg-emerald-700 hover:bg-emerald-650 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 font-sans text-center inline-block"
                                            >
                                              💬 WhatsApp
                                            </a>
                                          </div>
                                        </div>
                                      ) : isGenerating ? (
                                        <div className="bg-slate-950/70 border border-slate-850 p-6 flex flex-col items-center justify-center text-center space-y-3 rounded-xl h-48 animate-pulse text-slate-400">
                                          <div className="w-1.5 h-1.5 rounded-full bg-brand-blue-400 animate-ping"></div>
                                          <div>
                                            <p className="text-xs font-bold text-slate-300">Generando Propuesta...</p>
                                            <p className="text-[10px] text-slate-505 mt-1 max-w-xs text-slate-500">Nexo Consultor IA está analizando los dolores e intereses para diseñar un texto empático y persuasivo.</p>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="bg-slate-950/40 border border-slate-800 p-6 flex flex-col items-center justify-center text-center space-y-2 rounded-xl h-48 text-slate-500">
                                          <Icon name="Sparkles" className="h-5 w-5 text-slate-650 shrink-0" />
                                          <p className="text-[10px] text-slate-405 font-bold text-slate-400">¿Listo para dar seguimiento?</p>
                                          <p className="text-[9px] text-slate-500 max-w-xs">Haz clic en el botón de abajo para redactar de forma inteligente una respuesta orientada al cierre.</p>
                                        </div>
                                      )}

                                      {!isGenerating && (
                                        <button
                                          onClick={() => handleGenerateAiReply(lead)}
                                          className="w-full py-2.5 bg-brand-blue-500 hover:bg-brand-blue-600 hover:shadow-md text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                                        >
                                          <Icon name="Sparkles" className="h-3.5 w-3.5" />
                                          {draftText ? '✨ Volver a generar con IA' : '✨ Generar Propuesta de Respuesta (IA)'}
                                        </button>
                                      )}
                                    </div>

                                  </div>
                                )}

                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>

            {/* Bottom Panel Disclaimer */}
            <div className="bg-slate-900 border-t border-slate-800 p-4 px-6 text-[10px] text-slate-500 flex justify-between items-center shrink-0">
              <span>* Alianza y Potenciamiento Estratégico 2026. Todos los análisis están adaptados al mercado pedagógico mexicano.</span>
              <span className="font-semibold text-brand-orange-500">Jorge Saavedra x Nexo Educativo</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
