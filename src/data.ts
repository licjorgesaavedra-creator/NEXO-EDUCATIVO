/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Workshop, Service } from './types';

export const SERVICES: Service[] = [
  {
    id: 'acompanamiento-familia',
    title: 'Acompañamiento Familiar',
    description: 'Charlas y consultorías emocionales y académicas orientadas a fortalecer la sinergia en el hogar.',
    iconName: 'HeartHandshake',
    benefits: [
      'Herramientas prácticas de disciplina positiva',
      'Estrategias de comunicación no violenta',
      'Gestión emocional y apoyo escolar'
    ]
  },
  {
    id: 'liderazgo-comunitario',
    title: 'Liderazgo y Relación Escuela-Familia',
    description: 'Mentoría pedagógica para directivos enfocada en el fortalecimiento de la alianza corresponsable con las familias.',
    iconName: 'Compass',
    benefits: [
      'Canales de comunicación asertivos escuela-hogar',
      'Involucramiento activo de padres de familia',
      'Clima de confianza y colaboración institucional'
    ]
  },
  {
    id: 'talleres-parentales',
    title: 'Escuela para Padres de Familia',
    description: 'Espacios dinámicos presenciales y online diseñados con metodologías activas para dotar de herramientas reales.',
    iconName: 'Sparkles',
    benefits: [
      'Sesiones de diseño y role-playing interactivo',
      'Materiales de trabajo y plantillas personalizadas',
      'Resolución de casos de crianza cotidianos'
    ]
  }
];

