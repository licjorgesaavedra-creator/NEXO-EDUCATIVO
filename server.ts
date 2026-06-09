/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// AI Consultant Route
app.post('/api/consultant', async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'El mensaje es obligatorio' });
  }

  if (!ai) {
    return res.json({
      text: "¡Hola! Estoy configurado en modo demostración porque la variable de entorno GEMINI_API_KEY no se ha configurado todavía en los Secretos. \n\nNo te preocupes, como Nexo Consultor IA te sugiero que para estos temas enfoques tu atención en **reunir voluntades escolares** o programar una consulta presencial con el director de **Nexo Educativo**. \n\nPara resolver dudas de comunicación, el taller **'Comunicación Asertiva en el Hogar'** es maravilloso.",
      suggestedWorkshops: ['comunicacion-asertiva-hogar']
    });
  }

  try {
    const systemInstruction = `
Eres "Nexo Consultor", el asesor educativo virtual e inteligente de la empresa de capacitación "NEXO EDUCATIVO".
El eslogan es: "La conexión entre escuela, familia y aprendizaje."

Tu misión es asesorar de forma profesional, práctica, muy empática y comprensiva a docentes, directores de escuelas y padres de familia que buscan resolver retos educativos y pedagógicos.

La experiencia principal de la consultora es:
1. Formación docente.
2. Innovación educativa.
3. Desarrollo profesional de maestros.
4. Acompañamiento a padres de familia.
5. Liderazgo educativo.

Catálogo de talleres oficiales de NEXO EDUCATIVO (Usa estos IDs exactos al detectarlos):
- 'comunicacion-asertiva-hogar': "Comunicación Asertiva en el Hogar" (Para padres: empatía, evitar gritos, disciplina positiva).
- 'habitos-estudio-casa': "Hábitos de Estudio sin Lágrimas" (Para padres: organización, motivación autónoma en casa).
- 'limites-disciplina-positiva': "Límites con Amor: Disciplina Positiva y Firmeza Emocional" (Para padres: consecuencias lógicas formativas).
- 'educacion-digital-familia': "Vínculos en la Red: Crianza Positiva en la Era de las Pantallas" (Para padres: bienestar y límites con la tecnología).
- 'liderazgo-colaborativo-escuelas': "Liderazgo Colaborativo: Equipos Docentes de Alto Impacto" (Para escuelas: liderazgo compartido para directivos y docentes).
- 'innovacion-educativa-aula': "Innovación en el Aula: Experiencias de Aprendizaje Significativo" (Para escuelas: metodologías activas y clase invertida).
- 'evaluacion-formativa-retroalimentacion': "Evaluación Formativa y Retroalimentación Efectiva" (Para escuelas: evaluación diagnóstica, feedforward).
- 'alianza-escuela-familia': "Alianza Escuela-Familia: Co-creando la Comunidad" (Para escuelas: empatía con padres y corresponsabilidad).

INSTRUCCIONES DE RESPUESTA:
1. Sé increíblemente empático/a. Conéctate con la frustración del padre o el docente. Ofrece palabras sinceras de aliento.
2. Analiza el reto presentado y brinda 2-3 recomendaciones prácticas, realistas e inmediatas que el usuario puede empezar a aplicar hoy mismo.
3. Al final, identifica y recomiéndale de 1 a 2 talleres específicos de NEXO EDUCATIVO que encajen perfectamente con su reto. Dile: "Para profundizar en este reto, te invitamos a revisar nuestro taller..."
4. Tu respuesta debe estar formateada de manera clara con Markdown agradable (negritas, viñetas, saltos de línea). No incluyas información técnica interna.

Escribe tu respuesta en español de forma amena, cercana y profesional.
`;

    // Construct contents from history + current message
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        contents.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        });
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const textOutput = response.text || "Lo siento, no pude procesar la consulta en este momento.";

    // Simple heuristic to extract recommended IDs from catalog
    const suggestedWorkshops: string[] = [];
    const workshopIds = [
      'comunicacion-asertiva-hogar',
      'habitos-estudio-casa',
      'limites-disciplina-positiva',
      'educacion-digital-familia',
      'liderazgo-colaborativo-escuelas',
      'innovacion-educativa-aula',
      'evaluacion-formativa-retroalimentacion',
      'alianza-escuela-familia',
    ];

    workshopIds.forEach(id => {
      if (textOutput.toLowerCase().includes(id.toLowerCase())) {
        suggestedWorkshops.push(id);
      }
    });

    // Fallbacks based on manual mentions or simple word associations if IDs weren't output directly
    if (suggestedWorkshops.length === 0) {
      if (textOutput.toLowerCase().includes('comunicación') || textOutput.toLowerCase().includes('comunicacion')) {
        suggestedWorkshops.push('comunicacion-asertiva-hogar');
      }
      if (textOutput.toLowerCase().includes('hábito') || textOutput.toLowerCase().includes('habito') || textOutput.toLowerCase().includes('estudio')) {
        suggestedWorkshops.push('habitos-estudio-casa');
      }
      if (textOutput.toLowerCase().includes('liderazgo') || textOutput.toLowerCase().includes('lider')) {
        suggestedWorkshops.push('liderazgo-colaborativo-escuelas');
      }
    }

    res.json({
      text: textOutput,
      suggestedWorkshops: suggestedWorkshops.slice(0, 2),
    });
  } catch (error: any) {
    console.error('Error in consultant endpoint:', error);
    res.status(500).json({
      error: 'Error de conexión con el servicio de IA.',
      text: 'Ocurrió un error al procesar tu consulta con la IA. No te preocupes, puedes enviarnos un mensaje y te contactaremos de inmediato. Mientras tanto, puedes explorar nuestros talleres en la sección correspondiente.',
    });
  }
});

