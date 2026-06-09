/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';
import { Workshop } from '../types';

/**
 * Generates and downloads a professional, corporate-styled PDF Brochure 
 * representing the selected workshop, formatted according to Nexo Educativo branding.
 */
export function generateWorkshopBrochure(workshop: Workshop): void {
  // Create a Letter-sized PDF (Letter is 612 pt wide x 792 pt long)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter'
  });

  const marginX = 50;
  const pageWidth = 612;
  const contentWidth = pageWidth - (marginX * 2); // 512 pt printable width
  let y = 45; // vertical cursor tracker

  // ---- 1. BRAND TOP ACCENT BANNER ----
  doc.setFillColor(249, 115, 22); // Nexo Orange: #f97316
  doc.rect(0, 0, pageWidth, 10, 'F');
  
  // ---- 2. BRAND HEADER ----
  y += 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(30, 41, 59); // Slate-800
  doc.text('NEXO', marginX, y);
  
  const nexoTextWidth = doc.getTextWidth('NEXO ');
  doc.setTextColor(249, 115, 22); // Nexo Orange
  doc.text('EDUCATIVO', marginX + nexoTextWidth, y);

  // Subtitle/Tagline (Right-aligned or below)
  y += 14;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // Slate-400
  doc.text('FORTALECIENDO FAMILIAS Y CENTROS ESCOLARES', marginX, y);
  doc.text('Consultora Pedagógica e Institucional', marginX, y + 11);

  // Subtle separator line
  y += 22;
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.setLineWidth(1);
  doc.line(marginX, y, pageWidth - marginX, y);

  // ---- 3. BROCHURE INDICATOR & WORKSHOP TITLE ----
  y += 25;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // Slate-400
  doc.text('FOLLETO INFORMATIVO DE TALLER', marginX, y);

  // Type Badge (Escuela para Padres / Capacitación Docente)
  const typeText = workshop.type === 'family' ? 'ESCUELA PARA PADRES' : 'DOSSIER INFORMATIVO; CAPACITACIÓN';
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const badgeWidth = doc.getTextWidth(typeText) + 12;
  doc.setFillColor(243, 244, 246); // Gray-100
  doc.roundedRect(pageWidth - marginX - badgeWidth, y - 9, badgeWidth, 14, 4, 4, 'F');
  doc.setTextColor(75, 85, 99); // Gray-600
  doc.text(typeText, pageWidth - marginX - badgeWidth + 6, y);

  // Workshop Title
  y += 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // Slate-950
  
  // Wrap Title if too long
  const titleLines = doc.splitTextToSize(workshop.title.toUpperCase(), contentWidth);
  doc.text(titleLines, marginX, y);
  y += (titleLines.length - 1) * 20;

  // Workshop Slogan
  y += 18;
  doc.setFont('helvetica', 'oblique');
  doc.setFontSize(10.5);
  doc.setTextColor(71, 85, 105); // Slate-700
  const sloganLines = doc.splitTextToSize(`"${workshop.slogan}"`, contentWidth);
  doc.text(sloganLines, marginX, y);
  y += sloganLines.length * 13;

  // ---- 4. METADATA BRIEF INFO BLOCK ----
  y += 12;
  doc.setFillColor(248, 250, 252); // Slate-50 background card
  doc.setDrawColor(241, 245, 249); // Slate-100 border
  doc.roundedRect(marginX, y, contentWidth, 42, 8, 8, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // Slate-500
  
  // Text inside the brief card
  doc.text('DURACIÓN PREVISTA:', marginX + 15, y + 17);
  doc.text('METODOLOGÍA:', marginX + 260, y + 17);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(249, 115, 22); // Orange accent for values
  doc.text(workshop.duration, marginX + 15, y + 31);
  
  doc.setTextColor(2, 132, 199); // Blue accent for methodology
  doc.text(workshop.methodology, marginX + 260, y + 31);

  y += 42;

  // ---- 5. WORKSHOP DESCRIPTION ----
  y += 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text('1. SINOPSIS DEL PROGRAMA', marginX, y);

  y += 14;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85); // Slate-700
  const descLines = doc.splitTextToSize(workshop.description, contentWidth);
  // Iterate and output description lines with proper spacing
  descLines.forEach((line: string) => {
    doc.text(line, marginX, y);
    y += 13.5;
  });

  // ---- 6. OBJECTIVES ----
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text('2. OBJETIVOS ESPECÍFICOS', marginX, y);

  y += 14;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85); // Slate-700

  workshop.objectives.forEach((obj: string) => {
    // Bullet pointer
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(249, 115, 22); // Orange bullet
    doc.text('✦', marginX + 5, y);
    
    // Wrapped text of objective
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const objLines = doc.splitTextToSize(obj, contentWidth - 22);
    objLines.forEach((line: string, index: number) => {
      doc.text(line, marginX + 20, y);
      if (index < objLines.length - 1) {
        y += 13;
      }
    });
    y += 13.5;
  });

  // ---- 7. TOPICS / SYLLABUS ----
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text('3. EJES TEMÁTICOS Y CONTENIDO', marginX, y);

  y += 14;
  
  // Create beautiful mini boxes or bullet rows for Topics
  workshop.topics.forEach((topic: string, index: number) => {
    // Elegant number bullet icon
    const orderNum = `${index + 1}.`;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(2, 132, 199); // Blue numbers #0284c7
    doc.text(orderNum, marginX + 5, y);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    const topicLines = doc.splitTextToSize(topic, contentWidth - 25);
    topicLines.forEach((line: string, indexLine: number) => {
      doc.text(line, marginX + 22, y);
      if (indexLine < topicLines.length - 1) {
        y += 13;
      }
    });

    y += 14;
  });

  // ---- 8. FOOTER / CONTACT INFO ----
  // Move footer lower in the Letter page (total height=792), say around 700 - 710 pt
  y = 705;

  // Decorative border
  doc.setDrawColor(241, 245, 249);
  doc.setLineWidth(1.5);
  doc.line(marginX, y, pageWidth - marginX, y);

  // Bold branding footer text
  y += 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59); // Slate-800
  doc.text('NEXO EDUCATIVO • MÁS INFORMACIÓN Y RESERVA DE FECHAS', marginX, y);

  // Secondary contact text
  y += 12;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text('Consulte adaptaciones curriculares, fechas en Guadalajara y talleres en formato virtual.', marginX, y);

  y += 11;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(2, 132, 199); // Blue contact details
  doc.text('Correo: contacto@nexoeducativo.com  |  WhatsApp: +52 33 1828 6167  |  Guadalajara, Jalisco', marginX, y);

  // Bottom brand banner
  doc.setFillColor(2, 132, 199); // Brand Blue: #0284c7
  doc.rect(0, 782, pageWidth, 10, 'F');

  // Trigger download file
  const safeTitle = workshop.title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9]+/g, '_') // replace non-alphanumeric characters with underscores
    .replace(/(^_+|_+$)/g, ''); // trim underscores

  doc.save(`Nexo_Educativo_Folleto_${safeTitle}.pdf`);
}
