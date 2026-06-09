/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SERVICES } from '../data';
import Icon from './Icon';

interface ServicesSectionProps {
  onServiceSelect: (serviceId: string) => void;
}

export default function ServicesSection({ onServiceSelect }: ServicesSectionProps) {
  return (
    <section id="servicios" className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <h2 className="font-display text-sm font-bold text-brand-sky-600 uppercase tracking-widest">
            Nuestros Pilares Educativos
          </h2>
          <p className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            Capacitación a tu medida y Consultoría de alto valor
          </p>
          <div className="h-1 w-20 bg-brand-orange-500 mx-auto rounded-full"></div>
          <p className="font-sans text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
            Ayudamos a construir una marca pedagógica de excelencia escolar y familiar a través de metodologías ágiles, disciplina positiva y acompañamiento experto.
          </p>
        </div>

        {/* Services Grid with beautiful interactive cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES.map((service, index) => {
            // Distribute borders or coloring depending on column index
            const isOrangeVariant = index % 2 === 0;

            return (
              <div
                key={service.id}
                className={`group relative flex flex-col justify-between rounded-3xl bg-white p-6 shadow-md transition-all hover:shadow-xl border transform hover:-translate-y-1.5 ${
                  isOrangeVariant 
                    ? 'border-brand-orange-100/50 hover:border-brand-orange-500/30' 
                    : 'border-brand-sky-100/50 hover:border-brand-sky-500/30'
                }`}
              >
                <div>
                  
                  {/* Service Icon Plate */}
                  <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl transition-all group-hover:scale-105 ${
                    isOrangeVariant 
                      ? 'bg-brand-orange-100 text-brand-orange-600' 
                      : 'bg-brand-sky-100 text-brand-sky-600'
                  }`}>
                    <Icon name={service.iconName} className="h-6 w-6" />
                  </div>

                  {/* Title and Description */}
                  <h3 className="font-display text-lg font-bold text-gray-900 mb-3 group-hover:text-brand-orange-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="font-sans text-sm text-gray-500 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Bullet Benefits list */}
                  <ul className="space-y-3.5 pt-4 border-t border-gray-50">
                    {service.benefits.map((benefit, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5 text-xs text-gray-600 font-medium">
                        <Icon name="CheckCircle2" className={`h-4 w-4 shrink-0 mt-0.5 ${
                          isOrangeVariant ? 'text-brand-orange-500' : 'text-brand-sky-500'
                        }`} />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                </div>

                {/* Micro CTA at bottom */}
                <div className="pt-6 mt-6 border-t border-gray-50/50">
                  <button
                    onClick={() => onServiceSelect(service.id)}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all ${
                      isOrangeVariant 
                        ? 'text-brand-orange-600 hover:text-brand-orange-700' 
                        : 'text-brand-sky-600 hover:text-brand-sky-700'
                    }`}
                  >
                    Saber más sobre {service.title}
                    <Icon name="ChevronRight" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Core Capabilities highlights box */}
        <div className="mt-16 bg-linear-to-r from-brand-orange-50 to-brand-sky-50 rounded-3xl p-8 border border-white/60 shadow-inner lg:flex items-center justify-between gap-8">
          <div className="space-y-2 max-w-2xl">
            <h4 className="font-display text-lg font-bold text-gray-900 flex items-center gap-2">
              <Icon name="Award" className="h-5 w-5 text-brand-orange-500" />
              ¿Por qué confiar tu capacitación en NEXO EDUCATIVO?
            </h4>
            <p className="font-sans text-sm text-gray-600 leading-relaxed">
              Nuestra fundadora cuenta con amplia trayectoria en capacitación de docentes, diseño instruccional y consultoría escolar institucional. Creamos talleres prácticos que disminuyen la resistencia y elevan los resultados de aprendizaje inmediatamente.
            </p>
          </div>
          <div className="mt-6 lg:mt-0 shrink-0">
            <a 
              href="#contacto"
              className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-gray-900 border border-transparent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
            >
              Agendar Asesoría Gratuita
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
