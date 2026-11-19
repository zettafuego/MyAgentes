/** Nodos del visor AR reorientados al portafolio de Eduardo */
export type AgentId =
  | 'supervisor'
  | 'crm'
  | 'bi'
  | 'devops'
  | 'security'
  | 'db-gate'
  | 'quantum-core';

export interface AgentNode {
  id: AgentId;
  name: string;
  spectral: string;
  x: number;
  y: number;
  z: number;
  tools: number;
  latency: number;
  cognitiveLoad: number;
  status: string;
  description: string;
}

export const AGENTS: AgentNode[] = [
  {
    id: 'supervisor',
    name: 'Eduardo · Core',
    spectral: 'G',
    x: 0,
    y: 0,
    z: 0,
    tools: 8,
    latency: 0,
    cognitiveLoad: 45,
    status: 'PORTAFOLIO ACTIVO',
    description: 'Núcleo del portafolio: ingeniería, arte y tatuaje.',
  },
  {
    id: 'crm',
    name: 'Tatuaje · Zettafuego',
    spectral: 'G',
    x: -45,
    y: 40,
    z: 1.2,
    tools: 3,
    latency: 4.3,
    cognitiveLoad: 28,
    status: '10 AÑOS EN PIEL',
    description: 'Línea fina, neotradicional y color. Galería real.',
  },
  {
    id: 'bi',
    name: 'SSOMA · Ops',
    spectral: 'M',
    x: 65,
    y: -30,
    z: -4.8,
    tools: 5,
    latency: 20.3,
    cognitiveLoad: 72,
    status: 'ALTO RIESGO OK',
    description: 'Seguridad, permisología y minería subterránea.',
  },
  {
    id: 'devops',
    name: 'Tech · Código',
    spectral: 'A',
    x: -70,
    y: -60,
    z: 8.6,
    tools: 4,
    latency: 8.6,
    cognitiveLoad: 12,
    status: 'PYTHON / REACT',
    description: 'Python, React, Unity, Blender, low-code e IA.',
  },
  {
    id: 'security',
    name: 'ISO · SIG',
    spectral: 'K',
    x: 80,
    y: 50,
    z: -2.3,
    tools: 2,
    latency: 10.5,
    cognitiveLoad: 18,
    status: '9001 · 14001 · 45001',
    description: 'Sistemas de gestión y cumplimiento normativo.',
  },
  {
    id: 'db-gate',
    name: 'Bellas Artes',
    spectral: 'B',
    x: -15,
    y: -95,
    z: 25,
    tools: 1,
    latency: 25,
    cognitiveLoad: 92,
    status: 'PINTURA 2020',
    description: 'Egresado en bellas artes, mención pintura.',
  },
  {
    id: 'quantum-core',
    name: 'IA · Maestría',
    spectral: 'M',
    x: 95,
    y: -90,
    z: 582,
    tools: 6,
    latency: 582,
    cognitiveLoad: 85,
    status: 'EN CURSO 2026-27',
    description: 'Maestría en Inteligencia Artificial e innovación.',
  },
];

export const AGENT_METRICS: Record<
  AgentId,
  { roi: string; metric1: string; metric2: string }
> = {
  supervisor: { roi: 'CORE', metric1: 'LIMA, PERÚ', metric2: 'ONLINE' },
  crm: { roi: '10+ AÑOS', metric1: '16 PIEZAS', metric2: 'GALERÍA' },
  bi: { roi: 'SSOMA', metric1: 'MINERÍA 2A', metric2: 'HVAC OK' },
  devops: { roi: 'TECH', metric1: 'UNITY', metric2: 'REACT' },
  security: { roi: 'ISO', metric1: 'PETS/ATS', metric2: 'ALTO RIESGO' },
  'db-gate': { roi: 'ARTE', metric1: 'PINTURA', metric2: 'DISEÑO' },
  'quantum-core': { roi: 'IA', metric1: 'MAESTRÍA', metric2: 'LLM' },
};

export const AGENT_STREAMS: Partial<Record<AgentId, string[]>> = {
  crm: ['TATTOO: Flash disponible', 'CITA: WhatsApp / llamada', 'STYLE: Línea fina OK', 'STYLE: Neotrad color'],
  bi: ['SSOMA: IPERC listo', 'OPS: PETAR altura', 'MINA: Subterránea', 'KPI: Dashboard live'],
  devops: ['CODE: Python / React', 'GAME: Unity build', 'AI: Prompt ready', 'APP: Low-code deploy'],
  security: ['ISO: 45001 active', 'SIG: Documentación', 'SAFE: Zero multas', 'TRAIN: Capacitaciones'],
  'db-gate': ['ARTE: Boceto listo', 'PINTURA: Estudio', 'DESIGN: Concepto', 'INK: Transfer OK'],
  'quantum-core': ['IA: Modelo en curso', 'ML: OpenCV', 'DATA: Pandas', 'API: FastAPI'],
};

export const AGENT_DIAGNOSTICS: Record<
  AgentId,
  { class: string; behavior: string; synergy: string; coupling: string; uptime: string }
> = {
  supervisor: {
    class: 'Portafolio Integral',
    behavior: 'Une ingeniería, SSOMA, tech y tatuaje en una sola marca personal.',
    synergy: 'Eduardo ➔ Todas las facetas',
    coupling: 'Lima · Remoto · Estudio',
    uptime: 'Disponible',
  },
  crm: {
    class: 'Tatuador · Zettafuego',
    behavior: '10 años en piel: línea fina, neotradicional y color a medida.',
    synergy: 'Tatuaje ➔ Cliente (cita)',
    coupling: 'WhatsApp · Email · Estudio',
    uptime: '10+ años',
  },
  bi: {
    class: 'Líder SSOMA / Ops',
    behavior: 'Gestión de seguridad, permisos y operaciones de alto estándar.',
    synergy: 'SSOMA ➔ Cumplimiento',
    coupling: 'ISO · PETS · Dashboards',
    uptime: '4+ años lead',
  },
  devops: {
    class: 'Builder Tech',
    behavior: 'Apps, videojuegos y automatización con stack moderno.',
    synergy: 'Tech ➔ Innovación',
    coupling: 'Python · React · Unity',
    uptime: 'Activo',
  },
  security: {
    class: 'SIG & Alto Riesgo',
    behavior: 'Sistemas ISO y trabajos de altura, caliente y confinados.',
    synergy: 'SIG ➔ Operaciones seguras',
    coupling: 'IPERC · PETAR · ATS',
    uptime: '100%',
  },
  'db-gate': {
    class: 'Artista plástico',
    behavior: 'Formación en bellas artes y mención en pintura.',
    synergy: 'Arte ➔ Tatuaje',
    coupling: 'Dibujo · Color · Composición',
    uptime: 'Egresado 2020',
  },
  'quantum-core': {
    class: 'IA & Futuro',
    behavior: 'Maestría en IA y experimentación con modelos y visión.',
    synergy: 'IA ➔ Productos',
    coupling: 'LLM · OpenCV · FastAPI',
    uptime: '2026–27',
  },
};

export type TopicId =
  | 'SoporteEmpresarial'
  | 'OperacionesBackoffice'
  | 'AnalisisDecision'
  | 'DesarrolloDevOps';