export const WORKSHOPS: Workshop[] = [
  // Padre de Familia (Family)
  {
    id: 'comunicacion-asertiva-hogar',
    title: 'Comunicación Asertiva en el Hogar: Conversar para Conectar',
    type: 'family',
    slogan: 'Aprende a comunicarte con tus hijos desde el respeto, la empatía y la firmeza amorosa.',
    description: 'Este taller práctico brinda a padres y tutores estrategias vivenciales para resolver conflictos diarios sin recurrir a gritos ni amenazas, promoviendo una escucha activa real.',
    duration: '2 sesiones de 2 horas (4 horas en total)',
    methodology: 'Dinámica de casos reales, role-playing supervisado y pautas paso a paso interactivos.',
    objectives: [
      'Identificar los desencadenantes de la comunicación reactiva en el hogar.',
      'Aplicar la técnica del mensaje "Yo" para expresar necesidades de manera constructiva.',
      'Escuchar de forma activa validando las emociones de los hijos.'
    ],
    topics: [
      'El modelo de comunicación reactiva vs. proactiva',
      'La empatía y la validación emocional como primeros auxilios',
      'Estrategias de resolución pacífica de conflictos familiares',
      'Acuerdos en frío: cómo y cuándo conversar de verdad'
    ],
    iconName: 'MessageSquareShare'
  },
  {
    id: 'habitos-estudio-casa',
    title: 'Hábitos de Estudio sin Lágrimas: El Éxito Escolar en Casa',
    type: 'family',
    slogan: 'Cómo establecer una rutina autónoma de estudio, reduciendo el estrés en el hogar.',
    description: 'Transforma las tareas escolares de ser un campo de batalla diario a una oportunidad de crecimiento autónomo. Aprende a acondicionar el entorno y motivar sanamente.',
    duration: '1 sesión intensiva de 3 horas',
    methodology: 'Taller de diseño compartido. Saldrás con una plantilla de rutina y planificador personalizada.',
    objectives: [
      'Organizar rutinas y espacios que faciliten la concentración y la disciplina autónoma.',
      'Fomentar la automotivación sin depender únicamente de recompensas externas.',
      'Acompañar sin intervenir excesivamente en el proceso escolar autónomo.'
    ],
    topics: [
      'Neuroeducación básica aplicada al estudio and la concentración',
      'Diseño del espacio óptimo en casa y el organizador visual',
      'El rol de la frustración en el aprendizaje y cómo gestionarla',
      'La rutina de la tarde paso a paso'
    ],
    iconName: 'BookOpen'
  },
  {
    id: 'limites-disciplina-positiva',
    title: 'Límites con Amor: Disciplina Positiva y Firmeza Emocional',
    type: 'family',
    slogan: 'Establece límites claros e inmediatos que eduquen en vez de solo castigar.',
    description: 'Un taller diseñado para enseñar a los padres a poner consecuencias lógicas de forma consistente y respetuosa, guiando las conductas de modo que estimule el autocontrol.',
    duration: '2 sesiones de 2 horas (4 horas en total)',
    methodology: 'Análisis de videocasos prácticos, ejercicios individuales y foros de debate grupal.',
    objectives: [
      'Diferenciar entre castigo punitivo y consecuencias lógicas formativas.',
      'Establecer acuerdos explícitos compartidos que los hijos puedan asimilar.',
      'Mantener la calma interna ante los desbordes emocionales.'
    ],
    topics: [
      'Qué es y qué no es la disciplina positiva en la actualidad',
      'Los cuatro objetivos erróneos de la conducta según Adler',
      'Cómo diseñar consecuencias lógicas coherentes e inmediatas',
      'El rincón de la calma y la autorregulación guiada'
    ],
    iconName: 'Heart'
  },
  {
    id: 'educacion-digital-familia',
    title: 'Vínculos en la Red: Crianza Positiva en la Era de las Pantallas',
    type: 'family',
    slogan: 'Equilibra el uso de la tecnología y recupera el tiempo de conexión familiar.',
    description: 'Descubre cómo establecer acuerdos digitales saludables que no aíslen a tus hijos de la tecnología, sino que les enseñen autorregulación, bienestar digital y seguridad.',
    duration: '1 sesión interactiva de 2.5 horas',
    methodology: 'Panel de discusión, autoevaluación familiar con applets interactivos y diseño de un contrato digital.',
    objectives: [
      'Comprender el impacto neurológico del consumo excesivo de pantallas.',
      'Diseñar un "Contrato Tecnológico Familiar" personalizado y aceptado por todos.',
      'Descubrir alternativas recreativas no digitales atractivas para cada edad.'
    ],
    topics: [
      'El cerebro infantil y juvenil ante el scroll infinito de dopamina',
      'Estrategias prácticas de mediación parental y controles preventivos',
      'Herramientas pedagógicas para el bienestar digital individual',
      'Redescubriendo el tiempo compartido fuera de línea'
    ],
    iconName: 'Smartphone'
  },
  {
    id: 'liderazgo-colaborativo-escuela',
    title: 'Liderazgo Colaborativo: Sinergia entre Directivos, Docentes y Familias',
    type: 'school',
    slogan: 'Construyendo puentes de corresponsabilidad para un proyecto educativo unificado y exitoso.',
    description: 'Este taller capacita a equipos directivos y docentes en el codiseño de estrategias de comunicación institucional, gestión de comités y alianzas activas con padres de familia, neutralizando conflictos y alineando objetivos comunes.',
    duration: '1 sesión presencial u online de 4 horas',
    methodology: 'Estudios de caso, taller interactivo de planes de comunicación escolar y dinámicas grupales de liderazgo.',
    objectives: [
      'Establecer canales claros y asertivos para el intercambio de información formativa clave.',
      'Involucrar de manera constructiva a los padres en las metas académicas y formativas del ciclo.',
      'Gestionar y mitigar desacuerdos de forma profesional, asegurando un clima de mutuo respeto.'
    ],
    topics: [
      'El mapa de corresponsabilidad: roles de la escuela y de la familia',
      'Estrategias de comunicación institucional asertiva y ágil',
      'Co-diseño de comités y asambleas escolares productivas e inspiradoras',
      'Protocolos de resolución pacífica de conflictos entre padres y docentes'
    ],
    iconName: 'Users'
  },
  {
    id: 'alianza-escuela-hogar-acuerdos',
    title: 'Acuerdos que Suman: Fortaleciendo la Alianza Escuela-Hogar',
    type: 'family',
    slogan: 'Cómo trabajar de la mano con los docentes de tus hijos para potenciar su formación integral.',
    description: 'Aprende a estructurar juntas constructivas con maestros, entender los planes curriculares y alinear el lenguaje formativo de casa con la escuela para asegurar el máximo bienestar pedagógico de tus hijos.',
    duration: '1 sesión interactiva de 3 horas',
    methodology: 'Simulación de entrevistas con docentes, dinámicas de comunicación asertiva y guías de autoanálisis escolar.',
    objectives: [
      'Sincronizar el lenguaje de valores y límites con las normas de convivencia del centro escolar.',
      'Estructurar diálogos de colaboración positiva en juntas familiares y entrevistas de evaluación.',
      'Acompañar las tareas y el desarrollo escolar del estudiante en corresponsabilidad con el maestro.'
    ],
    topics: [
      'El triángulo formativo: estudiante, escuela y familia',
      'Cómo prepararse para una entrevista escolar de alto impacto y propositiva',
      'Evitando el sobreinvolucramiento y la desatención: el justo equilibrio',
      'Alineación de límites formativos entre el salón de clases y el hogar'
    ],
    iconName: 'HeartHandshake'
  },
  {
    id: 'formacion-habitos-rutinas',
    title: 'Formación de Hábitos y Rutinas Clave: Edificando Escenarios Inteligentes',
    type: 'family',
    slogan: 'Cómo automatizar conductas colectivas positivas para el desarrollo diario en el hogar.',
    description: 'Aprende a estructurar el entorno visual, diseñar cuadros de hábitos adaptados por etapa escolar, y utilizar técnicas psicopedagógicas basadas en reforzadores naturales para establecer rutinas sanas sin generar resistencia en los hijos.',
    duration: '2 sesiones de 2 horas (4 horas en total)',
    methodology: 'Co-creación guiada de tableros de hábitos familiares y plantillas interactivas descargables.',
    objectives: [
      'Maquetar rutinas matutinas y nocturnas eficientes que los niños puedan seguir autónomamente.',
      'Emplear el encadenamiento de conductas para asimilar hábitos nuevos sobre otros consolidados.',
      'Reducir la dependencia de recordatorios verbales repetitivos en las dinámicas del hogar.'
    ],
    topics: [
      'La anatomía científica del hábito: disparador, rutina y recompensa',
      'Diseño de organizadores visuales y tableros interactivos por edad',
      'El paso de la supervisión directa a la supervisión remota formativa',
      'Rutinas de autocuidado, orden personal y descanso saludable'
    ],
    iconName: 'Clock'
  },
  {
    id: 'sembrando-autonomia-responsabilidad',
    title: 'Sembrando Autonomía: Guía Práctica para Formar Hijos Responsables',
    type: 'family',
    slogan: 'Enséñale a tomar decisiones coherentes, asumir consecuencias y resolver sus propios retos.',
    description: 'Este programa brinda las bases psicopedagógicas para delegar responsabilidades acordes al desarrollo de cada menor, desde tareas domésticas hasta la planeación de sus deberes escolares, creando un sentido real de contribución familiar.',
    duration: '1 sesión intensiva de 3.5 horas',
    methodology: 'Pistas prácticas, resolución guiada de dilemas cotidianos de crianza y análisis formativo.',
    objectives: [
      'Determinar qué tareas delegar de forma segura según la edad y madurez psicomotriz del menor.',
      'Fomentar la resiliencia permitiendo que los hijos afronten consecuencias lógicas directas.',
      'Implementar juntas familiares cooperativas para resolver de forma colectiva el reparto de labores.'
    ],
    topics: [
      'La trampa de la sobreprotección: efectos a mediano y largo plazo',
      'Estrategias de andamiaje: de "Hacerlo juntos" a "Hacerlo por sí mismo"',
      'Estructuración de tareas del hogar y tabla de contribuciones comunitarias',
      'El fomento del autoanálisis: preguntas socráticas ante las equivocaciones'
    ],
    iconName: 'Target'
  }
];

export const TESTIMONIALS = [
  {
    quote: "La consultoría para nuestro equipo directivo cambió drásticamente la sinergia laboral. Nos ayudó a estructurar reuniones dinámicas y un liderazgo más participativo.",
    author: "Mtra. Silvia Mendoza",
    role: "Directora General de Instituto Pedagógico del Norte"
  },
  {
    quote: "El taller de Hábitos de Estudio nos devolvió la paz a las tardes en casa. Mis dos hijos ahora comprenden sus tiempos de estudio independientes y nosotros sabemos cómo acompañar sin pelear.",
    author: "Carlos E. Valenzuela",
    role: "Padre de familia (Educación Primaria)"
  },
  {
    quote: "Espectacular formación en innovación educativa. He aplicado el micro-ABP con mis alumnos de secundaria y su nivel de compromiso creció exponencialmente.",
    author: "Prof. Alejandro Ruiz",
    role: "Docente de Ciencias Naturales"
  }
];
