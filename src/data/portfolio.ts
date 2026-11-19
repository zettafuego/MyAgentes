export const PROFILE = {
  name: 'Eduardo Yampier Sanchez Cotrina',
  shortName: 'Eduardo Sanchez',
  alias: 'Zettafuego',
  title: 'Ingeniería · SSOMA · Innovación · Arte & Tatuaje',
  tagline: '10 años tatuando · Ingeniería de Minas · IA & Tecnología',
  city: 'Lima, Perú',
  phone: '977 740 994',
  email: 'eduardoxstrange@gmail.com',
  address: 'Jr. Tellería 1365 Dpto. 101 — Cercado de Lima',
  cvUrl: '/EduardoSanchezCV2026.pdf',
  summary:
    'Profesional líder en Mantenimiento, SSOMA e Innovación Tecnológica, con formación en Ingeniería de Minas (UNC), estudios de Maestría en Inteligencia Artificial y en Conflictos Socioambientales. Más de 4 años liderando gestión, seguridad y monitoreo ambiental —incluyendo 2 años en minería subterránea—. Artista plástico y tatuador con 10 años de trayectoria: línea fina, neotradicional y color.',
  highlights: [
    { value: '10+', label: 'Años tatuando' },
    { value: '4+', label: 'Años SSOMA / ops' },
    { value: 'IA', label: 'Maestría en curso' },
    { value: 'Bellas Artes', label: 'Egresado pintura' },
  ],
};

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  bullets: string[];
}

export const EXPERIENCE: ExperienceItem[] = [
  {
    company: 'SINBA SURA S.A.C. — Lima',
    role: 'Coordinador Técnico (SSOMA / Permisología / Tecnología)',
    period: 'Dic 2025 – Jun 2026',
    bullets: [
      'Liderazgo SSOMA en residuos sólidos y biofábrica (Lima, Arequipa, VES).',
      'Permisos críticos ante PRODUCE, MINAM y Municipalidad de Lima — cero multas.',
      'Dashboards Looker Studio / Power BI: −35% tiempo de consolidación de KPIs.',
      'Apps web y automatización con Python, JavaScript y low-code.',
    ],
  },
  {
    company: 'Corporación Metal Frío del Perú',
    role: 'Supervisor Calidad HVAC (Proyecto Starbucks Angamos)',
    period: 'May – Jun 2026',
    bullets: [
      'Calidad y seguridad HVAC / metalmecánica.',
      'Dossier de calidad, IPERC, PETS, ATS y PETAR (altura, caliente, confinados).',
    ],
  },
  {
    company: 'National Facilities S.A.C.',
    role: 'Supervisor SSOMA Mantenimiento',
    period: 'Mar – Jun 2025',
    bullets: [
      'Seguridad en electromecánica, HVAC, SCI y transportes verticales.',
      'Clientes: Parque Arauco, Plaza Vea, Divemotor, MacroPolis, Mitsui, BMV.',
    ],
  },
  {
    company: 'Waffles Tech — Remoto',
    role: 'Coordinador de Innovación y Desarrollo Tecnológico',
    period: 'Jun 2024 – actualidad',
    bullets: [
      'Equipos multidisciplinarios con Scrum: software, videojuegos y cultura.',
      'Unity, Blender, apps y prototipos; fondos RENCA / Ministerio de Cultura.',
    ],
  },
  {
    company: 'Sociedad Minera Camila 2008 — Huancayo',
    role: 'Supervisor SSOMA / Administrativo',
    period: 'Nov 2022 – Nov 2023',
    bullets: [
      'Procedimientos seguros en unidad minera; OPEX/CAPEX con foco en seguridad.',
      'Inventarios de explosivos (Matpel), ATS y PETS.',
    ],
  },
  {
    company: 'American Real Estate SAC — Áncash',
    role: 'Supervisor de desmontaje / SSOMA',
    period: 'Oct 2020 – Nov 2022',
    bullets: [
      'Desmontaje de flotación Cu/Zn/Pb en Pucarrajo con alto estándar de seguridad.',
      'PETAR, altura, izaje, caliente y monitoreo ambiental (DAM).',
    ],
  },
];

export const EDUCATION = [
  {
    school: 'Universidad para el Desarrollo Andino',
    detail: 'Maestría en Inteligencia Artificial (2026–2027)',
  },
  {
    school: 'Universidad Nacional de Cajamarca',
    detail: 'Maestría en gestión de conflictos socioambientales · Bachiller Ingeniería de Minas (2021)',
  },
  {
    school: 'Universidad Nacional de Arte Mario Urteaga — Cajamarca',
    detail: 'Egresado en Bellas Artes, mención pintura (2020)',
  },
  {
    school: 'EGED / ENCAP',
    detail: 'Diplomados en SSOMA (2020, 2024)',
  },
  {
    school: 'UNMSM',
    detail: 'Computación científica — 6to ciclo',
  },
];