// AI Lead Reply Draft Generator Route
app.post('/api/generate-reply', async (req, res) => {
  const { lead } = req.body;

  if (!lead || !lead.name) {
    return res.status(400).json({ error: 'La información del prospecto es obligatoria.' });
  }

  if (!ai) {
    // Elegant fallback draft when Gemini API Key is disabled or not set
    const fallbackMessage = `Estimada/o ${lead.name},

¡Qué gusto saludarle! Soy Jorge Saavedra, fundador de Nexo Educativo. He estado leyendo con mucha atención su solicitud sobre: "${lead.message}". 

Entiendo que busca resolver este reto relacionado con el rol de ${lead.role === 'director' ? 'Liderazgo Escolar' : lead.role === 'teacher' ? 'Docencia y Aula' : 'Dinámica Familiar-Hogar'}. Nos encantaría platicar de qué manera podemos implementar o adaptar una de nuestras capacitaciones para apoyarle de forma práctica e inmediata.

${lead.notes ? `*Hemos tomado nota especial de sus comentarios de seguimiento:* "${lead.notes}"\n` : ''}
Me gustaría invitarle a tener una breve sesión de exploración de 10-15 minutos (vía Zoom o llamada telefónica) esta misma semana para coordinar fechas y brindarle una propuesta que se adapte perfectamente a su presupuesto y grupo. 

¿Le parece bien que conversemos mañana a las 3:30 PM o prefiere el miércoles por la mañana? 

Quedo completamente a sus órdenes.

Atentamente,
**Jorge Saavedra**
Fundador, Nexo Educativo 🌟`;

    return res.json({ text: fallbackMessage });
  }

  try {
    const prompt = `Eres Jorge Saavedra, fundador y director principal de "NEXO EDUCATIVO", una prestigiada empresa de capacitación pedagógica y talleres para escuelas y familias bajo el lema "La conexión entre escuela, familia y aprendizaje".

Tu objetivo es redactar un borrador de respuesta oficial de alta calidad, increíblemente empático, comercialmente persuasivo y profesional, diseñado para responder a la solicitud de asesoría de un cliente interesado.

Información del lead:
- Nombre del Prospecto: ${lead.name}
- Rol: ${lead.role} (${lead.role === 'director' ? 'Directivo de Colegio/Escuela' : lead.role === 'teacher' ? 'Profesor/Docente escolar' : 'Padre/Madre de Familia'})
- Taller seleccionado: ${lead.workshopId}
- Mensaje completo enviado: "${lead.message}"
- Notas de seguimiento agregadas por el administrador (Úsalas para personalizar la respuesta si existen): "${lead.notes || 'No hay notas adicionales'}"

Directrices para la redacción:
1. Sé increíblemente empático. Conéctate con sus necesidades particulares y el taller en el que se interesó.
2. Comienza con un saludo natural, profesional y muy cálido en español.
3. Propón una breve reunión o llamada de exploración de 10 minutos (vía Zoom, llamada o presencial si aplica) con Jorge Saavedra para platicar de las necesidades específicas y coordinar una cotización a la medida.
4. Redacta el mensaje en un formato directo que sea idóneo para ser enviado por WhatsApp o correo electrónico. Utiliza saltos de línea abundantes, emojis cordiales y viñetas para que la lectura sea fluida.
5. Firma obligatoriamente al final como "Jorge Saavedra - Fundador de Nexo Educativo". No utilices marcadores de posición o corchetes como "[Tu Nombre]" o "[Fecha]". Escribe una propuesta lista para copiar y pegar.

Escribe la respuesta directa en español:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        temperature: 0.6,
      },
    });

    const textOutput = response.text || "No se pudo generar el borrador en este momento.";
    res.json({ text: textOutput });
  } catch (error: any) {
    console.error('Error generating AI reply:', error);
    res.status(500).json({ error: 'Error al generar la respuesta de IA.' });
  }
});

// Serve static elements and support Vite routing
async function initServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production builds serve final generated React assets
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Nexo Educativo] Servidor activo en puerto: ${PORT}`);
  });
}

initServer().catch((err) => {
  console.error('Error iniciando el hosting:', err);
});