export const SKILLS = {
  tech: ['Python', 'JavaScript', 'React', 'Kotlin', 'Pandas', 'OpenCV', 'Unity', 'Blender', 'Claude Code', 'Low-code'],
  ssoma: ['ISO 9001 / 14001 / 45001', 'IPERC', 'PETS / ATS / PETAR', 'Trabajos alto riesgo', 'Looker Studio', 'Power BI', 'SIG'],
  art: ['Tatuaje (10 años)', 'Línea fina', 'Neotradicional', 'Color', 'Pintura', 'Diseño'],
};

export const TATTOO_STYLES = [
  { id: 'fine-line', name: 'Línea fina', desc: 'Trazo limpio, minimalismo y piezas delicadas.' },
  { id: 'neotrad', name: 'Neotradicional', desc: 'Color saturado, contornos fuertes y narrativa visual.' },
  { id: 'color', name: 'Color & detalle', desc: 'Sombras, joyas, fauna y composiciones densas.' },
  { id: 'custom', name: 'Diseño a medida', desc: 'Conceptos personales, flash y proyectos grandes.' },
];

export interface TattooWork {
  id: string;
  src: string;
  title: string;
  style: string;
  alt: string;
}

/** Galería desde public/tattoos (carpeta Buena suerte) */
export const TATTOOS: TattooWork[] = [
  { id: '01', src: '/tattoos/tattoo-01.jpg', title: 'Pieza 01', style: 'Estudio', alt: 'Tatuaje por Eduardo Sanchez / Zettafuego' },
  { id: '02', src: '/tattoos/tattoo-02.jpg', title: 'Pieza 02', style: 'Estudio', alt: 'Tatuaje por Eduardo Sanchez / Zettafuego' },
  { id: '03', src: '/tattoos/tattoo-03.jpg', title: 'Manos — línea fina', style: 'Línea fina', alt: 'Tatuaje de manos en línea fina' },
  { id: '04', src: '/tattoos/tattoo-04.jpg', title: 'Pieza 04', style: 'Estudio', alt: 'Tatuaje por Eduardo Sanchez / Zettafuego' },
  { id: '05', src: '/tattoos/tattoo-05.jpg', title: 'Tigre & serpiente', style: 'Neotradicional', alt: 'Tatuaje neotradicional tigre y serpiente — Zettafuego' },
  { id: '06', src: '/tattoos/tattoo-06.jpg', title: 'Pieza 06', style: 'Estudio', alt: 'Tatuaje por Eduardo Sanchez / Zettafuego' },
  { id: '07', src: '/tattoos/tattoo-07.jpg', title: 'Pieza 07', style: 'Estudio', alt: 'Tatuaje por Eduardo Sanchez / Zettafuego' },
  { id: '08', src: '/tattoos/tattoo-08.jpg', title: 'Pieza 08', style: 'Estudio', alt: 'Tatuaje por Eduardo Sanchez / Zettafuego' },
  { id: '09', src: '/tattoos/tattoo-09.jpg', title: 'Pieza 09', style: 'Estudio', alt: 'Tatuaje por Eduardo Sanchez / Zettafuego' },
  { id: '10', src: '/tattoos/tattoo-10.jpg', title: 'Pieza 10', style: 'Estudio', alt: 'Tatuaje por Eduardo Sanchez / Zettafuego' },
  { id: '11', src: '/tattoos/tattoo-11.jpg', title: 'Pieza 11', style: 'Estudio', alt: 'Tatuaje por Eduardo Sanchez / Zettafuego' },
  { id: '12', src: '/tattoos/tattoo-12.jpg', title: 'Pieza 12', style: 'Estudio', alt: 'Tatuaje por Eduardo Sanchez / Zettafuego' },
  { id: '13', src: '/tattoos/tattoo-13.jpg', title: 'Pieza 13', style: 'Estudio', alt: 'Tatuaje por Eduardo Sanchez / Zettafuego' },
  { id: '14', src: '/tattoos/tattoo-14.jpg', title: 'Pieza 14', style: 'Estudio', alt: 'Tatuaje por Eduardo Sanchez / Zettafuego' },
  { id: '15', src: '/tattoos/tattoo-15.jpg', title: 'Pieza 15', style: 'Estudio', alt: 'Tatuaje por Eduardo Sanchez / Zettafuego' },
  { id: '16', src: '/tattoos/tattoo-16.jpg', title: 'Pieza 16', style: 'Estudio', alt: 'Tatuaje por Eduardo Sanchez / Zettafuego' },
];

export const SCROLL_VOICE = [
  '',
  'Eduardo Sanchez, diez años tatuando. Portafolio Zettafuego.',
  'Ingeniería, SSOMA e innovación tecnológica con impacto real.',
  'Arte, pintura y tatuaje. Formación en bellas artes y minería.',
  'Lima, Perú. Disponible para proyectos y citas de tatuaje.',
];
